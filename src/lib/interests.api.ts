import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/interests"
);

export interface Interest {
  interest_id: number;
  interest_name: string;
}

export const getInterests = async (): Promise<Interest[]> => {
  const res = await api.get("/");
  const payload = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  return payload
    .map((row: any) => ({
      interest_id: Number(row?.interest_id ?? row?.id),
      interest_name: String(row?.interest_name ?? row?.name ?? ""),
    }))
    .filter((row: Interest) => Number.isFinite(row.interest_id) && row.interest_id > 0);
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
