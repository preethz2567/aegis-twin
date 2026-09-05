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
