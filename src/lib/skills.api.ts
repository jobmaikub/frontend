import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/skills",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- types ---------- */
export interface SkillCategory {
  faculty_id: number;
  major_id: number;
}

export interface Skill {
  skill_id: number;
  name: string;
  category: SkillCategory;
  icon?: string;
}

/* ใช้กับ form เท่านั้น */
export interface SkillFormData {
  name: string;
  faculty_id: number;
  major_id: number;
  icon?: string;
}

/* ---------- api ---------- */
export const getSkills = async (): Promise<Skill[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createSkill = async (payload: {
  name: string;
  category: SkillCategory;
  icon?: string;
}) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const updateSkill = async (
  id: number,
  payload: Partial<{
    name: string;
    category: SkillCategory;
    icon?: string;
  }>
): Promise<Skill> => {
  const res = await api.patch(`/${id}`, payload);
  return res.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};
