import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { getAssessment } from '../api';
import AttackPathPanel from '../components/AttackPathPanel';
import FixRecommendationsPanel from '../components/FixRecommendationsPanel';
import ExplanationPanel from '../components/ExplanationPanel';
import '../index.css';

function HistoryDetailPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getAssessment(id);
        setAssessment(data);
      } catch (err) {
        setErrorMsg('Failed to load assessment details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatDate = (isoString) => {
    const d = new Date(isoString + "Z");
    return d.toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: '2-digit' 
    });
  };

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading assessment...</div>;
  }

  if (errorMsg || !assessment) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#ff4d4f' }}>{errorMsg || 'Assessment not found.'}</div>;
  }

  const mockOptimizeData = {
    attack_path: assessment.attack_path,
    optimization: assessment.fix_recommendations
  };

  return (
    <div className="dashboard-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/history" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to History
        </Link>
        <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{assessment.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Clock size={14} /> Saved on {formatDate(assessment.created_at)}
        </div>
      </div>
      
      <main className="app-main" style={{ display: 'block', padding: 0 }}>
        <div className="panels-container" style={{ margin: 0 }}>
          {assessment.attack_path && Object.keys(assessment.attack_path).length > 0 && (
            <AttackPathPanel data={assessment.attack_path} />
          )}
          
          {assessment.fix_recommendations && Object.keys(assessment.fix_recommendations).length > 0 && (
            <FixRecommendationsPanel 
              data={mockOptimizeData} 
              onApplyFix={() => {}} 
              isApplying={false} 
              readOnly={true} 
            />
          )}
          
          {assessment.explanation && (
            <ExplanationPanel 
              text={assessment.explanation} 
              isLoading={false} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default HistoryDetailPage;
