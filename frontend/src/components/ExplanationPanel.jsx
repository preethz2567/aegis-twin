import React from 'react';

const ExplanationPanel = ({ text, isLoading }) => {
  return (
    <div className="explain-panel">
      <h3>💬 In Plain English</h3>
      <div className="explain-content">
        {isLoading ? (
          <div className="explain-loading">
            <span className="spinner-small"></span>
            Generating explanation...
          </div>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default ExplanationPanel;
