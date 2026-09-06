import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Target, ListChecks, MessageSquare } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">AEGIS-TWIN</h1>
        <h2 className="landing-subtitle">Autonomous Digital Twin for Adversarial Path Simulation & Optimal Defense Orchestration</h2>
        <p className="landing-description">
          AEGIS-TWIN helps security analysts see which vulnerability actually matters most — by simulating how an attacker would move through the network, then recommending the fixes that block the most damage.
        </p>
        
        <button className="simulate-btn launch-btn" onClick={() => navigate('/dashboard')}>
          Launch Dashboard
        </button>

        <div className="landing-problem-section">
          <span className="eyebrow">THE PROBLEM</span>
          <h3 className="problem-headline">A single compromised component can expose thousands of systems.</h3>
          <p className="problem-description">
            In March 2025, a supply-chain attack on the <code>tj-actions/changed-files</code> GitHub Action affected over 23,000 repositories worldwide. 
            This documented incident proves that minor, seemingly isolated vulnerabilities in CI/CD pipelines can act as immediate stepping stones into core production infrastructure.
          </p>
        </div>

        <div className="dashboard-preview-placeholder">
          {/* TODO: replace with actual dashboard screenshot */}
          <span className="placeholder-text">Dashboard Preview Area</span>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Network className="feature-icon" size={28} />
            <h3>Map</h3>
            <p>Visualize your live network threat topology and crown jewels.</p>
          </div>
          <div className="feature-card">
            <Target className="feature-icon" size={28} />
            <h3>Simulate</h3>
            <p>Uncover the highest-risk attack paths through your infrastructure.</p>
          </div>
          <div className="feature-card">
            <ListChecks className="feature-icon" size={28} />
            <h3>Optimize</h3>
            <p>Compute the most effective fixes to cut risk with minimal effort.</p>
          </div>
          <div className="feature-card">
            <MessageSquare className="feature-icon" size={28} />
            <h3>Explain</h3>
            <p>Translate complex vulnerabilities into plain English executive summaries.</p>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
          <span>AEGIS-TWIN — Built for [hackathon/track name]</span>
          {/* TODO: replace with actual GitHub repo URL */}
          <a href="https://github.com/placeholder/aegis-twin" target="_blank" rel="noreferrer" className="footer-link">
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
