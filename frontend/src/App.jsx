import React, { useState } from 'react';
import TwinGraph from './components/TwinGraph';
import AttackPathPanel from './components/AttackPathPanel';
import { fetchAttackPath } from './api';
import './index.css';

function App() {
  const [attackData, setAttackData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMsg('');
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
                disabled={isSimulating}
             >
               {isSimulating ? <span className="spinner"></span> : null}
               {isSimulating ? 'Simulating...' : 'Run Attack Simulation'}
             </button>
             {errorMsg && <span className="error-text">{errorMsg}</span>}
          </div>
        </div>
      </header>
      <main className="app-main">
        <TwinGraph attackPath={attackData?.path} />
        {attackData && <AttackPathPanel data={attackData} />}
      </main>
    </div>
  );
}

export default App;
