import React from 'react';

const FixRecommendationsPanel = ({ data }) => {
  const { optimization } = data;
  
  if (!optimization) return null;
  
  return (
    <div className="fix-panel">
      <h3>Recommended Fixes</h3>
      
      <div className="risk-comparison">
        <div className="risk-stat">
          <span className="stat-label">Original Risk</span>
          <span className="stat-value error">{optimization.original_risk_score}</span>
        </div>
        <div className="risk-arrow">→</div>
        <div className="risk-stat">
          <span className="stat-label">Projected Risk</span>
          <span className="stat-value success">{optimization.projected_risk_score_after_fixes}</span>
        </div>
      </div>
      
      <div className="reduction-badge">
        ↓ {optimization.total_risk_reduction_percent}% Risk Reduction
      </div>
      
      <div className="fixes-list">
        {optimization.recommended_fixes.map((fix, idx) => (
          <div key={fix.node_id} className="fix-item">
            <div className="fix-header">
              <span className="fix-rank">#{idx + 1}</span>
              <span className="fix-name">{fix.node_name}</span>
            </div>
            <div className="fix-details">
              <span className="fix-cut">-{fix.risk_cut_percent}% Risk</span>
              <span className="fix-tag-badge" title={fix.reasoning_tag}>
                {fix.reasoning_tag === 'high_cvss' && '🎯'}
                {fix.reasoning_tag === 'high_centrality' && '🔗'}
                {fix.reasoning_tag === 'path_chokepoint' && '🛑'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixRecommendationsPanel;
