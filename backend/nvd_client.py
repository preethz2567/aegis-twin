import os
import json
import time
import requests

CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nvd_cache.json')

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)

def fetch_real_cves(software_name, max_results=3):
    cache = load_cache()
    if software_name in cache:
        print(f"Loaded {software_name} CVEs from cache.")
        return cache[software_name]

    url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={software_name}&resultsPerPage=10"
    
    print(f"Fetching real CVEs for {software_name} from NVD...")
    time.sleep(6) # 6 seconds delay to respect public API rate limit (5 req / 30s)
    
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching from NVD for {software_name}: {e}")
        return []

    cves = []
    for item in data.get('vulnerabilities', []):
        cve = item.get('cve', {})
        cve_id = cve.get('id')
        
        # Get description
        descriptions = cve.get('descriptions', [])
        description = "No description available"
        for desc in descriptions:
            if desc.get('lang') == 'en':
                description = desc.get('value')
                break
                
        # Get CVSS score
        metrics = cve.get('metrics', {})
        score = None
        
        if 'cvssMetricV31' in metrics:
            score = metrics['cvssMetricV31'][0].get('cvssData', {}).get('baseScore')
        elif 'cvssMetricV30' in metrics:
            score = metrics['cvssMetricV30'][0].get('cvssData', {}).get('baseScore')
        elif 'cvssMetricV2' in metrics:
            score = metrics['cvssMetricV2'][0].get('cvssData', {}).get('baseScore')
            
        if score is None:
            # Fallback if no score is found
            score = 5.0
            
        cves.append({
            "id": cve_id,
            "score": score,
            "description": description
        })
        
        if len(cves) >= max_results:
            break
            
    cache[software_name] = cves
    save_cache(cache)
    return cves
