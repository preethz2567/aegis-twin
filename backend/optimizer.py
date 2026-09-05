import copy
import networkx as nx
from attacker_agent import find_highest_risk_path

def recommend_fixes(graph: nx.DiGraph, attack_path_result: dict, max_fixes: int = 3):
    original_risk_score = attack_path_result.get('risk_score', 0)
    if original_risk_score == 0:
        return {
            "recommended_fixes": [],
            "total_risk_reduction_percent": 0,
            "original_risk_score": 0,
            "projected_risk_score_after_fixes": 0
        }
        
    recommended_fixes = []
    
    current_graph = copy.deepcopy(graph)
    current_risk_score = original_risk_score
    
    for _ in range(max_fixes):
        best_fix = None
        best_new_score = current_risk_score
        
        current_path_result = find_highest_risk_path(current_graph)
        if "error" in current_path_result or current_path_result.get("risk_score", 0) == 0:
            break
            
        path_nodes = current_path_result['path']
        
        for node_id in path_nodes:
            temp_graph = copy.deepcopy(current_graph)
            
            # Simulate fix: remove vulnerabilities and lower incoming risk weight
            temp_graph.nodes[node_id]['cves'] = []
            for u, v, data in temp_graph.in_edges(node_id, data=True):
                data['risk_weight'] = 0.0 # Make traversal cost high
                
            new_path_result = find_highest_risk_path(temp_graph)
            if "error" in new_path_result:
                new_score = 0.0
            else:
                new_score = new_path_result.get('risk_score', 0.0)
                if new_score == 0.0:
                    # Path still exists but CVSS is 0, assign a very low base score to prevent false 100%
                    new_score = 0.1
            
            if new_score < best_new_score:
                best_new_score = new_score
                
                # Calculate reasoning tag
                cves = current_graph.nodes[node_id].get('cves', [])
                max_cvss = max((c.get('score', 0) for c in cves), default=0)
                degree = current_graph.degree(node_id)
                
                if max_cvss >= 7.0:
                    tag = "high_cvss"
                elif degree > 2:
                    tag = "high_centrality"
                else:
                    tag = "path_chokepoint"
                    
                best_fix = {
                    "node_id": node_id,
                    "node_name": current_graph.nodes[node_id].get('name', 'Unknown'),
                    "risk_cut_percent": 0, 
                    "reasoning_tag": tag,
                    "new_score": new_score
                }
                
        if best_fix and best_fix['new_score'] < current_risk_score:
            cut_percent = ((current_risk_score - best_fix['new_score']) / current_risk_score) * 100
            best_fix['risk_cut_percent'] = round(cut_percent, 1)
            
            # Apply fix permanently for next iteration
            fix_node = best_fix['node_id']
            current_graph.nodes[fix_node]['cves'] = []
            for u, v, data in current_graph.in_edges(fix_node, data=True):
                data['risk_weight'] = 0.0
                
            current_risk_score = best_fix['new_score']
            del best_fix['new_score'] 
            recommended_fixes.append(best_fix)
        else:
            break
            
    total_reduction = ((original_risk_score - current_risk_score) / original_risk_score) * 100 if original_risk_score > 0 else 0
    
    return {
        "recommended_fixes": recommended_fixes,
        "total_risk_reduction_percent": round(total_reduction, 1),
        "original_risk_score": round(original_risk_score, 2),
        "projected_risk_score_after_fixes": round(current_risk_score, 2)
    }
