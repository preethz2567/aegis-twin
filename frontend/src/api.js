const apiFetch = async (url, options = {}) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      throw new Error('BACKEND_NOT_REACHABLE');
    }
    throw error;
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchTwinState = async () => {
  const response = await apiFetch('http://localhost:8000/api/twin');
  return handleResponse(response);
};

export const fetchAttackPath = async () => {
  const response = await apiFetch('http://localhost:8000/api/simulate/attack-path');
  return handleResponse(response);
};

export const fetchOptimizePath = async () => {
  const response = await apiFetch('http://localhost:8000/api/simulate/optimize');
  return handleResponse(response);
};

export const fetchExplain = async () => {
  const response = await apiFetch('http://localhost:8000/api/simulate/explain');
  return handleResponse(response);
};

export const applyFix = async (nodeId) => {
  const response = await apiFetch('http://localhost:8000/api/apply-fix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ node_id: nodeId }),
  });
  return handleResponse(response);
};

export const resetSimulation = async () => {
  const response = await apiFetch('http://localhost:8000/api/reset-simulation', {
    method: 'POST',
  });
  return handleResponse(response);
};

export const generateReport = async (attackPath, optimization, explanation) => {
  const response = await apiFetch('http://localhost:8000/api/generate-report', {
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
  const response = await apiFetch('http://localhost:8000/api/assessments', {
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
  return handleResponse(response);
};

export const getAssessments = async () => {
  const response = await apiFetch('http://localhost:8000/api/assessments');
  return handleResponse(response);
};

export const getAssessment = async (id) => {
  const response = await apiFetch(`http://localhost:8000/api/assessments/${id}`);
  return handleResponse(response);
};

export const deleteAssessment = async (id) => {
  const response = await apiFetch(`http://localhost:8000/api/assessments/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getProfiles = async () => {
  const response = await apiFetch('http://localhost:8000/api/profiles');
  return handleResponse(response);
};

export const createProfile = async (name, description, topology_json) => {
  const response = await apiFetch('http://localhost:8000/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, topology_json }),
  });
  return handleResponse(response);
};

export const activateProfile = async (id) => {
  const response = await apiFetch(`http://localhost:8000/api/profiles/${id}/activate`, {
    method: 'POST',
  });
  return handleResponse(response);
};

export const deleteProfile = async (id) => {
  const response = await apiFetch(`http://localhost:8000/api/profiles/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const generateLargeProfile = async (nodeCount = 100) => {
  const response = await apiFetch('http://localhost:8000/api/profiles/generate-large', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ node_count: nodeCount }),
  });
  return handleResponse(response);
};
