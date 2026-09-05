import json
import os
import networkx as nx

class TwinGraph:
    def __init__(self, data_path: str = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(base_dir, 'data', 'network.json')
            
        self.graph = nx.DiGraph()
        self.load_data(data_path)

    def load_data(self, data_path: str):
        with open(data_path, 'r') as f:
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

    def get_graph_state(self):
        nodes = []
        for n, attrs in self.graph.nodes(data=True):
            node_data = {'id': n}
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
