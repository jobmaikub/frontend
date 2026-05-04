import { createAuthenticatedApi } from "./apiClient";

const api = createAuthenticatedApi(
  `${import.meta.env.VITE_API_URL}/track-progress`
);

export const getUserStats = async () => {
  const res = await api.get(`/stats`);
  return res.data;
};

export const getCompletedCourses = async () => {
  const res = await api.get(`/completed-courses`);
  return res.data;
};

export const getActivity = async () => {
  const res = await api.get(`/activity`);
  return res.data;
};

export interface EnrichedSkill {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  courseCount: number;
  careers: string[];
  lastUpdated: string | null;
}

export const getEnrichedSkills = async (): Promise<EnrichedSkill[]> => {
  const res = await api.get(`/skills`);
  return res.data;
};