import networkx as nx

def find_highest_risk_path(graph: nx.DiGraph):
    # 1. Identify entry points (workstations) and the target (crown jewel)
    entry_points = []
    target = None
    
    for node_id, attrs in graph.nodes(data=True):
        if attrs.get('type') == 'workstation':
            entry_points.append(node_id)
        if attrs.get('is_crown_jewel') or attrs.get('crown_jewel') or attrs.get('type') == 'database':
            if not target or (not attrs.get('type') == 'database' and (attrs.get('is_crown_jewel') or attrs.get('crown_jewel'))):
                target = node_id
    
    if not target:
        return {"error": "No target found"}
        
    if not entry_points:
        return {"error": "No entry points found"}

    # 3. Compute traversal cost per edge that is INVERSE to risk_weight
    for u, v, attrs in graph.edges(data=True):
        risk_weight = attrs.get('risk_weight', 1.0)
        attrs['traversal_cost'] = 1 / (risk_weight + 0.1)
        
    best_path = None
    lowest_cost = float('inf')
    best_entry = None
    
    # 4. For every entry point, run shortest_path to the target
    for ep in entry_points:
        try:
            path = nx.shortest_path(graph, source=ep, target=target, weight='traversal_cost')
            cost = nx.path_weight(graph, path, weight='traversal_cost')
            if cost < lowest_cost:
                lowest_cost = cost
                best_path = path
                best_entry = ep
        except nx.NetworkXNoPath:
            continue
            
    if not best_path:
        return {"error": "No valid path found to target"}
        
    # 5. Compute risk_score (0-10 scale) based on average CVSS severity of nodes along it
    node_scores = []
    hops = []
    
    for node_id in best_path:
        attrs = graph.nodes[node_id]
        hops.append({
            "id": node_id,
            "name": attrs.get('name', 'Unknown'),
            "type": attrs.get('type', 'Unknown')
        })
        
        cves = attrs.get('cves', [])
        cvss_score = max(c.get('score', 0) for c in cves) if cves else 0
        tech_score = attrs.get('technique_risk_score', 0.0)
        
        effective_risk = max(cvss_score, tech_score)
        node_scores.append(effective_risk)
        
    risk_score = sum(node_scores) / len(node_scores) if node_scores else 0
    
    # 6. Return the dictionary
    return {
        "path": best_path,
        "entry_point": best_entry,
        "target": target,
        "risk_score": round(risk_score, 2),
        "hops": hops
    }
