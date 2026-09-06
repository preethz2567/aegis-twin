import React, { useEffect, useState } from 'react';
import { Network, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { getProfiles, activateProfile, deleteProfile, generateLargeProfile, createProfile } from '../api';

function NetworkProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activatingId, setActivatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleError = (err, defaultMsg) => {
    if (err.message === 'BACKEND_NOT_REACHABLE') {
      setIsBackendDown(true);
      setErrorMsg('Backend not reachable: Please ensure the server is running on port 8000.');
    } else {
      setErrorMsg(defaultMsg + (err.message ? ` (${err.message})` : ''));
    }
  };

  const fetchAllProfiles = async () => {
    setIsLoading(true);
    setIsBackendDown(false);
    try {
      const data = await getProfiles();
      setProfiles(data);
      setErrorMsg('');
    } catch (err) {
      handleError(err, 'Failed to load network profiles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const handleActivate = async (id) => {
    setActivatingId(id);
    setErrorMsg('');
    try {
      await activateProfile(id);
      // Update local state to reflect active status
      setProfiles(prev => prev.map(p => ({
        ...p,
        is_active: p.id === id
      })));
    } catch (err) {
      handleError(err, 'Failed to activate profile.');
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this network profile?")) return;
    
    setDeletingId(id);
    setErrorMsg('');
    try {
      await deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete profile.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerateLarge = async () => {
    const countStr = window.prompt("Enter number of nodes to generate (e.g. 100):", "100");
    if (!countStr) return;
    const count = parseInt(countStr, 10);
    if (isNaN(count) || count < 10) {
      setErrorMsg("Please enter a valid number (minimum 10).");
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    try {
      await generateLargeProfile(count);
      await fetchAllProfiles(); // Refresh list to get new profile
    } catch (err) {
      handleError(err, 'Failed to generate large network.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      const defaultName = file.name.replace('.json', '');
      const name = window.prompt("Name for this uploaded network:", defaultName) || defaultName;
      
      await createProfile(name, "User uploaded custom topology", json);
      await fetchAllProfiles(); // Refresh list
    } catch (err) {
      handleError(err, 'Upload failed — ensure the file is valid JSON with nodes and edges arrays.');
    } finally {
      setIsUploading(false);
      e.target.value = null; // reset input
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString + "Z");
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Network size={28} /> Network Profiles
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label 
            className="simulate-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
          >
            {isUploading ? <span className="spinner" style={{width:'14px',height:'14px',borderWidth:'2px'}}></span> : <Upload size={16} />}
            Upload Custom Network
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
          </label>
          
          <button 
            className="simulate-btn"
            onClick={handleGenerateLarge}
            disabled={isGenerating}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isGenerating ? <span className="spinner" style={{width:'14px',height:'14px',borderWidth:'2px'}}></span> : <Plus size={16} />}
            Generate Large Network
          </button>
        </div>
      </header>

      {isBackendDown && (
        <div style={{
          background: '#2d1b1b', border: '1px solid #ff4d4f', borderRadius: '6px',
          padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ff4d4f',
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
        }}>
          ⚠️ <strong>Backend not reachable</strong> — Please ensure the server is running on port 8000.
        </div>
      )}

      {errorMsg && !isBackendDown && <div className="error-text" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading profiles...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {profiles.map(profile => (
            <div 
              key={profile.id}
              style={{
                background: 'var(--panel-bg)',
                border: `1px solid ${profile.is_active ? 'var(--accent-color)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {profile.is_active && (
                <div style={{ 
                  position: 'absolute', top: '-10px', right: '15px', 
                  background: 'var(--accent-color)', color: '#000', 
                  padding: '2px 8px', borderRadius: '12px', 
                  fontSize: '0.75rem', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> Active
                </div>
              )}
              
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', paddingRight: profile.is_active ? '60px' : '0' }}>
                {profile.name}
              </h3>
              
              {profile.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                  {profile.description}
                </p>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Network size={14} /> {profile.node_count} nodes
                </span>
                <span>Created {formatDate(profile.created_at)}</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                {!profile.is_active ? (
                  <button 
                    onClick={() => handleActivate(profile.id)}
                    disabled={activatingId === profile.id || deletingId === profile.id}
                    style={{ 
                      background: 'rgba(45,225,194,0.1)', border: '1px solid var(--accent-color)', 
                      color: 'var(--accent-color)', padding: '6px 12px', borderRadius: '4px',
                      cursor: activatingId === profile.id ? 'wait' : 'pointer', fontSize: '0.85rem', fontWeight: '500',
                      opacity: activatingId === profile.id ? 0.7 : 1
                    }}
                  >
                    {activatingId === profile.id ? 'Activating...' : 'Activate'}
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Currently running</span>
                )}
                
                {!profile.is_active && (
                  <button 
                    onClick={() => handleDelete(profile.id)}
                    disabled={deletingId === profile.id || activatingId === profile.id}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: deletingId === profile.id ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', opacity: deletingId === profile.id ? 0.5 : 1 }}
                    title="Delete Profile"
                  >
                    {deletingId === profile.id ? '...' : <Trash2 size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NetworkProfilesPage;
