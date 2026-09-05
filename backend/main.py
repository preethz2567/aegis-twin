from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from twin import TwinGraph
from attacker_agent import find_highest_risk_path
from optimizer import recommend_fixes

app = FastAPI(title="AEGIS-TWIN API")

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
