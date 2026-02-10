import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/lessons",
  headers: {
    "Content-Type": "application/json",
  },
});

export const lessonsApi = {
  getAll: (courseId?: number) =>
    api.get("/", {
      params: courseId ? { course_id: courseId } : {},
    }),

  create: (data: {
    title: string;
    courseId: number;
    order: number;
    duration?: number;
    externalUrl?: string;
  }) =>
    api.post("/", {
      title: data.title,
      course_id: data.courseId,
      lesson_order: data.order,
      duration: data.duration,
      external_url: data.externalUrl,
    }),

  update: (
    id: number,
    data: {
      title?: string;
      courseId?: number;
      order?: number;
      duration?: number;
      externalUrl?: string;
    }
  ) =>
    api.patch(`/${id}`, {
      title: data.title,
      course_id: data.courseId,
      lesson_order: data.order,
      duration: data.duration,
      external_url: data.externalUrl,
    }),

  delete: (id: number) =>
    api.delete(`/${id}`),
};
