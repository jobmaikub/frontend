import { createAuthenticatedApi } from "./apiClient";

export interface DashboardStats {
  users: number;
  reports: number;
  faculties: number;
  majors: number;
  skills: number;
  interests: number;
  careers: number;
  courses: number;
  lessons: number;
  news: number;
}

const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/stats"
);

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/");
  return res.data;
}
