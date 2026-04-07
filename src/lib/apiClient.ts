import axios, { AxiosInstance } from "axios";
import { supabase } from "../supabase";

/**
 * Create an authenticated axios instance that automatically adds Supabase auth token
 * This is used for all admin API calls that require authentication
 */
export function createAuthenticatedApi(baseURL: string): AxiosInstance {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add interceptor to include auth token in all requests
  api.interceptors.request.use(async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error("Failed to get auth session:", err);
    }

    return config;
  });

  return api;
}
