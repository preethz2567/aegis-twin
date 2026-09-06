import random

def generate_network_json(node_count: int = 100):
    if node_count < 10:
        node_count = 10
        
    nodes = []
    edges = []
    
    # Pre-defined CVE sets to randomly attach
    workstation_cves = [
        [
            {"id": "CVE-1999-1133", "score": 4.6, "description": "HP-UX 9.x and 10.x running X windows vulnerability."},
            {"id": "CVE-2002-2275", "score": 2.1, "description": "Fortres 101 bypass vulnerability."}
        ],
        [],
        [{"id": "CVE-2021-34527", "score": 8.8, "description": "PrintNightmare vulnerability in Windows Print Spooler."}]
    ]
    
    server_cves = [
        [
            {"id": "CVE-2009-2629", "score": 7.5, "description": "Buffer underflow in nginx."},
            {"id": "CVE-2009-3896", "score": 5.0, "description": "nginx denial of service via long URI."},
            {"id": "CVE-2009-3898", "score": 4.9, "description": "Directory traversal in nginx WebDAV."}
        ],
        [{"id": "CVE-2021-44228", "score": 10.0, "description": "Log4Shell vulnerability in Apache Log4j2."}],
        []
    ]
    
    # 1. Crown Jewel (Database)
    nodes.append({
        "id": "n1",
        "name": "Primary Production DB",
        "type": "database",
        "cves": [],
        "crown_jewel": True
    })
    
    # 2. VPN Gateway (Entry Point)
    nodes.append({
        "id": "n2",
        "name": "Enterprise VPN Gateway",
        "type": "server",
        "cves": random.choice(server_cves)
    })
    
    # 3. Credential Store
    nodes.append({
        "id": "n3",
        "name": "Active Directory",
        "type": "credential-store",
        "cves": []
    })
    
    # Allocate remaining nodes
    remaining = node_count - 3
    num_servers = int(remaining * 0.2)
    num_workstations = remaining - num_servers
    
    server_ids = ["n1", "n2", "n3"]
    workstation_ids = []
    
    current_id = 4
    
    # Create servers
    for i in range(num_servers):
        node_id = f"n{current_id}"
        nodes.append({
            "id": node_id,
            "name": f"Internal Server {i+1}",
            "type": "server",
            "cves": random.choice(server_cves)
        })
        server_ids.append(node_id)
        current_id += 1
        
    # Create workstations
    for i in range(num_workstations):
        node_id = f"n{current_id}"
        nodes.append({
            "id": node_id,
            "name": f"Workstation {i+1}",
            "type": "workstation",
            "cves": random.choice(workstation_cves)
        })
        workstation_ids.append(node_id)
        current_id += 1
        
    # Generate Edges
    # Connect VPN to a subset of workstations and servers
    for wid in random.sample(workstation_ids, max(1, int(len(workstation_ids) * 0.2))):
        edges.append({"source": "n2", "target": wid, "risk_weight": round(random.uniform(1.0, 6.0), 1)})
        
    for sid in random.sample(server_ids[3:], max(1, int(len(server_ids[3:]) * 0.2))):
        edges.append({"source": "n2", "target": sid, "risk_weight": round(random.uniform(1.0, 6.0), 1)})

    # Connect workstations to internal servers and AD
    for wid in workstation_ids:
        # Every workstation can talk to AD
        edges.append({"source": wid, "target": "n3", "risk_weight": round(random.uniform(1.0, 3.0), 1)})
        
        # Connect to a random server
        if len(server_ids) > 3:
            target_server = random.choice(server_ids[3:])
            edges.append({"source": wid, "target": target_server, "risk_weight": round(random.uniform(2.0, 8.0), 1)})
            
    # Connect AD to servers and DB
    edges.append({"source": "n3", "target": "n1", "risk_weight": round(random.uniform(1.0, 4.0), 1)})
    for sid in server_ids[3:]:
        edges.append({"source": "n3", "target": sid, "risk_weight": round(random.uniform(1.0, 5.0), 1)})
        
    # Connect servers to DB
    for sid in server_ids[3:]:
        if random.random() > 0.5:
            edges.append({"source": sid, "target": "n1", "risk_weight": round(random.uniform(4.0, 9.0), 1)})
            
    return {
        "nodes": nodes,
        "edges": edges
    }

if __name__ == "__main__":
    import json
    data = generate_network_json(10)
    print(json.dumps(data, indent=2))
