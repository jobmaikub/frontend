// Career-related TypeScript interfaces used across the application

export interface RequiredSkill {
  name: string;
  type: 'Soft' | 'Technical' | 'Analytical';
}

export interface Course {
  name: string;
  description: string;
  hours: number;
}

export interface LearningLevel {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  courses: Course[];
}

export interface Review {
  id: string;
  userId?: string | number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  replies?: Review[];
}

export interface Career {
  id: string | number;
  title: string;
  image: string;
  track: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  growthRate: 'stable' | 'medium' | 'high';
  growth_rate?: number;
  keyResponsibilities: string[];
  requiredSkills: RequiredSkill[];
  learningPath: LearningLevel[];
  totalCourses?: number;
  totalHours?: number;
  reviews: Review[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  industry: string;
  image: string;
  url?: string;
}
