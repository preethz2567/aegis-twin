from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from twin import TwinGraph
from attacker_agent import find_highest_risk_path

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
