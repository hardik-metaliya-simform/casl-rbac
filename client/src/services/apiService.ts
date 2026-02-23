import axiosInstance from "./axiosConfig";

const api = {
  get: (url: string, config?: any) => axiosInstance.get(url, config),
  post: (url: string, data?: any, config?: any) =>
    axiosInstance.post(url, data, config),
  put: (url: string, data?: any, config?: any) =>
    axiosInstance.put(url, data, config),
  delete: (url: string, config?: any) => axiosInstance.delete(url, config),
};

export default api;
