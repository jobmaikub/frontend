import axios from 'axios';
import careerTech from '@/assets/career-tech.jpg';
import type { Career, RequiredSkill, LearningLevel } from '@/types/careers.types';

export type { Career, RequiredSkill, LearningLevel };

// Fallback industries list (used if API fails)
export const industries = [
  'All Industries',
  'Technology',
  'Marketing',
  'Health',
  'Design & Creative',
  'Finance',
  'Education',
];

// Compute aggregate stats for a career's learning path
export function getCareerStats(career: Career) {
  // Prefer direct stats if available
  if (career.totalCourses !== undefined && career.totalHours !== undefined) {
    return { totalCourses: career.totalCourses, totalHours: career.totalHours };
  }

  const totalCourses = career.learningPath?.reduce((sum, level) => sum + level.courses.length, 0) || 0;
  const totalHours = career.learningPath?.reduce(
    (sum, level) => sum + level.courses.reduce((s, c) => s + c.hours, 0),
    0
  ) || 0;
  return { totalCourses, totalHours };
}

// Convert growth_rate number to string
function mapGrowthRate(rate: number): 'stable' | 'medium' | 'high' {
  if (rate <= 2) return 'stable';
  if (rate <= 5) return 'medium';
  return 'high';
}

// Parse required skills from database
function parseRequiredSkills(skills: (string | { name: string; type: string })[]): RequiredSkill[] {
  if (!Array.isArray(skills)) return [];

  return skills.map((skill: string | { name: string; type: string }) => {
    if (typeof skill === 'string') {
      try {
        const parsed = JSON.parse(skill);
        return {
          name: String(parsed.name || ''),
          type: String(parsed.type) as 'Soft' | 'Technical' | 'Analytical',
        };
      } catch (e) {
        return { name: skill, type: 'Soft' as const };
      }
    }
    return {
      name: String(skill.name || ''),
      type: String(skill.type) as 'Soft' | 'Technical' | 'Analytical',
    };
  });
}

// Fetch trending careers from backend
export async function fetchTrendingCareers(): Promise<Career[]> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/home/trending-careers`);
    const supabaseData = res.data as SupabaseCareerData[];
    
    return supabaseData.map((supabaseCareer) => {
      const requiredSkills: RequiredSkill[] = Array.isArray(supabaseCareer.required_skills)
        ? (supabaseCareer.required_skills as any[]).map((s: any) => ({
            name: s.name || s,
            type: s.type || 'Technical',
          }))
        : [];

      return {
        id: supabaseCareer.career_id,
        title: supabaseCareer.title,
        image: supabaseCareer.image_url || 'https://via.placeholder.com/300',
        track: supabaseCareer.industry || 'Technology',
        description: supabaseCareer.description,
        salaryMin: supabaseCareer.min_salary || 0,
        salaryMax: supabaseCareer.max_salary || 0,
        growthRate: mapGrowthRate(supabaseCareer.growth_rate),
        growth_rate: supabaseCareer.growth_rate,
        keyResponsibilities: supabaseCareer.responsibilities || [],
        requiredSkills,
        learningPath: [] as LearningLevel[],
        totalCourses: supabaseCareer.course_count || 0,
        totalHours: supabaseCareer.duration_hrs || 0,
        reviews: [],
      } as Career;
    });
  } catch (err) {
    console.error('[careers.service] Error fetching trending careers:', err);
    return [];
  }
}

interface SupabaseCareerData {
  career_id: number;
  title: string;
  description: string;
  required_skills: (string | { name: string; type: string })[];
  responsibilities: string[];
  min_salary: number;
  max_salary: number;
  growth_rate: number;
  image_url: string;
  industry: string;
  course_count: number;
  duration_hrs: number;
}

// Fetch Supabase career data
async function fetchCareerDataFromSupabase(): Promise<SupabaseCareerData[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/home/all-careers`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data as SupabaseCareerData[];
  } catch (error) {
    console.warn('[careers.service] Failed to fetch careers data:', error);
    return [];
  }
}

// Initialize careers from database
export let careers: Career[] = [];
export const careersMockBase: Career[] = [];

// Fetch and transform careers from the database
export async function initializeCareers(): Promise<Career[]> {
  const supabaseData = await fetchCareerDataFromSupabase();

  careers = supabaseData.map((supabaseCareer) => {
    const growthRate = mapGrowthRate(supabaseCareer.growth_rate);
    const requiredSkills = parseRequiredSkills(supabaseCareer.required_skills);

    return {
      id: supabaseCareer.career_id,
      title: supabaseCareer.title || '',
      image: supabaseCareer.image_url || careerTech,
      track: supabaseCareer.industry || 'Technology',
      description: supabaseCareer.description || '',
      salaryMin: supabaseCareer.min_salary || 0,
      salaryMax: supabaseCareer.max_salary || 0,
      growthRate,
      growth_rate: supabaseCareer.growth_rate,
      keyResponsibilities: supabaseCareer.responsibilities || [],
      requiredSkills,
      learningPath: [] as LearningLevel[],
      totalCourses: supabaseCareer.course_count || 0,
      totalHours: supabaseCareer.duration_hrs || 0,
      reviews: [],
    } as Career;
  });

  return careers;
}

// Initialize careers on module load
initializeCareers().catch((error) => console.error('[careers.service] Failed to initialize careers:', error));
