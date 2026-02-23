import axios from "axios";

const API_BASE = import.meta.env.DEV ? "http://localhost:3000" : "";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (e) {}
  return config;
});

export default axiosInstance;
