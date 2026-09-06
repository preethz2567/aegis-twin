import json
import os
import networkx as nx

class TwinGraph:
    def __init__(self, data_path: str = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.data_path = os.path.join(base_dir, 'data', 'network.json')
        else:
            self.data_path = data_path
            
        self.fixed_nodes = set()
        self.graph = nx.DiGraph()
        self.load_data(self.data_path)

    def load_data(self, data_path: str = None):
        self.graph.clear()
        
        # Try to load from DB active profile
        from db import SessionLocal, NetworkProfile
        import json
        
        db = SessionLocal()
        data = None
        try:
            active_profile = db.query(NetworkProfile).filter(NetworkProfile.is_active == True).first()
            if active_profile and active_profile.topology_json:
                data = json.loads(active_profile.topology_json)
        except Exception as e:
            print(f"Failed to load from DB: {e}")
        finally:
            db.close()
            
        if not data:
            # Fallback to file
            path_to_load = data_path or self.data_path
            with open(path_to_load, 'r') as f:
                data = json.load(f)
                
            
        for node in data.get('nodes', []):
            node_id = node.pop('id')
            
            node_type = node.get('type')
            is_cj = node.get('crown_jewel') or node.get('is_crown_jewel')
            if node_type == 'credential-store':
                node['technique_risk_score'] = 6.0
                node['technique_risk_source'] = 'Credential Access'
            elif node_type == 'database' and is_cj:
                node['technique_risk_score'] = 4.0
                node['technique_risk_source'] = 'High-Value Target'
            else:
                node['technique_risk_score'] = 0.0
                node['technique_risk_source'] = None
                
            self.graph.add_node(node_id, **node)
            
        for edge in data.get('edges', []):
            source = edge.pop('source')
            target = edge.pop('target')
            self.graph.add_edge(source, target, **edge)

    def apply_fix(self, node_id: str):
        if node_id in self.graph.nodes:
            self.fixed_nodes.add(node_id)
            self.graph.nodes[node_id]['cves'] = []
            self.graph.nodes[node_id]['technique_risk_score'] = 0.0
            for u, v, data in self.graph.in_edges(node_id, data=True):
                data['risk_weight'] = 0.0

    def reset_fixes(self):
        self.fixed_nodes.clear()
        self.load_data(self.data_path)

    def get_graph_state(self):
        nodes = []
        for n, attrs in self.graph.nodes(data=True):
            node_data = {'id': n, 'is_fixed': n in self.fixed_nodes}
            node_data.update(attrs)
            nodes.append(node_data)
            
        edges = []
        for u, v, attrs in self.graph.edges(data=True):
            edge_data = {'source': u, 'target': v}
            edge_data.update(attrs)
            edges.append(edge_data)
            
        return {
            'nodes': nodes,
            'edges': edges
        }
