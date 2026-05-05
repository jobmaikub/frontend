import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/ai"
);

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

export interface UserSelection {
  faculty_id: number | null;
  major_id: number | null;
  skill_ids: number[];
  interest_ids: number[];
}

export interface MatchHistoryResponse {
  matches: CareerMatch[];
  userSelection: UserSelection;
}

export interface MatchRequest {
  faculty_id: number;
  major_id: number;
  skills: number[];
  interests: number[];
  user_id: string;
}

// API Functions - Match Results
export const getMatchHistory = async (userId: string): Promise<MatchHistoryResponse | null> => {
  const res = await api.get(`/history/${userId}`);
  // backend ส่งกลับเป็น { matches, userSelection } หรือ [] (ถ้าไม่มี history)
  if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) return null;
  return res.data as MatchHistoryResponse;
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
