import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Target, ListChecks, MessageSquare, Terminal } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page v-theme">
      {/* Background Texture & Glows */}
      <div className="v-bg-grid"></div>
      <div className="v-glow v-glow-primary"></div>
      <div className="v-glow v-glow-secondary"></div>

      <div className="landing-content v-content">
        
        {/* HERO SECTION */}
        <section className="v-hero">
          <h1 className="v-title">AEGIS-TWIN</h1>
          <h2 className="v-subtitle">Autonomous Digital Twin for Adversarial Path Simulation & Optimal Defense Orchestration</h2>
          <p className="v-description">
            AEGIS-TWIN helps security analysts see which vulnerability actually matters most — by simulating how an attacker would move through the network, then recommending the fixes that block the most damage.
          </p>
          <div className="v-actions">
            <button className="v-btn v-btn-primary" onClick={() => navigate('/dashboard')}>
              Launch Dashboard
            </button>
            <a href="https://github.com/placeholder/aegis-twin" target="_blank" rel="noreferrer" className="v-btn v-btn-ghost">
              View Documentation
            </a>
          </div>
        </section>

        <hr className="v-divider" />

        {/* PROBLEM SECTION */}
        <section className="v-problem">
          <div className="v-problem-text">
            <span className="v-eyebrow">THE PROBLEM</span>
            <h3 className="v-headline">A single compromised component can expose thousands of systems.</h3>
            <p className="v-subtext">
              In March 2025, a supply-chain attack on the <code>tj-actions/changed-files</code> GitHub Action affected over 23,000 repositories worldwide. 
              This documented incident proves that minor, seemingly isolated vulnerabilities in CI/CD pipelines can act as immediate stepping stones into core production infrastructure.
            </p>
          </div>
          <div className="v-problem-stat">
            <div className="v-stat-card">
              <span className="v-stat-number">23,000+</span>
              <span className="v-stat-label">Repositories Affected</span>
            </div>
          </div>
        </section>

        <hr className="v-divider" />

        {/* TERMINAL MOCKUP SECTION */}
        <section className="v-terminal-section">
          <div className="v-terminal-window">
            <div className="v-terminal-header">
              <div className="v-terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="v-terminal-title">bash</div>
            </div>
            <div className="v-terminal-body">
              <div className="v-term-line">
                <span className="v-prompt">$</span> <span className="v-cmd">curl</span> <span className="v-arg">https://api.aegis-twin.dev/simulate/attack-path</span>
              </div>
              <div className="v-term-json">
                {"{"}<br/>
                &nbsp;&nbsp;<span className="v-json-key">"status"</span>: <span className="v-json-str">"success"</span>,<br/>
                &nbsp;&nbsp;<span className="v-json-key">"entry_point"</span>: <span className="v-json-str">"Admin Workstation"</span>,<br/>
                &nbsp;&nbsp;<span className="v-json-key">"target"</span>: <span className="v-json-str">"Production Database"</span>,<br/>
                &nbsp;&nbsp;<span className="v-json-key">"risk_score"</span>: <span className="v-json-num">5.47</span>,<br/>
                &nbsp;&nbsp;<span className="v-json-key">"hop_sequence"</span>: [<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="v-json-str">"Admin Workstation (workstation)"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="v-json-str">"CI/CD Runner (ci-cd-runner)"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="v-json-str">"App Server (server)"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="v-json-str">"Production Database (database)"</span><br/>
                &nbsp;&nbsp;]<br/>
                {"}"}
              </div>
            </div>
          </div>
        </section>

        <hr className="v-divider" />

        {/* FEATURES SECTION */}
        <section className="v-features">
          <div className="v-feature-card">
            <Network className="v-feature-icon" size={32} />
            <h3>Map</h3>
            <p>Visualize your live network threat topology and crown jewels.</p>
          </div>
          <div className="v-feature-card">
            <Target className="v-feature-icon" size={32} />
            <h3>Simulate</h3>
            <p>Uncover the highest-risk attack paths through your infrastructure.</p>
          </div>
          <div className="v-feature-card">
            <ListChecks className="v-feature-icon" size={32} />
            <h3>Optimize</h3>
            <p>Compute the most effective fixes to cut risk with minimal effort.</p>
          </div>
          <div className="v-feature-card">
            <MessageSquare className="v-feature-icon" size={32} />
            <h3>Explain</h3>
            <p>Translate complex vulnerabilities into plain English executive summaries.</p>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="v-footer">
        <div className="v-footer-content">
          <div className="v-footer-brand">
            <strong>AEGIS-TWIN</strong>
            <span>Built for [hackathon/track name]</span>
          </div>
          <div className="v-footer-links">
            <a href="https://github.com/placeholder/aegis-twin" target="_blank" rel="noreferrer">GitHub</a>
            <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
