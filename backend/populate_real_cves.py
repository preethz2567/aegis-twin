import os
import json
from nvd_client import fetch_real_cves

SOFTWARE_MAPPING = {
    "server": "nginx",
    "ci-cd-runner": "Jenkins",
    "database": "PostgreSQL",
    "credential-store": "HashiCorp Vault",
    "workstation": "Windows 10"
}

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    network_path = os.path.join(base_dir, 'data', 'network.json')
    
    with open(network_path, 'r') as f:
        data = json.load(f)
        
    print("Populating real CVEs for network.json...")
    
    # Add comment field to top level
    data["_comment"] = "CVE data sourced from NVD public API — topology and node names remain illustrative."
    
    summary = {}
    
    for node in data.get('nodes', []):
        node_type = node.get('type')
        if not node_type:
            continue
            
        software = SOFTWARE_MAPPING.get(node_type, "nginx")
        real_cves = fetch_real_cves(software, max_results=2 if node_type in ['workstation'] else 3)
        
        # Keep empty if originally empty, else replace
        original_cves = node.get('cves', [])
        if original_cves:
            # We don't want to add too many CVEs if the node didn't have many originally. 
            # Actually, let's just use real_cves up to the length of original_cves, or just replace entirely.
            # The prompt says: "replace the invented CVE list on each node with real CVE IDs... "
            node['cves'] = real_cves
            summary[node['id']] = [cve['id'] for cve in real_cves]
        else:
            summary[node['id']] = []
            
    with open(network_path, 'w') as f:
        # Move _comment to top manually or just let json.dump handle it (keys order is preserved in Python 3.7+)
        # Ensure _comment is first
        ordered_data = {"_comment": data["_comment"]}
        ordered_data.update(data)
        json.dump(ordered_data, f, indent=4)
        
    print("\n--- Update Summary ---")
    for node_id, cve_ids in summary.items():
        print(f"Node {node_id}: {', '.join(cve_ids) if cve_ids else 'No CVEs'}")
    print("----------------------")
    print("Done! network.json has been updated with real NVD data.")

if __name__ == "__main__":
    main()
