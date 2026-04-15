import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/faculties"
);

export interface Faculty {
  faculty_id: number;
  eng_name: string;
  th_name?: string;
}

export const getFaculties = async (): Promise<Faculty[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createFaculty = async (data: { eng_name: string; th_name?: string }) => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateFaculty = async (
  id: number,
  data: { eng_name?: string; th_name?: string }
) => {
  const res = await api.patch(`/${id}`, data);
  return res.data;
};

export const deleteFaculty = async (id: number) => {
  await api.delete(`/${id}`);
};
