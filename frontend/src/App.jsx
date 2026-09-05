import React, { useState } from 'react';
import TwinGraph from './components/TwinGraph';
import AttackPathPanel from './components/AttackPathPanel';
import FixRecommendationsPanel from './components/FixRecommendationsPanel';
import ExplanationPanel from './components/ExplanationPanel';
import { fetchAttackPath, fetchOptimizePath, fetchExplain, applyFix, resetSimulation } from './api';
import './index.css';

function App() {
  const [attackData, setAttackData] = useState(null);
  const [optimizeData, setOptimizeData] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSecured, setIsSecured] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMsg('');
    setOptimizeData(null);
    setExplainData(null);
    setIsSecured(false);
    try {
      const data = await fetchAttackPath();
      if (data.error) {
        setErrorMsg(data.error);
        setAttackData(null);
      } else {
        setAttackData(data);
      }
    } catch (err) {
      setErrorMsg('Failed to run simulation.');
      setAttackData(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setErrorMsg('');
    setExplainData(null);
    setIsExplaining(true);
    
    try {
      const data = await fetchOptimizePath();
      if (data.attack_path?.error || data.attack_path?.risk_score === 0) {
        setIsSecured(true);
        setAttackData(null);
        setOptimizeData(null);
        setIsExplaining(false);
      } else {
        setOptimizeData(data);
        
        // Auto trigger explain call
        fetchExplain().then(expData => {
           setExplainData(expData);
           setIsExplaining(false);
        }).catch(err => {
           setExplainData({ explanation: "Please verify your Anthropic API key in backend/.env to see the plain-English explanation." });
           setIsExplaining(false);
        });
      }
    } catch (err) {
      setErrorMsg('Failed to run optimization.');
      setIsExplaining(false);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyFix = async (nodeId) => {
    setIsApplying(true);
    try {
      await applyFix(nodeId);
      setRefreshTrigger(prev => prev + 1);
      // Wait a tiny bit for UI update, then re-run optimization flow
      setTimeout(() => {
        handleOptimize();
      }, 300);
    } catch (err) {
      setErrorMsg('Failed to apply fix.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetSimulation();
      setRefreshTrigger(prev => prev + 1);
      setAttackData(null);
      setOptimizeData(null);
      setExplainData(null);
      setIsSecured(false);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to reset simulation.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>AEGIS-TWIN Dashboard</h1>
            <p>Live Network Threat Topology</p>
          </div>
          <div className="header-actions">
             <button 
                className="simulate-btn" 
                onClick={handleReset}
                style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
             >
               Reset Simulation
             </button>
             <button 
                className="simulate-btn" 
                onClick={handleSimulate}
                disabled={isSimulating || isOptimizing}
             >
               {isSimulating ? <span className="spinner"></span> : null}
               {isSimulating ? 'Simulating...' : 'Run Attack Simulation'}
             </button>
             
             {attackData && (
               <button 
                  className="optimize-btn" 
                  onClick={handleOptimize}
                  disabled={isOptimizing || isSimulating}
               >
                 {isOptimizing ? <span className="spinner"></span> : null}
                 {isOptimizing ? 'Computing...' : 'Compute Optimal Fixes'}
               </button>
             )}
             
             {errorMsg && <span className="error-text">{errorMsg}</span>}
          </div>
        </div>
      </header>
      <main className="app-main">
        <TwinGraph 
          attackPath={attackData?.path} 
          recommendedFixes={optimizeData?.optimization?.recommended_fixes?.map(f => f.node_id)}
          refreshTrigger={refreshTrigger}
        />
        
        {isSecured && (
          <div className="success-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2>No viable attack path found</h2>
            <p>Network is secured against this threat model.</p>
          </div>
        )}
        
        {attackData && !optimizeData && !isSecured && <AttackPathPanel data={attackData} />}
        {optimizeData && !isSecured && (
           <div className="panels-container">
              <AttackPathPanel data={optimizeData.attack_path} />
              <FixRecommendationsPanel data={optimizeData} onApplyFix={handleApplyFix} isApplying={isApplying} />
              {(isExplaining || explainData) && (
                <ExplanationPanel text={explainData?.explanation} isLoading={isExplaining} />
              )}
           </div>
        )}
      </main>
    </div>
  );
}

export default App;
