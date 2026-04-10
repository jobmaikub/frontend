import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/industries"
);

export interface Industry {
  industry_id: number;
  name?: string;
  industry_name?: string;
}

export async function getIndustries(): Promise<Industry[]> {
  const res = await api.get("/");
  const raw = Array.isArray(res.data) ? res.data : [];
  return raw.map((item: any) => ({
    industry_id: Number(item.industry_id),
    name: item.name ?? item.industry_name,
    industry_name: item.industry_name ?? item.name,
  }));
}

export async function createIndustry(data: {
  industry_name: string;
}) {
  const res = await api.post("/", data);
  return res.data;
}

export async function updateIndustry(
  id: number,
  data: { industry_name: string }
) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}

export async function deleteIndustry(id: number) {
  await api.delete(`/${id}`);
}
