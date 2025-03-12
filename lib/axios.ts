import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Ensures cookies (refresh token) are sent
});

// Interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to refresh token on 401 response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Refresh token triggered"); // Log for visibility
        // debugger; // Stops execution in DevTools

        const res = await axios.get(
          // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`
          `/api/auth/refresh-token`
        );

        console.log("✅ Refresh token success:", res.data);

        const newAccessToken = res.data.accessToken;
        setAuthToken(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchCsrfToken = async () => {
  await api.get('sanctum/csrf-cookie');
  console.log('CSRF token fetched');
};
// const baseApi = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   withCredentials: true,
// });

export default api;
