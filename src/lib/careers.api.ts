import { createAuthenticatedApi } from "./apiClient";

export interface Career {
  career_id: number;
  title: string;
  description: string;
  industry_id: number;
  major_id?: number;
  min_salary?: number;
  max_salary?: number;
  growth_rate?: number | string;
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
  const payload = {
    title: data.title,
    description: data.description,
    industry_id: data.industry_id,
    major_id: data.major_id,
    minSalary: data.min_salary,
    maxSalary: data.max_salary,
    growth: data.growth_rate,
    image: data.image_url,
    required_skills: data.required_skills,
    responsibilities: data.responsibilities,
  };

  const res = await api.post("/", payload);
  return res.data;
}

/* ===== UPDATE ===== */
export async function updateCareer(
  id: number,
  data: Partial<Career>
) {
  const payload = {
    title: data.title,
    description: data.description,
    industry_id: data.industry_id,
    major_id: data.major_id,
    minSalary: data.min_salary,
    maxSalary: data.max_salary,
    growth: data.growth_rate !== undefined ? Number(data.growth_rate) : undefined,
    image: data.image_url,
    required_skills: data.required_skills,
    responsibilities: data.responsibilities,
  };

  const res = await api.patch(`/${id}`, payload);
  return res.data;
}

/* ===== DELETE ===== */
export async function deleteCareer(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}

const unwrapData = (value: any): any => {
  let current = value;
  let depth = 0;
  while (current && typeof current === "object" && "data" in current && depth < 4) {
    current = current.data;
    depth += 1;
  }
  return current;
};

const extractRelationIds = (payload: any, primaryKey: string, nestedKey: string): number[] => {
  const rows = unwrapData(payload);
  if (!Array.isArray(rows)) {
    return [];
  }

  const pickNestedPrimary = (nested: any): any => {
    if (Array.isArray(nested) && nested.length > 0) {
      return nested[0]?.[primaryKey] ?? nested[0]?.id;
    }
    return nested?.[primaryKey] ?? nested?.id;
  };

  return rows
    .map((item: any) => Number(
      item?.[primaryKey] ??
      item?.[primaryKey.replace("_id", "Id")] ??
      pickNestedPrimary(item?.[nestedKey]) ??
      item?.id ??
      item
    ))
    .filter((id: number) => Number.isFinite(id) && id > 0);
};

export async function fetchCareerSkillIds(careerId: number): Promise<number[]> {
  try {
    const relationRes = await api.get(`/${careerId}/skills`);
    return extractRelationIds(relationRes.data, "skill_id", "skills");
  } catch {
    return [];
  }
}

export async function fetchCareerInterestIds(careerId: number): Promise<number[]> {
  try {
    const relationRes = await api.get(`/${careerId}/interests`);
    return extractRelationIds(relationRes.data, "interest_id", "interests");
  } catch {
    return [];
  }
}

export async function replaceCareerSkillLinks(careerId: number, skillIds: number[]): Promise<void> {
  const targetIds = Array.from(new Set((skillIds || []).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)));
  const currentIds = await fetchCareerSkillIds(careerId);

  const currentSet = new Set(currentIds);
  const targetSet = new Set(targetIds);

  const toAdd = targetIds.filter((id) => !currentSet.has(id));
  const toRemove = currentIds.filter((id) => !targetSet.has(id));

  await Promise.all([
    ...toAdd.map((skillId) => api.post(`/${careerId}/skills/${skillId}`)),
    ...toRemove.map((skillId) => api.delete(`/${careerId}/skills/${skillId}`)),
  ]);
}

export async function replaceCareerInterestLinks(careerId: number, interestIds: number[]): Promise<void> {
  const targetIds = Array.from(new Set((interestIds || []).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)));
  const currentIds = await fetchCareerInterestIds(careerId);

  const currentSet = new Set(currentIds);
  const targetSet = new Set(targetIds);

  const toAdd = targetIds.filter((id) => !currentSet.has(id));
  const toRemove = currentIds.filter((id) => !targetSet.has(id));

  await Promise.all([
    ...toAdd.map((interestId) => api.post(`/${careerId}/interests/${interestId}`)),
    ...toRemove.map((interestId) => api.delete(`/${careerId}/interests/${interestId}`)),
  ]);
}
