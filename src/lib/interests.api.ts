import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/interests",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Interest {
  interest_id: number;
  interest_name: string;
}

export const getInterests = async (): Promise<Interest[]> => {
  const res = await api.get("/");
  return res.data;
};

export const createInterest = async (data: {
  interest_name: string;
}) => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateInterest = async (
  id: number,
  data: { interest_name: string }
) => {
  const res = await api.patch(`/${id}`, data);
  return res.data;
};

export const deleteInterest = async (id: number) => {
  await api.delete(`/${id}`);
};
