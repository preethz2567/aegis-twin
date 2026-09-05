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
              
              // Handle basic bolding: **text**
              const parts = trimmed.split(/(\*\*.*?\*\*)/g);
              
              return (
                <p key={i} style={{ marginBottom: '1rem' }}>
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
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
