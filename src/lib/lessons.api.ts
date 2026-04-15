import { createAuthenticatedApi } from "./apiClient";

export interface Lesson {
  lesson_id: number;
  title: string;
  course_id: number;
  lesson_order: number;
  duration_mins: number;
  external_url: string;
}

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/lessons"
);

export async function getLessons(): Promise<Lesson[]> {
  const res = await api.get("/");
  return res.data;
}

export async function createLesson(data: Partial<Lesson>) {
  const res = await api.post("/", data);
  return res.data;
}

export async function updateLesson(id: number, data: Partial<Lesson>) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}

export async function deleteLesson(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
