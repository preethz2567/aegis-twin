import React, { useState } from 'react';
import TwinGraph from './components/TwinGraph';
import AttackPathPanel from './components/AttackPathPanel';
import FixRecommendationsPanel from './components/FixRecommendationsPanel';
import { fetchAttackPath, fetchOptimizePath } from './api';
import './index.css';

function App() {
  const [attackData, setAttackData] = useState(null);
  const [optimizeData, setOptimizeData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMsg('');
    setOptimizeData(null);
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
    try {
      const data = await fetchOptimizePath();
      if (data.attack_path?.error) {
        setErrorMsg(data.attack_path.error);
      } else {
        setOptimizeData(data);
      }
    } catch (err) {
      setErrorMsg('Failed to run optimization.');
    } finally {
      setIsOptimizing(false);
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
        />
        {attackData && !optimizeData && <AttackPathPanel data={attackData} />}
        {optimizeData && (
           <div className="panels-container">
              <AttackPathPanel data={optimizeData.attack_path} />
              <FixRecommendationsPanel data={optimizeData} />
           </div>
        )}
      </main>
    </div>
  );
}

export default App;
