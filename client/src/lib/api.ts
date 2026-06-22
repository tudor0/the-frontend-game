import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Critic pentru Cookies (Refresh Token)
});

let refreshPromise: Promise<string | null> | null = null;

const decodeExp = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.ok && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          return data.accessToken as string;
        }
        localStorage.removeItem("accessToken");
        return null;
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const getValidAccessToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const exp = decodeExp(token);
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp - now > 30) {
      return token;
    }
  }
  return await refreshAccessToken();
};

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/google", "/auth/refresh", "/auth/logout"];
const isAuthPath = (url?: string) =>
  !!url && AUTH_PATHS.some((p) => url.endsWith(p));

api.interceptors.request.use(async (config) => {
  if (isAuthPath(config.url)) return config;
  const token = await getValidAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest?.url)
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { api };
