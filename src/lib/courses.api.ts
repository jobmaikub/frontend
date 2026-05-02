import { createAuthenticatedApi } from "./apiClient";

export interface Course {
  course_id: number;
  title: string;
  description: string;
  career_id: number;
  career_path?: string;
  career_name?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_mins: number;
  course_order: number;
  skills_taught: string[];
  learning_outcome: string[];
  image_url?: string;
}

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/courses"
);

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/");
  return res.data;
}

export async function createCourse(data: Partial<Course>) {
  const payload = {
    title: data.title,
    description: data.description,
    career_id: data.career_id,
    career_path: data.career_path,
    level: data.level,
    duration_mins: data.duration_mins,
    course_order: data.course_order,
    image_url: data.image_url,
    skills_taught: data.skills_taught,
    learning_outcome: data.learning_outcome,
  };
  const res = await api.post("/", payload);
  return res.data;
}

export async function updateCourse(id: number, data: Partial<Course>) {
  const payload = {
    title: data.title,
    description: data.description,
    career_id: data.career_id,
    career_path: data.career_path,
    level: data.level,
    duration_mins: data.duration_mins,
    course_order: data.course_order,
    image_url: data.image_url,
    skills_taught: data.skills_taught,
    learning_outcome: data.learning_outcome,
  };
  const res = await api.patch(`/${id}`, payload);
  return res.data;
}

export async function deleteCourse(id: number) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
