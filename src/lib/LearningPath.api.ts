import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type LearningPath = {
  id: number;
  title: string;
  image: string;
  growth: string;
  courses: number;
  hours: number;
  progress: number;
};

export const learningPathApi = {
  getAll: (userId: string) =>
    api.get<LearningPath[]>("/learning-paths", {
      params: { user_id: userId },
    }),
  start: (userId: string, careerId: number) =>
    api.post("/learning-paths/start", { user_id: userId, career_id: careerId }),
  getCourses: (userId: string, careerId: number) =>
    api.get(`/learning-paths/${careerId}/courses`, {
      params: { user_id: userId },
    }),
  getLessons: (userId: string, courseId: number) =>
    api.get(`/learning-paths/courses/${courseId}/lessons`, {
      params: { user_id: userId },
    }),
  completeLesson: (userId: string, lessonId: number, done: boolean) =>
    api.post(`/learning-paths/lessons/${lessonId}/complete`, { user_id: userId, done: done }),
  completeCourse: (userId: string, courseId: number, done: boolean) =>
    api.post(`/learning-paths/courses/${courseId}/complete`, { user_id: userId, done: done }),
  bulkUpdateLessons: (userId: string, updates: { lesson_id: number, done: boolean }[]) =>
    api.post(`/learning-paths/lessons/bulk-update`, { user_id: userId, updates: updates }),
  deletePath: (userId: string, careerId: number) =>
    api.delete(`/learning-paths/${careerId}`, { params: { user_id: userId } }),
};