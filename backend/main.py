from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, Any
from twin import TwinGraph
from attacker_agent import find_highest_risk_path
from optimizer import recommend_fixes

import os
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AEGIS-TWIN API")

@app.on_event("startup")
def startup_event():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_key_here":
        print("WARNING: ANTHROPIC_API_KEY not set or still a placeholder — the Explain Layer will not work until backend/.env has a real key.")

class FixRequest(BaseModel):
    node_id: str

class ReportRequest(BaseModel):
    attack_path: dict
    optimization: dict
    explanation: Optional[str] = None

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
