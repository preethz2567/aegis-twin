<div align="center">

# AEGIS-TWIN

### Autonomous Digital Twin for Adversarial Attack-Path Simulation & Optimal Defense Orchestration

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **We Hack 5.0 Finalist** — AI-Driven Cybersecurity Track

</div>

---

## Overview

**AEGIS-TWIN** is a real-time cybersecurity digital twin platform that models an organisation's network as a live directed graph, autonomously simulates the highest-risk adversarial attack paths through it, and then computes and applies an optimal sequence of security fixes — all without human intervention in the core simulation loop.

The system answers a question that every security team faces but rarely has the tooling to answer quickly:

> *"If an attacker were in our network right now, exactly which path would they take to reach our crown jewels — and what is the single most cost-effective sequence of fixes to cut off that path?"*

---

## Key Features

| Feature | Description |
|---|---|
| **Live Network Twin** | Network topology modelled as a weighted directed graph, persisted in SQLite and hot-swappable without restarts |
| **Attack-Path Simulation** | Dijkstra's algorithm with inverted risk weights finds the highest-threat path from any entry point to the crown jewel |
| **Optimal Fix Orchestration** | Greedy iterative graph optimiser selects the top-3 fixes that maximise risk reduction per action |
| **AI Explanation Layer** | Claude (Anthropic) generates plain-English threat briefings from raw simulation output |
| **Network Profile Management** | Upload custom topologies, switch between profiles live, or generate synthetic enterprise-scale networks (up to 100+ nodes) |
| **Assessment Persistence** | Save, name, and revisit past simulation runs with full detail recall |
| **PDF Report Generation** | One-click export of a full assessment report (attack path, fixes, AI explanation, risk scores) |
| **Real CVE Data** | CVE scores sourced from the NVD public API and cached locally |
| **Force-Directed Visualisation** | Live physics simulation renders the network graph in-browser with attack path and fix highlights |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
│  TwinGraph (force-sim)  │  Panels  │  History  │  Profiles  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                      FastAPI Backend                         │
│                                                              │
│  ┌─────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ TwinGraph   │  │ AttackerAgent  │  │   Optimizer      │  │
│  │ (NetworkX   │→ │ (Dijkstra on   │→ │ (Greedy Fix      │  │
│  │  DiGraph)   │  │  inv. weights) │  │  Selector)       │  │
│  └─────────────┘  └────────────────┘  └──────────────────┘  │
│         │                                      │             │
│  ┌──────▼──────────────────────────────────────▼───────┐    │
│  │              SQLite (SQLAlchemy ORM)                 │    │
│  │   network_profiles table │ assessments table         │    │
│  └──────────────────────────────────────────────────────┘    │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐    │
│  │  Explain Layer (Anthropic Claude)  │  Report (PDF)  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Algorithms

### 1. Adversarial Path Finding — Dijkstra's (Inverted Weights)
Edge weights represent **risk** (sourced from CVSS scores and CVE data). To find the *most dangerous* path, edge weights are inverted:

```
traversal_cost = 1 / (risk_weight + 0.1)
```

`nx.shortest_path` with `traversal_cost` returns the cheapest path for the attacker — which is the highest-risk path for the defender.

### 2. Path Risk Score — CVSS-Weighted Node Average
For each node on the attack path:
```
effective_risk = max(max_CVE_CVSS_score, MITRE_technique_score)
path_risk_score = mean(effective_risk) over all hops  →  [0.0 – 10.0]
```

### 3. Optimal Fix Selection — Greedy Iterative Graph Optimisation
A greedy approximation of the weighted minimum vertex cut problem:
1. For each node on the current path, simulate removing its vulnerabilities on a graph copy
2. Re-run Dijkstra to measure the new risk score
3. Apply the fix that causes the largest drop
4. Repeat for up to 3 iterations

Each fix is annotated with its reason: `high_cvss`, `high_centrality`, `path_chokepoint`, or `technique`.

### 4. Graph Visualisation — Force-Directed Spring Simulation
A Fruchterman-Reingold-style physics engine runs in-browser:
- **Repulsion:** nodes push each other apart (inverse-square law)
- **Attraction:** edges act as springs pulling connected nodes together
- The layout converges to a stable equilibrium each render cycle

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Vanilla CSS |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Graph Engine | NetworkX |
| Database | SQLite via SQLAlchemy ORM |
| AI Layer | Anthropic Claude API |
| PDF Reports | ReportLab |
| CVE Data | NIST NVD Public API (cached) |
| Visualisation | Custom SVG + browser physics simulation |

---

## Project Structure

```
aegis-twin/
├── backend/
│   ├── main.py                  # FastAPI app — all API endpoints
│   ├── twin.py                  # TwinGraph: live network state manager
│   ├── attacker_agent.py        # Dijkstra-based attack path finder
│   ├── optimizer.py             # Greedy fix recommendation engine
│   ├── explain.py               # Claude AI explanation layer
│   ├── report.py                # PDF report generator
│   ├── db.py                    # SQLAlchemy models & DB initialisation
│   ├── generate_large_network.py# Synthetic network generator
│   ├── nvd_client.py            # NVD API client
│   ├── nvd_cache.json           # Cached CVE data
│   ├── requirements.txt
│   └── data/
│       ├── network.json         # Default demo topology
│       └── aegis_twin.db        # SQLite database (git-ignored)
└── frontend/
    └── src/
        ├── App.jsx
        ├── api.js               # Typed API client with error handling
        ├── components/
        │   ├── TwinGraph.jsx    # Force-directed network visualiser
        │   ├── AttackPathPanel.jsx
        │   ├── FixRecommendationsPanel.jsx
        │   ├── ExplanationPanel.jsx
        │   ├── NavBar.jsx
        │   └── ErrorBoundary.jsx
        └── pages/
            ├── DashboardPage.jsx
            ├── HistoryPage.jsx
            ├── HistoryDetailPage.jsx
            └── NetworkProfilesPage.jsx
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/) *(optional — only required for the AI explanation layer)*

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your ANTHROPIC_API_KEY (or leave blank to skip AI explanations)

# Start the server
uvicorn main:app --reload --port 8000
```

The backend will automatically:
- Create the SQLite database at `backend/data/aegis_twin.db`
- Seed the default network topology from `data/network.json`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the app redirects to the Dashboard immediately.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/twin` | Full graph state (nodes + edges) |
| `GET` | `/api/simulate/attack-path` | Run attack-path simulation |
| `GET` | `/api/simulate/optimize` | Run simulation + fix recommendations |
| `GET` | `/api/simulate/explain` | Full simulation + AI explanation |
| `POST` | `/api/apply-fix` | Apply a fix to the live graph |
| `POST` | `/api/reset-simulation` | Reset all applied fixes |
| `POST` | `/api/generate-report` | Generate PDF assessment report |
| `GET` | `/api/assessments` | List saved assessments |
| `POST` | `/api/assessments` | Save a new assessment |
| `GET` | `/api/assessments/{id}` | Get assessment detail |
| `DELETE` | `/api/assessments/{id}` | Delete an assessment |
| `GET` | `/api/profiles` | List network profiles |
| `POST` | `/api/profiles` | Upload a custom network topology |
| `POST` | `/api/profiles/{id}/activate` | Switch active network profile |
| `DELETE` | `/api/profiles/{id}` | Delete a profile |
| `POST` | `/api/profiles/generate-large` | Generate a synthetic large-scale network |

---

## Demo Walkthrough

1. **Dashboard** — The live network graph renders immediately on load, showing the default topology with node types colour-coded
2. **Run Attack Simulation** — Click to trigger Dijkstra's path-finding; the highest-risk path is highlighted on the graph and detailed in the Attack Path panel
3. **Compute Optimal Fixes** — The greedy optimiser runs and presents ranked remediation recommendations; the AI explanation panel generates a plain-English briefing
4. **Apply a Fix** — Click "Apply Fix" on any recommendation to patch that node; the simulation re-runs automatically on the updated graph
5. **Save Assessment** — Name and persist the full simulation state for later reference
6. **Network Profiles** — Upload a custom `network.json`, generate a 100-node synthetic enterprise network, or switch between topologies — the live graph updates instantly
7. **Generate Report** — Export a complete PDF summary of the assessment

---

## Network Topology Format

Custom topologies can be uploaded as JSON following this schema:

```json
{
  "nodes": [
    {
      "id": "n1",
      "name": "Web Server",
      "type": "server",
      "crown_jewel": false,
      "cves": [
        { "id": "CVE-2021-44228", "score": 10.0, "description": "Log4Shell" }
      ]
    }
  ],
  "edges": [
    { "source": "n1", "target": "n2", "risk_weight": 7.5 }
  ]
}
```

**Node types:** `workstation`, `server`, `database`, `ci-cd-runner`, `credential-store`  
**Entry points:** all `workstation` nodes  
**Target:** the node with `"crown_jewel": true` (or the first `database` node)  
**Risk weight:** edge traversal risk on a 0–10 scale

---

## Resilience & Error Handling

- **Global exception handler** on all API endpoints — no raw Python tracebacks exposed to the client
- **React Error Boundary** — rendering crashes show a graceful recovery screen, never a blank page
- **Backend-not-reachable banner** — detected via `TypeError: Failed to fetch` and surfaced as a prominent UI warning distinct from normal API errors
- **Double-click prevention** — all action buttons disable themselves during in-flight requests
- **Active profile protection** — the currently active network profile cannot be deleted

---

## Team

Built at **We Hack 5.0** · AI-Driven Cybersecurity Track

---

<div align="center">

*AEGIS-TWIN — Know your network before the attacker does.*

</div>
