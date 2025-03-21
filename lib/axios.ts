import axios ,{AxiosResponse} from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res:AxiosResponse<{ accessToken: string }> = await axios.get(`/api/auth/refresh-token`);
        const newAccessToken = res.data.accessToken;
        setAuthToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      error.response?.data?.message || "Something went wrong. Please try again.";

    showToast(errorMessage, "error");
    return Promise.reject(error);
  }
);

const showToast = (message: string, type: "success" | "error") => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor:
      type === "success"
        ? "linear-gradient(to right, #28a745, #218838)"
        : "linear-gradient(to right, #ff4d4d, #ff0000)",
    stopOnFocus: true,
  }).showToast();
};

// Generic API Request Function
export const request = async <R>({
  endpoint,
  method,
  data,
  params,
}: {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  params?: unknown;
}): Promise<R> => {
  try {
    const response:AxiosResponse<R> = await api.request<R>({
      url: endpoint,
      method,
      data,
      params,
    });

    if (method === "POST") {
      showToast("Created successfully!", "success");
    } 
    if (method === "PUT") {
      showToast("Updated successfully!", "success");
    }
    if (method === "DELETE") {
      showToast("Deleted successfully!", "success");
    }

    return response.data;
  } catch (error) {
    throw error; 
  }
};

export default api;
