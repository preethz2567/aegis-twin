import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Target, ListChecks, MessageSquare } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';

// --- Animated Counter Component ---
const AnimatedCounter = ({ from, to }) => {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    const node = nodeRef.current;
    
    // Intersection Observer to start animation when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate(from, to, {
          duration: 2,
          ease: "easeOut",
          onUpdate(value) {
            if (node) {
              node.textContent = Math.round(value).toLocaleString() + "+";
            }
          }
        });
        observer.disconnect(); // Only animate once
      }
    });
    
    if (node) {
      observer.observe(node);
    }
    
    return () => observer.disconnect();
  }, [from, to]);

  return <span ref={nodeRef} className="v-stat-number">0+</span>;
};

// --- Tilt Terminal Component ---
const TiltTerminal = () => {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [5, -5]);
  const rotateY = useTransform(x, [0, 400], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
        width: '100%',
        maxWidth: '48rem',
        margin: '0 auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="v-terminal-window"
      >
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
      </motion.div>
    </motion.div>
  );
};

// --- Spotlight Feature Card ---
const SpotlightCard = ({ children }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="v-feature-card spotlight-card-wrapper"
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />
      <div className="v-feature-card-content">
         {children}
      </div>
    </div>
  );
};

function LandingPage() {
  const navigate = useNavigate();

  // Scroll reveal variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="landing-page v-theme">
      {/* Background Texture & Glows */}
      <div className="v-bg-grid"></div>
      <div className="v-bg-moving-mesh"></div>
      <div className="v-glow v-glow-primary"></div>
      <div className="v-glow v-glow-secondary"></div>

      <div className="landing-content v-content">
        
        {/* SECTION 1 — Hero */}
        <motion.section 
          className="v-section v-hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="v-pill-badge">We Hack 5.0 Finalist</motion.div>
          <motion.h1 variants={fadeUp} className="v-title">AEGIS-TWIN</motion.h1>
          <motion.p variants={fadeUp} className="v-description">
            AEGIS-TWIN helps security analysts see which vulnerability actually matters most — by simulating how an attacker would move through the network, then recommending the fixes that block the most damage.
          </motion.p>
          <motion.div variants={fadeUp} className="v-actions">
            <button className="v-btn v-btn-primary btn-glow" onClick={() => navigate('/dashboard')}>
              Launch Dashboard
            </button>
            <a href="https://github.com/placeholder/aegis-twin" target="_blank" rel="noreferrer" className="v-btn v-btn-ghost">
              View on GitHub
            </a>
          </motion.div>
        </motion.section>

        {/* SECTION 2 — Problem */}
        <motion.section 
          className="v-section v-problem"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
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
              <AnimatedCounter from={0} to={23000} />
              <span className="v-stat-label">Repositories Affected</span>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3 — Terminal mockup */}
        <motion.section 
          className="v-section v-terminal-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <TiltTerminal />
        </motion.section>

        {/* SECTION 4 — Feature cards */}
        <motion.section 
          className="v-section v-features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="h-full">
            <SpotlightCard>
              <Network className="v-feature-icon" size={28} />
              <h3>Map</h3>
              <p>Visualize your live network threat topology and crown jewels.</p>
            </SpotlightCard>
          </motion.div>
          <motion.div variants={fadeUp} className="h-full">
            <SpotlightCard>
              <Target className="v-feature-icon" size={28} />
              <h3>Simulate</h3>
              <p>Uncover the highest-risk attack paths through your infrastructure.</p>
            </SpotlightCard>
          </motion.div>
          <motion.div variants={fadeUp} className="h-full">
            <SpotlightCard>
              <ListChecks className="v-feature-icon" size={28} />
              <h3>Optimize</h3>
              <p>Compute the most effective fixes to cut risk with minimal effort.</p>
            </SpotlightCard>
          </motion.div>
          <motion.div variants={fadeUp} className="h-full">
            <SpotlightCard>
              <MessageSquare className="v-feature-icon" size={28} />
              <h3>Explain</h3>
              <p>Translate complex vulnerabilities into plain English executive summaries.</p>
            </SpotlightCard>
          </motion.div>
        </motion.section>

        {/* SECTION 5 — Footer */}
        <footer className="v-footer">
          <div className="v-footer-content">
            <div className="v-footer-brand">
              <strong>AEGIS-TWIN</strong>
              <span>Built for We Hack 5.0</span>
            </div>
            <div className="v-footer-links">
              <a href="https://github.com/placeholder/aegis-twin" target="_blank" rel="noreferrer">GitHub</a>
              <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default LandingPage;
