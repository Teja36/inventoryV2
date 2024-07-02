const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchDashboardData = async () => {
  const response = await fetch(`${BASE_URL}/utils/dashboard-data`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch data!");

  return response.json();
};

const fetchGraphData = async () => {
  const response = await fetch(`${BASE_URL}/utils/graph-data`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch data!");

  return response.json();
};

export { fetchDashboardData, fetchGraphData };
