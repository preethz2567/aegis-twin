from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, Any
from twin import TwinGraph
from attacker_agent import find_highest_risk_path
from optimizer import recommend_fixes
import json

from db import init_db, get_db_session, Assessment
from sqlalchemy.orm import Session

import os
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AEGIS-TWIN API")

@app.on_event("startup")
def startup_event():
    init_db()
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_key_here":
        print("WARNING: ANTHROPIC_API_KEY not set or still a placeholder — the Explain Layer will not work until backend/.env has a real key.")

class FixRequest(BaseModel):
    node_id: str

class ReportRequest(BaseModel):
    attack_path: dict
    optimization: dict
    explanation: Optional[str] = None

class AssessmentCreate(BaseModel):
    name: str
    attack_path: dict
    fix_recommendations: dict
    explanation: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

twin_graph = TwinGraph()

@app.get("/api/twin")
def get_twin_state():
    return twin_graph.get_graph_state()

@app.get("/api/simulate/attack-path")
def simulate_attack_path():
    return find_highest_risk_path(twin_graph.graph)

@app.get("/api/simulate/optimize")
def simulate_optimize():
    path_result = find_highest_risk_path(twin_graph.graph)
    if "error" in path_result:
        return {"attack_path": path_result, "optimization": None}
        
    optimization_result = recommend_fixes(twin_graph.graph, path_result)
    return {
        "attack_path": path_result,
        "optimization": optimization_result
    }

@app.get("/api/simulate/explain")
def simulate_explain():
    from explain import generate_explanation
    
    path_result = find_highest_risk_path(twin_graph.graph)
    if "error" in path_result:
        return {"attack_path": path_result, "optimization": None, "explanation": None}
        
    optimization_result = recommend_fixes(twin_graph.graph, path_result)
    explanation = generate_explanation(path_result, optimization_result)
    
    return {
        "attack_path": path_result,
        "optimization": optimization_result,
        "explanation": explanation
    }

@app.post("/api/apply-fix")
def apply_fix(request: FixRequest):
    twin_graph.apply_fix(request.node_id)
    return {"status": "success", "fixed_node": request.node_id}

@app.post("/api/reset-simulation")
def reset_simulation():
    twin_graph.reset_fixes()
    return {"status": "success"}

@app.post("/api/generate-report")
def generate_report(request: ReportRequest):
    from report import generate_pdf_report
    from datetime import datetime
    pdf_bytes = generate_pdf_report(
        request.attack_path,
        request.optimization,
        request.explanation or ""
    )
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="aegis-twin-report-{ts}.pdf"'}
    )

@app.post("/api/assessments")
def create_assessment(request: AssessmentCreate, db: Session = Depends(get_db_session)):
    orig_risk = request.attack_path.get("risk_score", 0.0)
    proj_risk = request.fix_recommendations.get("projected_risk_score", 0.0)
    
    new_assessment = Assessment(
        name=request.name,
        attack_path_json=json.dumps(request.attack_path),
        fix_recommendations_json=json.dumps(request.fix_recommendations),
        explanation_text=request.explanation,
        original_risk_score=orig_risk,
        projected_risk_score=proj_risk
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return {"id": new_assessment.id, "status": "success"}

@app.get("/api/assessments")
def list_assessments(db: Session = Depends(get_db_session)):
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "name": a.name,
            "created_at": a.created_at,
            "original_risk_score": a.original_risk_score,
            "projected_risk_score": a.projected_risk_score
        } for a in assessments
    ]

@app.get("/api/assessments/{id}")
def get_assessment(id: int, db: Session = Depends(get_db_session)):
    a = db.query(Assessment).filter(Assessment.id == id).first()
    if not a:
        return Response(status_code=404)
    return {
        "id": a.id,
        "name": a.name,
        "created_at": a.created_at,
        "network_profile_name": a.network_profile_name,
        "attack_path": json.loads(a.attack_path_json) if a.attack_path_json else {},
        "fix_recommendations": json.loads(a.fix_recommendations_json) if a.fix_recommendations_json else {},
        "explanation": a.explanation_text,
        "original_risk_score": a.original_risk_score,
        "projected_risk_score": a.projected_risk_score
    }

@app.delete("/api/assessments/{id}")
def delete_assessment(id: int, db: Session = Depends(get_db_session)):
    a = db.query(Assessment).filter(Assessment.id == id).first()
    if a:
        db.delete(a)
        db.commit()
    return {"status": "success"}
