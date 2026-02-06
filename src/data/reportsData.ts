// // src/data/reportsData.ts

// export interface Report {
//   id: number;
//   reporterId: string;
//   offenderId: string;
//   category: string;
//   date: string;
// }

// export const reportsData: Report[] = [
//   { id: 1, reporterId: "001", offenderId: "020", category: "Harassment", date: "2025-12-10" },
//   { id: 2, reporterId: "002", offenderId: "032", category: "Harassment", date: "2025-12-11" },
//   { id: 3, reporterId: "003", offenderId: "124", category: "Harassment", date: "2025-12-20" },
//   { id: 4, reporterId: "004", offenderId: "049", category: "Harassment", date: "2025-12-19" },
//   { id: 5, reporterId: "005", offenderId: "006", category: "Harassment", date: "2025-12-30" },
// ];
// src/data/reportsData.ts

export interface Report {
  id: number;
  reporterId: string;
  offenderId: string;
  category: string;
  date: string;
}

export const reportsData: Report[] = [
  { id: 1, reporterId: "001", offenderId: "020", category: "Harassment", date: "2026-01-10" },
  { id: 2, reporterId: "002", offenderId: "032", category: "Spam", date: "2026-01-11" },
  { id: 3, reporterId: "003", offenderId: "124", category: "Inappropriate Content", date: "2026-01-12" },
  { id: 4, reporterId: "004", offenderId: "049", category: "Scam or Fraud", date: "2026-01-14" },
  { id: 5, reporterId: "005", offenderId: "006", category: "False Information", date: "2026-01-15" },
  { id: 6, reporterId: "009", offenderId: "088", category: "Hate Speech", date: "2026-01-16" },
  { id: 7, reporterId: "012", offenderId: "055", category: "Impersonation", date: "2026-01-17" },
  { id: 8, reporterId: "015", offenderId: "042", category: "Intellectual Property Violation", date: "2026-01-18" },
  { id: 9, reporterId: "021", offenderId: "099", category: "Harassment", date: "2026-01-19" },
  { id: 10, reporterId: "022", offenderId: "101", category: "Privacy Violation", date: "2026-01-19" },
];