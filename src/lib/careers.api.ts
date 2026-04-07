import { createAuthenticatedApi } from "./apiClient";

export interface Career {
  career_id: number;
  title: string;
  description: string;
  industry_id: number;
  major_id?: number;
  min_salary?: number;
  max_salary?: number;
  growth_rate?: string;
  image_url?: string;
  required_skills?: string[];
  responsibilities?: string[];
  industries?: {
    industry_id: number;
    name: string;
  };
}

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/careers"
);

/* ===== GET ===== */
export async function fetchCareers(industry?: string) {
  const res = await api.get("/", {
    params: industry ? { industry } : {},
  });
  return res.data;
}

/* ===== CREATE ===== */
export async function createCareer(data: {
  title: string;
  description: string;
  industry_id: number;
  major_id?: number;
  min_salary?: number;
  max_salary?: number;
  growth_rate?: number;
  image_url?: string;
  required_skills?: string[];
  responsibilities?: string[];
}) {
  const res = await api.post("/", data);
  return res.data;
}

/* ===== UPDATE ===== */
export async function updateCareer(
  id: number,
  data: Partial<Career>
) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}

/* ===== DELETE ===== */
export async function deleteCareer(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
