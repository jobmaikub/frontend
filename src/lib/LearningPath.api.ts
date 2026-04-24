import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

type LearningPath = {
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
};