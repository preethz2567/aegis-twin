import React from 'react';
import { useNavigate } from 'react-router-dom';

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

        <div className="features-grid">
          <div className="feature-card">
            <h3>Map</h3>
            <p>Visualize your live network threat topology and crown jewels.</p>
          </div>
          <div className="feature-card">
            <h3>Simulate</h3>
            <p>Uncover the highest-risk attack paths through your infrastructure.</p>
          </div>
          <div className="feature-card">
            <h3>Optimize</h3>
            <p>Compute the most effective fixes to cut risk with minimal effort.</p>
          </div>
          <div className="feature-card">
            <h3>Explain</h3>
            <p>Translate complex vulnerabilities into plain English executive summaries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
