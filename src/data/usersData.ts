export interface BanHistory {
  banId: string;
  banDate: string;
  unbanDate: string | null;
  reason: string;
}

export interface UserReport {
  reportId: string | number;
  offenderId: string | number;
  lastUpdate: string;
  reason: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
  banHistory: BanHistory[];
  reports?: UserReport[];
}
