import os
import json
from dotenv import load_dotenv
import anthropic

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')
load_dotenv(dotenv_path=env_path)

def generate_explanation(attack_path_result: dict, fix_recommendations: dict) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_key_here":
        return "Please add your Anthropic API key to backend/.env to see the plain-English explanation."

    try:
        client = anthropic.Anthropic(api_key=api_key)
        
        # Build prompt
        path_hops = " -> ".join([hop.get("name", "Unknown") for hop in attack_path_result.get("hops", [])])
        risk_score = attack_path_result.get("risk_score", 0)
        
        fixes_summary = []
        for idx, fix in enumerate(fix_recommendations.get("recommended_fixes", [])):
            reason = fix.get("reasoning_tag", "")
            reduction = fix.get("risk_cut_percent", 0)
            fixes_summary.append(f"{idx+1}. {fix['node_name']} (Reason: {reason}) - reduces risk by {reduction}% cumulatively.")
            
        fixes_text = "\n".join(fixes_summary)
        
        prompt = f"""
You are an expert cybersecurity advisor. I have a digital twin of my network. 
An attacker simulation found a high-risk path:
Path: {path_hops}
Initial Risk Score: {risk_score}

To mitigate this, the optimization engine recommends the following fixes in order:
{fixes_text}

Total Projected Risk Reduction: {fix_recommendations.get('total_risk_reduction_percent', 0)}%

Provide a plain-English explanation covering what the risk is and how the fixes mitigate it.
Write for someone who is NOT a security specialist. Avoid jargon like 'CVSS' or 'greedy algorithm'. 

STRUCTURE YOUR RESPONSE EXACTLY AS FOLLOWS (using Markdown paragraphs and bold text where requested):
1. **[Bold Opening]**: One bolded, punchy opening sentence summarizing the core danger.
2. **[The Risk]**: A short paragraph (2-3 sentences) explaining why that chain is dangerous.
3. **[The Fixes]**: A short paragraph explaining the fixes in priority order, broken into distinct sentences per fix rather than one long run-on paragraph.
4. **[Conclusion]**: A final one-line sentence stating the overall risk reduction percentage.
"""
        
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.content[0].text
    except Exception as e:
        print(f"Explain API error: {e}")
        return "Please verify your Anthropic API key in backend/.env to see the plain-English explanation."
