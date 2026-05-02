// User-related TypeScript interfaces used across the application

export interface BanHistory {
  banId: string;
  banDate: string;
  unbanDate: string | null;
  reason: string;
}

export interface UserReport {
  reportId: string | number;
  reporterId?: string | number;
  offenderId: string | number;
  lastUpdate: string;
  reason: string;
  status?: string;
  reportType?: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
  is_banned?: boolean;
  banHistory: BanHistory[];
  reports?: UserReport[];
}
