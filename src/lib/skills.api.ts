import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/skills"
);

/* ---------- types ---------- */
export interface Skill {
  skill_id: number;
  name: string;
  category: any;
  icon?: string;
}

/* ใช้กับ form เท่านั้น */
export interface SkillFormData {
  name: string;
  category: any;
  icon?: string;
}

/* ---------- api ---------- */
export const getSkills = async (): Promise<Skill[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createSkill = async (payload: {
  name: string;
  category: any;
  icon?: string;
}) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const updateSkill = async (
  id: number,
  payload: Partial<{
    name: string;
    category: any;
    icon?: string;
  }>
): Promise<Skill> => {
  const res = await api.patch(`/${id}`, payload);
  return res.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};
