import { createAuthenticatedApi } from "./apiClient";
import { User } from "@/types/users.types";
import { supabase } from "@/lib/supabase";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/users"
);

const banApi = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/ban-users"
);

const reportApi = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/user-reports"
);

const baseApi = createAuthenticatedApi(
  import.meta.env.VITE_API_URL
);

export interface BanUserRow {
  ban_id: string;
  user_id: string;
  ban_date: string;
  unban_date: string | null;
  reason: string | null;
  created_by: string | null;
}

export interface AdminUserReportRow {
  report_id: string;
  by_user_id: string;
  report_user_id: string;
  reason: string;
  report_type: string;
  status: string;
  created_at: string;
  updated_at?: string;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_note?: string | null;
  review_id?: string | number | null;
  review?: { career_id: number } | null;
}

export interface ResolveAndBanResult {
  report: AdminUserReportRow;
  ban: BanUserRow | null;
  alreadyBanned: boolean;
  report_user_id?: string;
  resolved_report_ids?: string[];
  resolved_count?: number;
}

type RawUserReport = {
  reportId?: string | number;
  report_id?: string | number;
  reporterId?: string | number;
  by_user_id?: string | number;
  offenderId?: string | number;
  report_user_id?: string | number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  reason?: string;
  status?: string;
  type?: string;
  report_type?: string;
};

const normalizeUser = (raw: any): User => {
  const normalizedIsBanned =
    typeof raw.is_banned === "boolean"
      ? raw.is_banned
      : typeof raw.isBanned === "boolean"
        ? raw.isBanned
        : undefined;

  return {
    id: raw.id ?? raw.user_id ?? raw.profile_id,
    name: raw.name ?? raw.full_name ?? raw.username ?? "Unknown",
    email: raw.email ?? "",
    role: (raw.role ?? "user").toLowerCase() === "admin" ? "admin" : "user",
    joinedDate: raw.joinedDate ?? raw.joined_at ?? raw.joined_date ?? raw.created_at ?? "",
    is_banned: normalizedIsBanned,
    banHistory: Array.isArray(raw.banHistory) ? raw.banHistory : [],
    reports: Array.isArray(raw.reports)
      ? raw.reports.map((report: RawUserReport) => ({
        reportId: report.reportId ?? report.report_id ?? "",
        reporterId: report.reporterId ?? report.by_user_id,
        offenderId:
          report.offenderId ??
          report.report_user_id ??
          raw.id ??
          raw.user_id ??
          raw.profile_id ??
          "",
        lastUpdate:
          report.updatedAt ??
          report.updated_at ??
          report.createdAt ??
          report.created_at ??
          "",
        reason: report.reason ?? "",
        status: report.status,
        reportType: report.type ?? report.report_type,
      }))
      : [],
  };
};

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get("/");
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map(normalizeUser);
}

export async function fetchUserById(id: string | number): Promise<User> {
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

export async function updateProfile(
  userId: string,
  data: Partial<{
    full_name: string;
    username: string;
    avatar_url: string;
    skills: string[];
  }>
) {
  const { data: updated, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function fetchBanHistory(userId?: string | number): Promise<BanUserRow[]> {
  const res = await banApi.get("/");
  const rows = Array.isArray(res.data) ? (res.data as BanUserRow[]) : [];

  if (userId === undefined || userId === null) {
    return rows;
  }

  return rows.filter((row) => String(row.user_id) === String(userId));
}

export async function banUser(
  userId: string | number,
  reason: string,
  createdBy?: string | null,
  banUntil?: string | null
): Promise<BanUserRow> {
  const payload: {
    user_id: string;
    reason: string;
    created_by: string | null;
    unban_date?: string | null;
  } = {
    user_id: String(userId),
    reason: reason || "Banned by admin",
    created_by: createdBy ?? null,
  };

  if (banUntil) {
    payload.unban_date = banUntil;
  }

  const res = await banApi.post("/", payload);
  return res.data as BanUserRow;
}

export async function unbanUser(userId: string | number): Promise<any> {
  const res = await banApi.patch(`/user/${String(userId)}/unban`);
  return res.data;
}

// This helper is used during login flow, so it queries Supabase directly.
export async function fetchActiveBanByUser(userId: string): Promise<BanUserRow | null> {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("ban_users")
    .select("ban_id, user_id, ban_date, unban_date, reason, created_by")
    .eq("user_id", userId)
    .or(`unban_date.is.null,unban_date.gt.${nowIso}`)
    .order("ban_date", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : null;
  return row ? (row as BanUserRow) : null;
}

export async function fetchReports(status?: string): Promise<AdminUserReportRow[]> {
  const endpoint = status === "pending" ? "/pending" : "/";
  const res = await reportApi.get(endpoint);
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows as AdminUserReportRow[];
}

export async function resolveAndBanReport(data: {
  reportId: string;
  resolvedBy: string;
  resolutionNote?: string;
  banReason?: string;
  banUntil?: string;
}): Promise<ResolveAndBanResult> {
  const res = await reportApi.patch(`/${data.reportId}/resolve-and-ban`, {
    resolved_by: data.resolvedBy,
    resolution_note: data.resolutionNote,
    ban_reason: data.banReason,
    ban_until: data.banUntil,
  });

  return res.data as ResolveAndBanResult;
}

export async function fetchUserDashboard(userId: string) {
  const res = await baseApi.get(`/user-dashboard/${userId}`);
  return res.data;
}
