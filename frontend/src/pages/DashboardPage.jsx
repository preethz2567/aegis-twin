import React, { useState } from 'react';
import TwinGraph from '../components/TwinGraph';
import AttackPathPanel from '../components/AttackPathPanel';
import FixRecommendationsPanel from '../components/FixRecommendationsPanel';
import ExplanationPanel from '../components/ExplanationPanel';
import { fetchAttackPath, fetchOptimizePath, fetchExplain, applyFix, resetSimulation, generateReport, saveAssessment } from '../api';
import '../index.css';

function DashboardPage() {
  const [attackData, setAttackData] = useState(null);
  const [optimizeData, setOptimizeData] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const blob = await generateReport(
        optimizeData.attack_path,
        optimizeData.optimization,
        explainData?.explanation
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aegis-twin-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg('Failed to generate report.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSaveAssessment = async () => {
    const name = window.prompt("Name this assessment:", `Assessment - ${new Date().toLocaleDateString()}`);
    if (!name) return;

    setIsSaving(true);
    try {
      await saveAssessment(
        name, 
        optimizeData.attack_path, 
        optimizeData.optimization, 
        explainData?.explanation || ''
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setErrorMsg('Failed to save assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
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

             {optimizeData && !isOptimizing && !isExplaining && (
               <>
                 <button
                   className="report-btn"
                   onClick={handleGenerateReport}
                   disabled={isGeneratingReport || isSaving}
                 >
                   {isGeneratingReport ? <span className="spinner"></span> : (
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                   )}
                   {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                 </button>
                 <button
                   className="report-btn"
                   onClick={handleSaveAssessment}
                   disabled={isSaving || isGeneratingReport || saveSuccess}
                   style={{ backgroundColor: saveSuccess ? 'var(--success-color)' : 'transparent', border: `1px solid ${saveSuccess ? 'var(--success-color)' : 'var(--accent-color)'}`, color: saveSuccess ? '#000' : 'var(--accent-color)' }}
                 >
                   {isSaving ? 'Saving...' : (saveSuccess ? 'Saved ✓' : 'Save Assessment')}
                 </button>
               </>
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

export default DashboardPage;
