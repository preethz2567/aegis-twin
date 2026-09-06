export const fetchTwinState = async () => {
  const response = await fetch('http://localhost:8000/api/twin');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchAttackPath = async () => {
  const response = await fetch('http://localhost:8000/api/simulate/attack-path');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchOptimizePath = async () => {
  const response = await fetch('http://localhost:8000/api/simulate/optimize');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchExplain = async () => {
  const response = await fetch('http://localhost:8000/api/simulate/explain');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const applyFix = async (nodeId) => {
  const response = await fetch('http://localhost:8000/api/apply-fix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ node_id: nodeId }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const resetSimulation = async () => {
  const response = await fetch('http://localhost:8000/api/reset-simulation', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const generateReport = async (attackPath, optimization, explanation) => {
  const response = await fetch('http://localhost:8000/api/generate-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attack_path: attackPath,
      optimization: optimization,
      explanation: explanation || '',
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.blob();
};

export const saveAssessment = async (name, attackPath, fixRecommendations, explanation) => {
  const response = await fetch('http://localhost:8000/api/assessments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      attack_path: attackPath,
      fix_recommendations: fixRecommendations,
      explanation: explanation || '',
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getAssessments = async () => {
  const response = await fetch('http://localhost:8000/api/assessments');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getAssessment = async (id) => {
  const response = await fetch(`http://localhost:8000/api/assessments/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deleteAssessment = async (id) => {
  const response = await fetch(`http://localhost:8000/api/assessments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getProfiles = async () => {
  const response = await fetch('http://localhost:8000/api/profiles');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createProfile = async (name, description, topology_json) => {
  const response = await fetch('http://localhost:8000/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, topology_json }),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const activateProfile = async (id) => {
  const response = await fetch(`http://localhost:8000/api/profiles/${id}/activate`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deleteProfile = async (id) => {
  const response = await fetch(`http://localhost:8000/api/profiles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const generateLargeProfile = async (nodeCount = 100) => {
  const response = await fetch('http://localhost:8000/api/profiles/generate-large', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ node_count: nodeCount }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
