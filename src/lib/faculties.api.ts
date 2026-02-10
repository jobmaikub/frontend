import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/faculties",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Faculty {
  faculty_id: number;
  name: string;
  name_th?: string;
  icon?: string;
  theme_color?: string;
}

export const getFaculties = async (): Promise<Faculty[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createFaculty = async (data: { name: string }) => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateFaculty = async (
  id: number,
  data: { name: string }
) => {
  const res = await api.patch(`/${id}`, data);
  return res.data;
};

export const deleteFaculty = async (id: number) => {
  await api.delete(`/${id}`);
};
