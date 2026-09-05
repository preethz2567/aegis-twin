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
