import api from "./services/apiService";

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", res.data.access_token);
  // persist abilities and user info if provided
  if (res.data.abilities) {
    localStorage.setItem("abilities", JSON.stringify(res.data.abilities));
  }
  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

export const register = async (username: string, password: string) => {
  const res = await api.post("/auth/register", { username, password });
  return res.data;
};

export const getToken = () => localStorage.getItem("token");

export const getLocalAbilities = (): Record<string, string[]> => {
  const a = localStorage.getItem("abilities");
  try {
    return a ? JSON.parse(a) : {};
  } catch {
    return {};
  }
};

export const logout = () => localStorage.removeItem("token");

export const fetchAbilities = async () => {
  const token = getToken();
  if (!token) return {};
  // prefer local cached abilities to avoid extra request
  const local = getLocalAbilities();
  if (local && Object.keys(local).length) return local;
  const res = await api.get("/users/abilities");
  if (res.data?.abilities) {
    localStorage.setItem("abilities", JSON.stringify(res.data.abilities));
  }
  return res.data.abilities || {};
};
