import axios from "axios";
import { User } from "@/data/usersData";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/users",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get("/");
  return res.data;
}

export async function fetchUserById(id: number): Promise<User> {
  const res = await api.get(`/${id}`);
  return res.data;
}

export async function createUser(data: {
  name: string;
  email: string;
  role: "admin" | "user";
}): Promise<User> {
  const res = await api.post("/", data);
  return res.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/${id}`);
}

export async function updateUserStatus(
  id: number,
  status: "unban" | "ban"
): Promise<User> {
  const res = await api.patch(`/${id}/status`, { status });
  return res.data;
}
