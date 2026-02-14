import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/industries",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===== GET ALL INDUSTRIES ===== */
export async function fetchIndustries() {
  const res = await api.get("/");
  return res.data;
}
