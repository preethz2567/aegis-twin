import React from 'react';
import TwinGraph from './components/TwinGraph';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AEGIS-TWIN Dashboard</h1>
        <p>Live Network Threat Topology</p>
      </header>
      <main className="app-main">
        <TwinGraph />
      </main>
    </div>
  );
}

export default App;
