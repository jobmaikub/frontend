export interface BanHistory {
  banId: number;
  banDate: string;
  unbanDate: string;
  reason: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
  banHistory: BanHistory[];
}
