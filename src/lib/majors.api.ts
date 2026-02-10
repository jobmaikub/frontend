import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/majors",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Major {
  major_id: number;
  name: string;
  name_th?: string;
  description?: string;
  faculty_id: number;
}

export const getMajors = async (): Promise<Major[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createMajor = async (
  payload: Omit<Major, "major_id">
) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const updateMajor = async (
  id: number,
  payload: Partial<Omit<Major, "major_id">>
) => {
  const res = await api.patch(`/${id}`, payload);
  return res.data;
};

export const deleteMajor = async (id: number) => {
  await api.delete(`/${id}`);
};
