import { createAuthenticatedApi } from "./apiClient";

const AI_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const api = createAuthenticatedApi(`${AI_BASE_URL}/ai`);

// Type definitions
export interface CareerMatch {
  career_id?: number;
  id?: number;
  title: string;
  description?: string;
  explanation?: string;
  industry?: string;
  image_url?: string;
  match_score?: number;
  score?: number;
  matching_skills?: string[];
  matchingSkills?: string[];
  skills_to_develop?: string[];
  skillsToDevelop?: string[];
}

export interface MatchRequest {
  faculty_id: number;
  major_id: number;
  skills: number[];
  interests: number[];
  user_id: string;
}

// API Functions - Match Results
export const getMatchHistory = async (userId: string): Promise<CareerMatch[]> => {
  const res = await api.get(`/history/${userId}`);
  return res.data;
};

export const submitMatch = async (data: MatchRequest): Promise<CareerMatch[]> => {
  const res = await api.post("/match", data);
  return res.data;
};

export const getCareerDetails = async (careerId: number): Promise<any> => {
  const res = await api.get(`/careers/${careerId}`);
  return res.data;
};

// API Functions - Form Data
export const getFaculties = async (): Promise<any[]> => {
  const res = await api.get("/faculties");
  return res.data;
};

export const getMajors = async (facultyId: number): Promise<any[]> => {
  const res = await api.get(`/majors/${facultyId}`);
  return res.data;
};

export const getSkills = async (): Promise<any[]> => {
  const res = await api.get("/skills");
  return res.data;
};

export const getInterests = async (): Promise<any[]> => {
  const res = await api.get("/interests");
  return res.data;
};
