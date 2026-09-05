import React from 'react';

const FixRecommendationsPanel = ({ data, onApplyFix, isApplying }) => {
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
        <div className="risk-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
        <div className="risk-stat">
          <span className="stat-label">Projected Risk</span>
          <span className="stat-value success">{optimization.projected_risk_score_after_fixes}</span>
        </div>
      </div>
      
      {optimization.total_risk_reduction_percent === 100 ? (
        <div className="reduction-badge" style={{ borderColor: 'var(--accent)', background: 'rgba(62, 142, 138, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Target Fully Isolated (100% Risk Reduction)
        </div>
      ) : (
        <div className="reduction-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          {optimization.total_risk_reduction_percent}% Risk Reduction
        </div>
      )}
      
      <div className="fixes-list">
        {optimization.recommended_fixes.map((fix, idx) => (
          <div key={fix.node_id} className="fix-item">
            <div className="fix-header">
              <span className="fix-rank">#{idx + 1}</span>
              <span className="fix-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {fix.is_crown_jewel ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {`Harden ${fix.node_name} (access controls, monitoring)`}
                  </>
                ) : fix.node_name}
              </span>
            </div>
            <div className="fix-details">
              <span className="fix-cut">-{fix.risk_cut_percent}% Risk</span>
              {fix.reason_type === 'technique' ? (
                <span className="fix-tag-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Technique risk: {fix.reasoning_tag}
                </span>
              ) : (
                <span className="fix-tag-badge" title={fix.reasoning_tag} style={{ display: 'flex', alignItems: 'center' }}>
                  {fix.reasoning_tag === 'high_cvss' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                  {fix.reasoning_tag === 'high_centrality' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                  {fix.reasoning_tag === 'path_chokepoint' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>}
                </span>
              )}
            </div>
            <div className="fix-actions" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <button 
                className="apply-btn" 
                onClick={() => onApplyFix(fix.node_id)}
                disabled={isApplying}
              >
                Apply Fix
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixRecommendationsPanel;
