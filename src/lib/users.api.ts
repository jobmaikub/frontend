import { createAuthenticatedApi } from "./apiClient";
import { User } from "@/data/usersData";
import { supabase } from "@/supabase";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/users"
);

export interface BanUserRow {
  ban_id: string;
  user_id: string;
  ban_date: string;
  unban_date: string | null;
  reason: string | null;
  created_by: string | null;
}

const normalizeUser = (raw: any): User => {
  return {
    id: raw.id ?? raw.user_id ?? raw.profile_id,
    name: raw.name ?? raw.full_name ?? raw.username ?? "Unknown",
    email: raw.email ?? "",
    role: (raw.role ?? "user").toLowerCase() === "admin" ? "admin" : "user",
    joinedDate: raw.joinedDate ?? raw.joined_date ?? raw.created_at ?? "",
    banHistory: Array.isArray(raw.banHistory) ? raw.banHistory : [],
  };
};

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get("/");
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map(normalizeUser);
}

export async function fetchUserById(id: number): Promise<User> {
  const res = await api.get(`/${id}`);
  return normalizeUser(res.data);
}

export async function createUser(data: {
  name: string;
  email: string;
  role: "admin" | "user";
}): Promise<User> {
  const res = await api.post("/", data);
  return normalizeUser(res.data);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/${id}`);
}

export async function updateUserStatus(
  id: number,
  status: "unban" | "ban"
): Promise<User> {
  const res = await api.patch(`/${id}/status`, { status });
  return normalizeUser(res.data);
}

export async function fetchBanHistory(userId?: string | number): Promise<BanUserRow[]> {
  let query = supabase
    .from("ban_users")
    .select("ban_id, user_id, ban_date, unban_date, reason, created_by")
    .order("ban_date", { ascending: false });

  if (userId !== undefined && userId !== null) {
    query = query.eq("user_id", String(userId));
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return Array.isArray(data) ? (data as BanUserRow[]) : [];
}

export async function banUser(
  userId: string | number,
  reason: string,
  createdBy?: string | null,
  banUntil?: string | null
): Promise<BanUserRow> {
  const payload = {
    user_id: String(userId),
    reason: reason || "Banned by admin",
    created_by: createdBy ?? null,
    ban_date: new Date().toISOString(),
    unban_date: banUntil || null,
  };

  const { data, error } = await supabase
    .from("ban_users")
    .insert(payload)
    .select("ban_id, user_id, ban_date, unban_date, reason, created_by")
    .single();

  if (error) {
    throw error;
  }

  return data as BanUserRow;
}

export async function unbanUser(userId: string | number): Promise<BanUserRow[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("ban_users")
    .update({ unban_date: nowIso })
    .eq("user_id", String(userId))
    .or(`unban_date.is.null,unban_date.gt.${nowIso}`)
    .select("ban_id, user_id, ban_date, unban_date, reason, created_by");

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? (data as BanUserRow[]) : [];
}

export async function fetchActiveBanByUser(userId: string): Promise<BanUserRow | null> {
  const rows = await fetchBanHistory(userId);
  const now = new Date();
  const active = rows.find((row) => !row.unban_date || new Date(row.unban_date) > now);
  return active || null;
}
