import careerTech from '@/assets/career-tech.jpg';
import newsThumb1 from '@/assets/news-thumb-1.jpg';
import newsThumb2 from '@/assets/news-thumb-2.jpg';

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
  keyResponsibilities: string[];
  requiredSkills: RequiredSkill[];
  learningPath: LearningLevel[];
  reviews: Review[];
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
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  industry: string;
  image: string;
}

export const industries = [
  'All Industries',
  'Technology',
  'Marketing',
  'Health',
  'Design & Creative',
  'Finance',
  'Education',
];

export const industryNews: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Tech Industry Sees 15% Growth in Q4 2024',
    description: 'The technology sector continues to expand with increasing demand for skilled professionals in AI...',
    source: 'Tech News',
    industry: 'Technology',
    image: newsThumb1,
  },
  {
    id: 'n2',
    title: 'Remote Work Reshapes Career Landscape',
    description: 'More companies adopting hybrid models, creating new opportunities for global talent and flexible...',
    source: 'Career Insider',
    industry: 'Marketing',
    image: newsThumb2,
  },
  {
    id: 'n3',
    title: 'AI Revolution Transforms Healthcare Sector',
    description: 'Artificial intelligence is reshaping diagnostics, treatment planning, and patient care across hospitals...',
    source: 'Health Weekly',
    industry: 'Health',
    image: newsThumb1,
  },
  {
    id: 'n4',
    title: 'Creative Industry Embraces AI Design Tools',
    description: 'Designers and artists are leveraging AI-powered tools to enhance creativity and streamline workflows...',
    source: 'Design Today',
    industry: 'Design & Creative',
    image: newsThumb2,
  },
  {
    id: 'n5',
    title: 'Cybersecurity Jobs Surge 40% in 2024',
    description: 'Growing cyber threats drive unprecedented demand for security professionals across all industries...',
    source: 'Tech News',
    industry: 'Technology',
    image: newsThumb1,
  },
  {
    id: 'n6',
    title: 'Digital Marketing Trends Reshaping 2025',
    description: 'From AI-driven personalization to short-form video content, the marketing landscape continues to evolve...',
    source: 'Marketing Weekly',
    industry: 'Marketing',
    image: newsThumb2,
  },
  {
    id: 'n7',
    title: 'Nursing Shortage Creates Premium Opportunities',
    description: 'Healthcare facilities worldwide are offering competitive packages to attract and retain nursing talent...',
    source: 'Health Weekly',
    industry: 'Health',
    image: newsThumb1,
  },
  {
    id: 'n8',
    title: 'The Future of UX Design in AI Era',
    description: 'UX designers are adapting to new paradigms as AI interfaces become more prevalent in digital products...',
    source: 'Tech News',
    industry: 'Technology',
    image: newsThumb2,
  },
];

// Fetch industry news from database
export async function fetchIndustryNewsFromDatabase(industry?: string): Promise<NewsArticle[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const limit = industry ? 10 : 20;
    const finalUrl = `${apiUrl}/home/industry-news?limit=${limit}${industry ? `&industry=${encodeURIComponent(industry)}` : ''}`;
    console.log('[News] Fetching from:', finalUrl);
    const response = await fetch(finalUrl);
    console.log('[News] Response status:', response.status, response.ok);
    
    if (!response.ok) {
      console.warn('[News] Response not ok, using empty data:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log('[News] Received data:', data);
    
    if (!Array.isArray(data)) {
      console.warn('[News] Data is not an array, using fallback');
      return industryNews;
    }
    
    // Map database fields to interface fields based on your Supabase structure
    const normalizedData = (data as any[]).map(item => {
      console.log(`[News Debug] ID: ${item.news_id}, Title: ${item.title}, Industry: ${item.industry}`);
      return {
        ...item,
        id: String(item.news_id || item.id),
        // Map image_url from DB to image in Frontend
        image: item.image_url || item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
        // Map source_name from DB to source in Frontend
        source: item.source_name || item.source || 'Industry News',
        // Map source_url from DB to url in Frontend
        url: item.source_url || item.url || '#',
        // Ensure industry field exists for filtering
        industry: item.industry || item.industry_name || 'All Industries'
      };
    });
    
    return normalizedData.reverse();
  } catch (error: any) {
    console.error('[News] Failed to fetch industry news:', error.message || error);
    return [];
  }
}

// Fetch industries from database
export async function fetchIndustriesFromDatabase(): Promise<string[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const finalUrl = `${apiUrl}/home/industries`;
    console.log('[Industries] Fetching from:', finalUrl);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      return industries;
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      return industries;
    }
    
    // Extract names and add 'All Industries'
    const names = data.map((item: any) => item.name);
    return ['All Industries', ...names];
  } catch (error) {
    console.warn('[Industries] Failed to fetch industries:', error);
    return industries;
  }
}

export function getCareerStats(career: Career) {
  const totalCourses = career.learningPath.reduce((sum, level) => sum + level.courses.length, 0);
  const totalHours = career.learningPath.reduce(
    (sum, level) => sum + level.courses.reduce((s, c) => s + c.hours, 0),
    0
  );
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
  
  return skills
    .map((skill: string | { name: string; type: string }) => {
      if (typeof skill === 'string') {
        try {
          const parsed = JSON.parse(skill);
          return {
            name: String(parsed.name || ''),
            type: String(parsed.type) as 'Soft' | 'Technical' | 'Analytical'
          };
        } catch (e) {
          return { name: skill, type: 'Soft' as const };
        }
      }
      return {
        name: String(skill.name || ''),
        type: String(skill.type) as 'Soft' | 'Technical' | 'Analytical'
      };
    });
}

// Fetch Supabase career data
async function fetchCareerDataFromSupabase(): Promise<SupabaseCareerData[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    console.log('[Supabase] Fetching from:', `${apiUrl}/home/all-careers`);
    const response = await fetch(`${apiUrl}/home/all-careers`);
    console.log('[Supabase] Response status:', response.status, response.ok);
    
    if (!response.ok) {
      console.warn('[Supabase] Response not ok:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log('[Supabase] Received data:', data);
    
    if (!Array.isArray(data)) {
      console.warn('[Supabase] Data is not an array');
      return [];
    }
    
    return data as SupabaseCareerData[];
  } catch (error) {
    console.warn('[Supabase] Failed to fetch careers data:', error);
    return [];
  }
}

// Mock learning paths - these don't exist in database yet
const mockLearningPaths: Record<number, LearningLevel[]> = {
  1: [ // UX/UI Designer
    {
      level: 'Beginner',
      courses: [
        { name: 'Introduction to UX Design', description: 'Learn the fundamentals of user experience design including user-centered principles', hours: 8 },
        { name: 'UI Design Basics', description: 'Master the basics of user interface design, color theory, and typography', hours: 10 },
        { name: 'Design Thinking Fundamentals', description: 'Understand the design thinking methodology and how to apply it', hours: 6 },
        { name: 'Figma for Beginners', description: 'Get started with Figma, the industry-standard design tool', hours: 12 },
      ],
    },
    {
      level: 'Intermediate',
      courses: [
        { name: 'Advanced Prototyping', description: 'Create complex interactive prototypes with micro-interactions', hours: 15 },
        { name: 'User Research Methods', description: 'Learn various user research techniques including interviews and surveys', hours: 10 },
        { name: 'Information Architecture', description: 'Structure content and navigation for optimal user experience', hours: 8 },
        { name: 'Design Systems', description: 'Build and maintain scalable design systems for large products', hours: 12 },
      ],
    },
    {
      level: 'Advanced',
      courses: [
        { name: 'UX Strategy & Leadership', description: 'Lead UX teams and define product strategy at scale', hours: 10 },
        { name: 'Accessibility & Inclusive Design', description: 'Design products accessible to all users regardless of ability', hours: 8 },
        { name: 'Advanced Interaction Design', description: 'Master complex interaction patterns and motion design', hours: 12 },
      ],
    },
  ],
  2: [ // Data Scientist
    {
      level: 'Beginner',
      courses: [
        { name: 'Python Fundamentals', description: 'Learn Python programming from scratch for data science', hours: 12 },
        { name: 'Statistics & Probability', description: 'Master essential statistical concepts for data analysis', hours: 10 },
        { name: 'SQL Foundations', description: 'Learn to query and manage databases with SQL', hours: 8 },
      ],
    },
    {
      level: 'Intermediate',
      courses: [
        { name: 'Machine Learning Fundamentals', description: 'Build predictive models with scikit-learn and Python', hours: 15 },
        { name: 'Data Visualization with Python', description: 'Create compelling visualizations with matplotlib and seaborn', hours: 10 },
        { name: 'Feature Engineering', description: 'Transform raw data into meaningful features for models', hours: 8 },
      ],
    },
    {
      level: 'Advanced',
      courses: [
        { name: 'Deep Learning & Neural Networks', description: 'Build deep learning models with TensorFlow and PyTorch', hours: 20 },
        { name: 'Natural Language Processing', description: 'Process and analyze text data with NLP techniques', hours: 12 },
        { name: 'MLOps & Model Deployment', description: 'Deploy and maintain ML models in production environments', hours: 10 },
      ],
    },
  ],
  3: [ // Project Manager
    {
      level: 'Beginner',
      courses: [
        { name: 'Project Management Fundamentals', description: 'Core concepts of project planning and execution', hours: 10 },
        { name: 'Agile & Scrum Basics', description: 'Learn agile methodology and scrum framework', hours: 8 },
        { name: 'Stakeholder Communication', description: 'Effective communication with project stakeholders', hours: 6 },
      ],
    },
    {
      level: 'Intermediate',
      courses: [
        { name: 'Advanced Scrum Master', description: 'Deep dive into scrum practices and team facilitation', hours: 12 },
        { name: 'Risk Management', description: 'Identify, assess, and mitigate project risks', hours: 8 },
        { name: 'Budget & Resource Planning', description: 'Manage project budgets and allocate resources effectively', hours: 10 },
      ],
    },
    {
      level: 'Advanced',
      courses: [
        { name: 'Strategic Leadership', description: 'Lead large-scale transformation initiatives', hours: 12 },
        { name: 'Organizational Change Management', description: 'Guide organizations through complex change', hours: 10 },
      ],
    },
  ],
};

// Mock reviews - these don't exist in database yet
const mockReviews: Record<number, Review[]> = {
  1: [ // UX/UI Designer reviews
    {
      id: 'r1',
      author: 'Tinnapat Takananan',
      rating: 3,
      date: '28/12/25',
      comment: 'Hello world we need Designer here dont report me pls ครับ',
      likes: 15,
      replies: [
        {
          id: 'r1-1',
          author: 'Tinnapat Takananan',
          rating: 4,
          date: '28/11/25',
          comment: '@Tinnapat Takananan Hello world we need Designer here dont report me pls ครับKKKDASSSSSSSSSSSSSS Hello world we need Designer here dont report me pls ครับ',
          likes: 14,
        },
        {
          id: 'r1-2',
          author: 'Tinnapat Takananan',
          rating: 4,
          date: '28/11/25',
          comment: 'Hello world we need Designer here dont report me pls ครับ',
          likes: 12,
        },
      ],
    },
    {
      id: 'r2',
      author: 'Tinnapat Takananan',
      rating: 4,
      date: '28/11/25',
      comment: 'Hello world we need Designer here dont report me pls ครับ',
      likes: 14,
    },
    {
      id: 'r3',
      author: 'Tinnapat Takananan',
      rating: 5,
      date: '20/11/25',
      comment: 'Hello world we need Designer here dont report me pls ครับ',
      likes: 12,
    },
    {
      id: 'r4',
      author: 'Tinnapat Takananan',
      rating: 5,
      date: '15/10/25',
      comment: 'Great career path! Highly recommended for creative people.',
      likes: 20,
    },
  ],
  2: [ // Data Scientist reviews
    { id: 'ds-r1', author: 'Somchai K.', rating: 5, date: '10/01/26', comment: 'Data science is the future! Great salary and growth.', likes: 22 },
    { id: 'ds-r2', author: 'Ploy S.', rating: 4, date: '05/12/25', comment: 'Challenging but rewarding career. Needs strong math background.', likes: 18 },
    { id: 'ds-r3', author: 'Natt W.', rating: 5, date: '20/11/25', comment: 'Best decision I made switching to data science.', likes: 15 },
  ],
  3: [ // Project Manager reviews
    { id: 'pm-r1', author: 'Somyot V.', rating: 5, date: '12/01/26', comment: 'Great leadership opportunity and competitive salary.', likes: 21 },
    { id: 'pm-r2', author: 'Niran D.', rating: 4, date: '08/12/25', comment: 'Demanding role but very rewarding for career growth.', likes: 16 },
  ],
};

// Initialize careers from database
export let careers: Career[] = [];

// Default empty careers for initial state
export const careersMockBase: Career[] = [];

// Function to fetch and merge Supabase data into careers
export async function initializeCareers(): Promise<Career[]> {
  const supabaseData = await fetchCareerDataFromSupabase();
  console.log('[initializeCareers] Fetched database careers:', supabaseData.length);
  
  careers = supabaseData.map((supabaseCareer) => {
    const careerId = supabaseCareer.career_id;
    // We no longer use mock reviews or mock learning paths
    const mockPath: any[] = [];
    const mockRevs: any[] = [];
    
    // Map growth_rate number to string value
    const growthRate = mapGrowthRate(supabaseCareer.growth_rate);
    
    // Parse required skills
    const requiredSkills = parseRequiredSkills(supabaseCareer.required_skills);
    
    return {
      id: careerId,
      title: supabaseCareer.title || '',
      image: supabaseCareer.image_url || careerTech,
      track: supabaseCareer.industry || 'Technology',
      description: supabaseCareer.description || '',
      salaryMin: supabaseCareer.min_salary || 0,
      salaryMax: supabaseCareer.max_salary || 0,
      growthRate,
      keyResponsibilities: supabaseCareer.responsibilities || [],
      requiredSkills,
      learningPath: mockPath,
      reviews: mockRevs,
    } as Career;
  });
  
  console.log('[initializeCareers] Merged careers:', careers.length);
  return careers;
}

// Initialize careers on module load
initializeCareers().catch((error) => console.error('Failed to initialize careers:', error));
