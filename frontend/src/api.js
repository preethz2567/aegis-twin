export const fetchTwinState = async () => {
  const response = await fetch('http://localhost:8000/api/twin');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
