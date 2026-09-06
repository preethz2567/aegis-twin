import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, History } from 'lucide-react';
import { getAssessments, deleteAssessment } from '../api';

function HistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleError = (err, defaultMsg) => {
    if (err.message === 'BACKEND_NOT_REACHABLE') {
      setIsBackendDown(true);
      setErrorMsg('Backend not reachable: Please ensure the server is running on port 8000.');
    } else {
      setErrorMsg(defaultMsg + (err.message ? ` (${err.message})` : ''));
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    setIsBackendDown(false);
    try {
      const data = await getAssessments();
      setAssessments(data);
    } catch (err) {
      handleError(err, 'Failed to load assessment history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this assessment?")) return;
    
    setDeletingId(id);
    try {
      await deleteAssessment(id);
      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      if (err.message === 'BACKEND_NOT_REACHABLE') {
        setIsBackendDown(true);
        setErrorMsg('Backend not reachable: Please ensure the server is running on port 8000.');
      } else {
        setErrorMsg('Failed to delete assessment.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString + "Z");
    return d.toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: '2-digit' 
    });
  };

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {isBackendDown && (
        <div style={{
          background: '#2d1b1b', border: '1px solid #ff4d4f', borderRadius: '6px',
          padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ff4d4f',
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
        }}>
          ⚠️ <strong>Backend not reachable</strong> — Please ensure the server is running on port 8000.
        </div>
      )}
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <History size={24} /> Assessment History
      </h2>
      
      {errorMsg && !isBackendDown && <div className="error-text" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : assessments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <History size={48} style={{ opacity: 0.2, margin: '0 auto 1rem', display: 'block' }} />
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            No saved assessments yet — run a simulation and save it from the dashboard to see it here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assessments.map(assessment => (
            <Link 
              to={`/history/${assessment.id}`} 
              key={assessment.id}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{assessment.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(assessment.created_at)}</div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, assessment.id)}
                  disabled={deletingId === assessment.id}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: deletingId === assessment.id ? 'wait' : 'pointer', padding: '0.25rem', opacity: deletingId === assessment.id ? 0.5 : 1 }}
                  onMouseEnter={(e) => { if (deletingId !== assessment.id) e.currentTarget.style.color = '#ff4d4f'; }}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Delete Assessment"
                >
                  {deletingId === assessment.id ? '...' : <Trash2 size={18} />}
                </button>
              </div>
              
              <div className="risk-comparison" style={{ margin: 0, padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                <div className="risk-stat">
                  <span className="stat-label">Original Risk</span>
                  <span className="stat-value error">{assessment.original_risk_score}</span>
                </div>
                <div className="risk-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
                <div className="risk-stat">
                  <span className="stat-label">Projected Risk</span>
                  <span className="stat-value success">{assessment.projected_risk_score}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
