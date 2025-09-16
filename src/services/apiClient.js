import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "https://140.113.136.109/dpwe";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from sessionStorage if available
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
