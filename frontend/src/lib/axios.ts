import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Unknown error";
    console.error("API Error:", {
      status: error.response?.status,
      message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Create endpoint-specific instances with proper URL joining
export const createApiClient = (endpoint: string) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL if present
  const baseURL = import.meta.env.VITE_API_URL;
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  
  return axios.create({
    baseURL: `${cleanBaseURL}/${cleanEndpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

