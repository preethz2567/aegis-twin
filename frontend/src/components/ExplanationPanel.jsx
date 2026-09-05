import React from 'react';

const ExplanationPanel = ({ text, isLoading }) => {
  return (
    <div className="explain-panel">
      <h3>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        In Plain English
      </h3>
      <div className="explain-content">
        {isLoading ? (
          <div className="explain-loading">
            <span className="spinner-small"></span>
            Generating explanation...
          </div>
        ) : (
          <div>
            {text.split('\n').map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              
              let contentStr = trimmed;
              let isH1 = false;
              let isH2 = false;
              
              if (trimmed.startsWith('# ')) {
                isH1 = true;
                contentStr = trimmed.substring(2);
              } else if (trimmed.startsWith('## ')) {
                isH2 = true;
                contentStr = trimmed.substring(3);
              }

              // Handle basic bolding: **text**
              const parts = contentStr.split(/(\*\*.*?\*\*)/g);
              
              const mappedParts = parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
              });
              
              if (isH1) {
                return <h4 key={i} style={{ marginBottom: '0.5rem', marginTop: i > 0 ? '1rem' : 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{mappedParts}</h4>;
              }
              if (isH2) {
                return <h5 key={i} style={{ marginBottom: '0.5rem', marginTop: i > 0 ? '0.75rem' : 0, color: 'var(--text-main)', fontSize: '1rem' }}>{mappedParts}</h5>;
              }

              return (
                <p key={i} style={{ marginBottom: '1rem' }}>
                  {mappedParts}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationPanel;
