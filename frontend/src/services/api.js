import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response?.data?.message || "";

      if (
        message.toLowerCase().includes("banned") ||
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
