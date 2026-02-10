import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/careers",
  headers: {
    "Content-Type": "application/json",
  },
});

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
  industry: string;
  min_salary?: number;
  max_salary?: number;
  growth_rate?: number;
  image_url?: string;
  required_skills?: string[];
  responsibilities?: string[];
  interest?: string;
}) {
  const res = await api.post("/", data);
  return res.data;
}

/* ===== UPDATE ===== */
export async function updateCareer(
  id: number,
  data: any
) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}

/* ===== DELETE ===== */
export async function deleteCareer(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
