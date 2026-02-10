export interface Course {
  id: number;
  title: string;
  description: string;
  career: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  externalUrl: string;
  order: number;
  skillsTaught: string[];     
  learningOutcome?: string;    
  image?: string;
}

export interface UpdateCoursePayload {
  title: string;
  description: string;
  career_path: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  external_url: string;
  course_order: number;
  skills_taught: string[];
  learning_outcome?: string;
}

type CourseLevel = "beginner" | "intermediate" | "advanced";
