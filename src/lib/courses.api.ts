import axios from "axios";

export interface Course {
  course_id: number;
  title: string;
  description: string;
  career_id: number;
  career_name?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_mins: number;
  external_url: string;
  course_order: number;
  skills_taught: string[];
  learning_outcome: string[];
  course_image?: string;
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/admin/courses",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/");
  return res.data;
}

export async function createCourse(data: Partial<Course>) {
  const res = await api.post("/", data);
  return res.data;
}

export async function updateCourse(id: number, data: Partial<Course>) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}

export async function deleteCourse(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
