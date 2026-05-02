import axios, { AxiosInstance } from "axios";
import { supabase } from "./supabase";

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

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const message = String(
        error?.response?.data?.message || error?.message || ""
      );
      const lower = message.toLowerCase();
      const isBannedError =
        lower.includes("user is banned") ||
        lower.includes("banned") ||
        lower.includes("suspended");

      if ((status === 401 || status === 403) && isBannedError) {
        try {
          await supabase.auth.signOut();
        } catch {
          // no-op: still force redirect below
        }

        if (!window.location.pathname.startsWith("/login")) {
          const params = new URLSearchParams({
            banned: "1",
            reason: message || "Your account has been suspended by admin",
          });
          window.location.href = `/login?${params.toString()}`;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
