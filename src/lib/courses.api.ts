import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/courses",
    headers: {
        "Content-Type": "application/json",
    },
});

export const coursesApi = {

    getAll: () => api.get("/"),

    create: (data: any) =>
        api.post("/", {
            title: data.title,
            description: data.description,
            career_path: data.career,
            level: data.level,
            duration: data.hours,
            external_url: data.externalUrl,
            course_order: data.order,
            skills_taught: Array.isArray(data.skillsTaught)
                ? data.skillsTaught
                : data.skillsTaught
                    ?.split("\n")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
            learning_outcome: data.learningOutcome,
        }),

    update: (id: number, data: any) =>
        api.patch(`/${id}`, {
            title: data.title,
            description: data.description,
            career_path: data.career_path,
            level: data.level,
            duration: data.duration,
            external_url: data.external_url,
            course_order: data.course_order,
            skills_taught: data.skills_taught,
            learning_outcome: data.learning_outcome,
        }),

    delete: (id: number) =>
        api.delete(`/${id}`),
};
