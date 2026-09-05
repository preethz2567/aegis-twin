import React from 'react';

const AttackPathPanel = ({ data }) => {
  const getRiskColor = (score) => {
    if (score >= 7.0) return '#f85149';
    if (score >= 4.0) return '#d29922';
    return '#3fb950';
  };

  return (
    <div className="attack-path-panel">
      <h3>Highest-Risk Path Found</h3>
      
      <div className="risk-score-container">
        <div className="risk-label">Risk Score</div>
        <div className="risk-value" style={{ color: getRiskColor(data.risk_score) }}>
          {data.risk_score}
        </div>
      </div>
      
      <div className="path-hops">
        <div className="hops-title">Hop Sequence:</div>
        {data.hops && data.hops.map((hop, index) => (
          <React.Fragment key={hop.id}>
            <div className="hop-item">
              <span className="hop-name">{hop.name}</span>
              <span className="hop-type">({hop.type})</span>
              {index === 0 && <span className="hop-badge entry">Entry Point</span>}
              {hop.id === data.target && <span className="hop-badge target">Target</span>}
            </div>
            {index < data.hops.length - 1 && (
              <div className="hop-arrow">↓</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AttackPathPanel;
