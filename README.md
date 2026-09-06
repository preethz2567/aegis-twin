# AEGIS-TWIN

**AEGIS-TWIN** is a full-stack network security visualization and simulation platform. It creates a "digital twin" of a company's network infrastructure to model vulnerabilities, calculate risk weights based on CVSS scores, and proactively simulate cyberattacks.

By leveraging an autonomous attacker agent, AEGIS-TWIN calculates and visualizes the path of least resistance through a network to a designated "Crown Jewel" target, allowing security teams to remediate structural vulnerabilities before they are exploited.


##  Features

- **Live Network Topology Mapping**: Visualizes the network state, identifying workstations, servers, CI/CD runners, and critical databases.
- **D3 Force-Directed Graph**: Interactive, physics-based graph rendering that allows for panning, zooming, and dynamic data exploration.
- **Autonomous Attacker Agent**: A backend engine utilizing Dijkstra's shortest-path algorithm to calculate the highest-risk traversal path based on real CVSS (Common Vulnerability Scoring System) node metrics.
- **Risk Scoring & Hop Analysis**: Evaluates the cumulative risk of a successful breach and displays the exact hop-by-hop sequence an attacker would take.
- **Professional Security Aesthetic**: Clean, dark-themed UI optimized for projector legibility and NOC (Network Operations Center) environments.


## Tech Stack

### Frontend
- **React.js** (Vite)
- **D3.js** (Direct SVG manipulation for high-performance physics graphs)
- **Vanilla CSS** (Custom responsive dark theme)

### Backend
- **Python 3 / FastAPI**
- **NetworkX** (Graph modeling and shortest-path calculation)
- **Uvicorn** (ASGI server)


## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)

### 1. Start the Backend

The backend serves the network state and runs the attack simulation engine.

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (defaults to port 8000)
uvicorn main:app --reload
```
*The API documentation will be available at `http://localhost:8000/docs`.*

### 2. Start the Frontend

The frontend is a Vite-powered React dashboard.

```bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*Navigate to `http://localhost:5173` in your browser.*


##  Usage

1. Open the dashboard in your browser. You will see the network digital twin rendered dynamically.
2. Nodes are color-coded by type, and their radius indicates the severity of their known vulnerabilities.
3. Click the **"Run Attack Simulation"** button in the top right.
4. The backend agent will calculate the path of least resistance to the Crown Jewel.
5. The graph will dim, and the compromised nodes and edges will glow in red to indicate the critical attack path. A risk summary panel will appear detailing the hops.
