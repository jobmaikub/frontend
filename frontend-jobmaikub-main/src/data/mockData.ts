import careerTech from '@/assets/career-tech.jpg';
import careerData from '@/assets/career-data.jpg';
import careerBusiness from '@/assets/career-business.jpg';
import careerHealth from '@/assets/career-health.jpg';
import careerCreative from '@/assets/career-creative.jpg';
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
  author: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  replies?: Review[];
}

export interface Career {
  id: string;
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

interface SupabaseCareer {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  responsibilities: string[];
}

async function fetchCareersFromSupabase(): Promise<SupabaseCareer[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/careers`);
    
    if (!response.ok) {
      console.warn('Failed to fetch careers from Supabase, using mock data');
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Error fetching careers from Supabase:', error);
    return [];
  }
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

export function getCareerStats(career: Career) {
  const totalCourses = career.learningPath.reduce((sum, level) => sum + level.courses.length, 0);
  const totalHours = career.learningPath.reduce(
    (sum, level) => sum + level.courses.reduce((s, c) => s + c.hours, 0),
    0
  );
  return { totalCourses, totalHours };
}

// Fetch Supabase career data
async function fetchCareerDataFromSupabase(): Promise<Map<string, { title: string; description: string; keyResponsibilities: string[]; requiredSkills: RequiredSkill[] }>> {
  const dataMap = new Map<string, { title: string; description: string; keyResponsibilities: string[]; requiredSkills: RequiredSkill[] }>();
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    console.log('[Supabase] Fetching from:', `${apiUrl}/home/all-careers`);
    const response = await fetch(`${apiUrl}/home/all-careers`);
    console.log('[Supabase] Response status:', response.status, response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[Supabase] Received data:', data);
      if (Array.isArray(data)) {
        data.forEach((career: Record<string, unknown>, index: number) => {
          // Use index as key (0-based) to match careersMockBase ordering
          console.log('[Supabase] Processing career:', index, career.title);
          
          // Parse required_skills from JSON strings
          let parsedSkills: RequiredSkill[] = [];
          if (Array.isArray(career.required_skills)) {
            parsedSkills = career.required_skills
              .map((skill: unknown) => {
                // If it's a JSON string, parse it
                if (typeof skill === 'string') {
                  try {
                    const parsed = JSON.parse(skill);
                    return {
                      name: parsed.name || '',
                      type: parsed.type as 'Soft' | 'Technical' | 'Analytical'
                    };
                  } catch (e) {
                    // If parse fails, treat as plain string
                    return { name: skill, type: 'Soft' as const };
                  }
                }
                // If it's an object, use directly
                return {
                  name: (skill as any).name || '',
                  type: (skill as any).type as 'Soft' | 'Technical' | 'Analytical'
                };
              });
          }
          
          dataMap.set(String(index), {
            title: (career.title as string) || '',
            description: (career.description as string) || '',
            keyResponsibilities: Array.isArray(career.responsibilities) ? (career.responsibilities as string[]) : [],
            requiredSkills: parsedSkills
          });
        });
      }
    } else {
      console.warn('[Supabase] Response not ok:', response.status);
    }
  } catch (error) {
    console.warn('[Supabase] Failed to fetch careers data:', error);
  }
  
  console.log('[Supabase] Final map size:', dataMap.size);
  return dataMap;
}

// Base mock careers data structure
export const careersMockBase = [
  {
    id: 'ux-ui-designer',
    image: careerTech,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 45,
    salaryMax: 120,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
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
    reviews: [
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
  },
  {
    id: 'data-scientists',
    image: careerData,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 60,
    salaryMax: 180,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
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
    reviews: [
      { id: 'ds-r1', author: 'Somchai K.', rating: 5, date: '10/01/26', comment: 'Data science is the future! Great salary and growth.', likes: 22 },
      { id: 'ds-r2', author: 'Ploy S.', rating: 4, date: '05/12/25', comment: 'Challenging but rewarding career. Needs strong math background.', likes: 18 },
      { id: 'ds-r3', author: 'Natt W.', rating: 5, date: '20/11/25', comment: 'Best decision I made switching to data science.', likes: 15 },
    ],
  },
  {
    id: 'project-manager',
    image: careerBusiness,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 70,
    salaryMax: 200,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
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
          { name: 'Portfolio Management', description: 'Manage multiple projects and program portfolios', hours: 12 },
          { name: 'Strategic Planning', description: 'Align projects with organizational strategy and goals', hours: 10 },
          { name: 'Change Management', description: 'Lead organizational change and transformation initiatives', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'pm-r1', author: 'Krit M.', rating: 5, date: '15/01/26', comment: 'Great career for people who love organizing and leading teams.', likes: 25 },
      { id: 'pm-r2', author: 'Aom P.', rating: 4, date: '01/12/25', comment: 'High demand in Thailand market, especially in tech companies.', likes: 17 },
    ],
  },
  {
    id: 'software-engineering',
    image: careerTech,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 50,
    salaryMax: 150,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Programming Fundamentals', description: 'Learn core programming concepts with JavaScript or Python', hours: 15 },
          { name: 'Web Development Basics', description: 'HTML, CSS, and modern web development fundamentals', hours: 12 },
          { name: 'Git & Version Control', description: 'Master version control with Git and GitHub workflows', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Data Structures & Algorithms', description: 'Essential algorithms and data structures for efficient code', hours: 20 },
          { name: 'API Development', description: 'Build RESTful and GraphQL APIs with modern frameworks', hours: 12 },
          { name: 'Database Design', description: 'Design relational and NoSQL databases for applications', hours: 10 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'System Architecture', description: 'Design scalable, distributed systems and microservices', hours: 15 },
          { name: 'Cloud Services & DevOps', description: 'Deploy and manage applications on cloud platforms', hours: 12 },
          { name: 'Security Best Practices', description: 'Implement secure coding practices and vulnerability prevention', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'se-r1', author: 'Bank T.', rating: 5, date: '20/01/26', comment: 'Software engineering offers endless possibilities. Love it!', likes: 30 },
      { id: 'se-r2', author: 'Fern N.', rating: 4, date: '10/12/25', comment: 'High salary but need to keep learning new technologies.', likes: 22 },
      { id: 'se-r3', author: 'Top K.', rating: 5, date: '05/11/25', comment: 'Best career choice for tech enthusiasts.', likes: 18 },
    ],
  },
  {
    id: 'digital-marketing-specialist',
    image: careerBusiness,
    track: 'Marketing',
    title: '',
    description: '',
    salaryMin: 35,
    salaryMax: 80,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Digital Marketing Fundamentals', description: 'Overview of digital marketing channels and strategies', hours: 8 },
          { name: 'Social Media Marketing', description: 'Build and manage social media presence effectively', hours: 6 },
          { name: 'Content Strategy Basics', description: 'Create compelling content that drives engagement', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'SEO & SEM Mastery', description: 'Optimize search engine visibility and paid campaigns', hours: 12 },
          { name: 'Google Analytics', description: 'Track, measure, and analyze digital marketing performance', hours: 8 },
          { name: 'Email Marketing', description: 'Design effective email campaigns and automation flows', hours: 6 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Marketing Automation', description: 'Implement marketing automation platforms and workflows', hours: 10 },
          { name: 'Growth Hacking', description: 'Apply data-driven growth strategies for rapid scaling', hours: 8 },
          { name: 'Advanced Analytics & Attribution', description: 'Multi-channel attribution and advanced data analysis', hours: 10 },
        ],
      },
    ],
    reviews: [
      { id: 'dm-r1', author: 'Pim A.', rating: 4, date: '12/01/26', comment: 'Creative and dynamic career. Always something new to learn.', likes: 12 },
      { id: 'dm-r2', author: 'Ohm S.', rating: 4, date: '25/11/25', comment: 'Good entry-level salary with room for growth.', likes: 9 },
    ],
  },
  {
    id: 'influencer-strategy-manager',
    image: careerBusiness,
    track: 'Marketing',
    title: '',
    description: '',
    salaryMin: 45,
    salaryMax: 110,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Influencer Marketing 101', description: 'Fundamentals of influencer marketing and partnerships', hours: 6 },
          { name: 'Social Media Platforms Deep Dive', description: 'Understanding each platform from TikTok to LinkedIn', hours: 8 },
          { name: 'Brand Partnership Basics', description: 'How to create mutually beneficial brand collaborations', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Campaign Management', description: 'Plan, execute, and manage influencer campaigns end-to-end', hours: 10 },
          { name: 'Contract Negotiation', description: 'Negotiate fair and effective influencer contracts', hours: 6 },
          { name: 'Performance Analytics', description: 'Measure and optimize influencer campaign performance', hours: 8 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Global Influencer Strategy', description: 'Scale influencer programs across international markets', hours: 10 },
          { name: 'Crisis Management', description: 'Handle PR crises and influencer controversies', hours: 6 },
          { name: 'Ambassador Program Design', description: 'Build long-term brand ambassador programs', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'im-r1', author: 'Mint P.', rating: 5, date: '08/01/26', comment: 'Super fun career if you love social media and people!', likes: 16 },
      { id: 'im-r2', author: 'Beam L.', rating: 4, date: '18/12/25', comment: 'Rapidly growing field with lots of opportunities.', likes: 11 },
    ],
  },
  {
    id: 'performance-marketer',
    image: careerBusiness,
    track: 'Marketing',
    title: '',
    description: '',
    salaryMin: 45,
    salaryMax: 110,
    growthRate: 'stable',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Paid Advertising Basics', description: 'Introduction to Facebook, Google, and TikTok ads', hours: 8 },
          { name: 'Conversion Tracking Setup', description: 'Implement tracking pixels and conversion events', hours: 6 },
          { name: 'Ad Creative Fundamentals', description: 'Create compelling ad copy and visual assets', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Advanced Campaign Optimization', description: 'Optimize bidding strategies and audience targeting', hours: 10 },
          { name: 'Landing Page Optimization', description: 'Design and test high-converting landing pages', hours: 8 },
          { name: 'Marketing Attribution Models', description: 'Understand multi-touch attribution for accurate reporting', hours: 8 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Predictive Analytics for Marketing', description: 'Use ML models to predict campaign performance', hours: 12 },
          { name: 'Cross-Channel Strategy', description: 'Orchestrate campaigns across multiple platforms', hours: 8 },
          { name: 'Marketing Mix Modeling', description: 'Advanced statistical modeling for budget allocation', hours: 10 },
        ],
      },
    ],
    reviews: [
      { id: 'pf-r1', author: 'Golf A.', rating: 4, date: '05/01/26', comment: 'Numbers-driven career. Perfect for analytical minds.', likes: 13 },
      { id: 'pf-r2', author: 'Dao N.', rating: 3, date: '15/11/25', comment: 'High pressure but rewarding when campaigns perform well.', likes: 8 },
    ],
  },
  {
    id: 'registered-nurse',
    image: careerHealth,
    track: 'Health',
    title: '',
    description: '',
    salaryMin: 65,
    salaryMax: 140,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Nursing Fundamentals', description: 'Core nursing concepts and patient care basics', hours: 20 },
          { name: 'Anatomy & Physiology', description: 'Understanding the human body systems', hours: 15 },
          { name: 'Pharmacology Basics', description: 'Introduction to medications and drug administration', hours: 12 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Clinical Practice', description: 'Hands-on clinical skills in hospital settings', hours: 30 },
          { name: 'Emergency Care', description: 'Emergency response and critical care protocols', hours: 15 },
          { name: 'Patient Assessment', description: 'Advanced patient assessment and diagnostic techniques', hours: 12 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Specialized Nursing', description: 'Advanced specialization in chosen nursing field', hours: 20 },
          { name: 'Healthcare Leadership', description: 'Lead nursing teams and manage healthcare units', hours: 10 },
          { name: 'Evidence-Based Practice', description: 'Apply research evidence to improve patient outcomes', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'rn-r1', author: 'Nan S.', rating: 5, date: '18/01/26', comment: 'Fulfilling career helping people every day. Highly recommended!', likes: 28 },
      { id: 'rn-r2', author: 'Joy P.', rating: 4, date: '02/12/25', comment: 'Demanding but very rewarding. Great job security.', likes: 19 },
    ],
  },
  {
    id: 'occupational-therapist',
    image: careerHealth,
    track: 'Health',
    title: '',
    description: '',
    salaryMin: 60,
    salaryMax: 135,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'OT Foundations', description: 'Introduction to occupational therapy principles and ethics', hours: 12 },
          { name: 'Human Development', description: 'Understanding developmental stages across the lifespan', hours: 10 },
          { name: 'Activity Analysis', description: 'Breaking down activities for therapeutic intervention', hours: 8 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Clinical Interventions', description: 'Evidence-based therapeutic intervention techniques', hours: 15 },
          { name: 'Assistive Technology', description: 'Evaluate and recommend assistive devices', hours: 8 },
          { name: 'Pediatric OT', description: 'Specialized therapy for children and adolescents', hours: 12 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Neuro Rehabilitation', description: 'Advanced neurological rehabilitation techniques', hours: 12 },
          { name: 'OT Management', description: 'Manage OT departments and clinical programs', hours: 8 },
          { name: 'Research Methods in OT', description: 'Conduct research to advance OT practice', hours: 10 },
        ],
      },
    ],
    reviews: [
      { id: 'ot-r1', author: 'May K.', rating: 5, date: '22/01/26', comment: 'One of the most meaningful careers in healthcare.', likes: 15 },
      { id: 'ot-r2', author: 'Ton B.', rating: 4, date: '08/12/25', comment: 'Growing demand especially in rehabilitation centers.', likes: 10 },
    ],
  },
  {
    id: 'psychiatrist',
    image: careerHealth,
    track: 'Health',
    title: '',
    description: '',
    salaryMin: 120,
    salaryMax: 250,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Psychology Fundamentals', description: 'Core concepts in human psychology and behavior', hours: 15 },
          { name: 'Neuroscience Basics', description: 'Understanding brain function and mental health', hours: 12 },
          { name: 'Clinical Interview Skills', description: 'Conduct effective psychiatric interviews', hours: 8 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Psychopharmacology', description: 'Psychiatric medication management and interactions', hours: 15 },
          { name: 'Cognitive Behavioral Therapy', description: 'CBT techniques for various mental health conditions', hours: 12 },
          { name: 'Diagnostic Assessment', description: 'Advanced psychiatric diagnostic methods and tools', hours: 10 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Specialized Psychiatry', description: 'Advanced specialization in chosen psychiatric area', hours: 15 },
          { name: 'Psychiatric Research', description: 'Conduct and publish psychiatric research', hours: 10 },
          { name: 'Mental Health Policy', description: 'Shape mental health policy and advocacy', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'ps-r1', author: 'Dr. Wit C.', rating: 5, date: '10/01/26', comment: 'Extremely rewarding career. Mental health awareness is growing.', likes: 20 },
      { id: 'ps-r2', author: 'Patt S.', rating: 4, date: '20/12/25', comment: 'Long education path but one of the highest-paying medical fields.', likes: 14 },
    ],
  },
  {
    id: '3d-designer-3d-artist',
    image: careerCreative,
    track: 'Design & Creative',
    title: '',
    description: '',
    salaryMin: 80,
    salaryMax: 180,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: '3D Modeling Basics', description: 'Introduction to Blender or Maya for beginners', hours: 15 },
          { name: 'Digital Art Fundamentals', description: 'Color theory, composition, and digital art basics', hours: 10 },
          { name: 'Texturing & Materials', description: 'Create realistic textures and material properties', hours: 8 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Character Modeling', description: 'Create detailed character models for games and film', hours: 20 },
          { name: 'Environment Design', description: 'Build immersive 3D environments and scenes', hours: 15 },
          { name: 'Animation Fundamentals', description: 'Bring 3D models to life with animation', hours: 12 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Advanced Rendering', description: 'Master photo-realistic rendering techniques', hours: 12 },
          { name: 'Real-Time 3D (Unreal/Unity)', description: 'Create interactive 3D experiences for games', hours: 15 },
          { name: 'VFX & Motion Graphics', description: 'Advanced visual effects and motion design', hours: 10 },
        ],
      },
    ],
    reviews: [
      { id: '3d-r1', author: 'Art P.', rating: 5, date: '15/01/26', comment: 'Amazing creative career with growing demand in gaming!', likes: 17 },
      { id: '3d-r2', author: 'Film K.', rating: 4, date: '28/11/25', comment: 'Need strong portfolio but opportunities are expanding.', likes: 12 },
    ],
  },
  {
    id: 'visual-designer',
    image: careerCreative,
    track: 'Design & Creative',
    title: '',
    description: '',
    salaryMin: 30,
    salaryMax: 150,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Graphic Design Basics', description: 'Fundamentals of layout, typography, and composition', hours: 10 },
          { name: 'Adobe Creative Suite', description: 'Master Photoshop, Illustrator, and InDesign', hours: 12 },
          { name: 'Color Theory & Application', description: 'Understanding color psychology and combinations', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Brand Identity Design', description: 'Create comprehensive brand identity systems', hours: 12 },
          { name: 'Motion Graphics', description: 'Add motion to designs with After Effects', hours: 10 },
          { name: 'Web & Mobile Design', description: 'Design responsive layouts for digital platforms', hours: 10 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Creative Direction', description: 'Lead creative teams and establish visual direction', hours: 10 },
          { name: 'Design Thinking for Business', description: 'Apply design thinking to solve business problems', hours: 8 },
          { name: 'Portfolio & Personal Brand', description: 'Build a standout portfolio and personal brand', hours: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'vd-r1', author: 'Eye T.', rating: 4, date: '12/01/26', comment: 'Creative and fulfilling career with good work-life balance.', likes: 14 },
      { id: 'vd-r2', author: 'Bow S.', rating: 5, date: '05/12/25', comment: 'Wide range of industries need visual designers!', likes: 11 },
    ],
  },
  {
    id: 'brand-designer',
    image: careerCreative,
    track: 'Design & Creative',
    title: '',
    description: '',
    salaryMin: 55,
    salaryMax: 140,
    growthRate: 'stable',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Brand Design Fundamentals', description: 'Introduction to branding concepts and visual identity', hours: 8 },
          { name: 'Logo Design Basics', description: 'Principles of effective logo design', hours: 10 },
          { name: 'Typography for Branding', description: 'Choose and pair fonts for brand identity', hours: 6 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Brand Strategy', description: 'Develop brand positioning and messaging frameworks', hours: 10 },
          { name: 'Packaging Design', description: 'Create compelling product packaging designs', hours: 8 },
          { name: 'Brand Guidelines', description: 'Build comprehensive brand style guides', hours: 8 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Rebranding Strategies', description: 'Lead successful rebranding initiatives', hours: 10 },
          { name: 'Brand Experience Design', description: 'Design holistic brand experiences across touchpoints', hours: 8 },
          { name: 'Brand Management', description: 'Manage and evolve brands over time', hours: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'bd-r1', author: 'Palm C.', rating: 4, date: '08/01/26', comment: 'Love building brands from scratch. Very creative work!', likes: 13 },
      { id: 'bd-r2', author: 'Jib W.', rating: 5, date: '22/12/25', comment: 'High demand for skilled brand designers in startups.', likes: 10 },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    image: careerTech,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 60,
    salaryMax: 180,
    growthRate: 'high',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'Cybersecurity Fundamentals', description: 'Core concepts of information security', hours: 10 },
          { name: 'Networking Basics', description: 'Understanding network protocols and architecture', hours: 12 },
          { name: 'Linux Essentials', description: 'Linux command line and system administration', hours: 8 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Ethical Hacking', description: 'Penetration testing techniques and methodologies', hours: 15 },
          { name: 'Security Operations', description: 'SIEM tools and security monitoring best practices', hours: 10 },
          { name: 'Incident Response', description: 'Handle security incidents and forensic investigation', hours: 12 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Advanced Threat Hunting', description: 'Proactively identify and neutralize advanced threats', hours: 12 },
          { name: 'Cloud Security', description: 'Secure cloud infrastructure and applications', hours: 10 },
          { name: 'Security Architecture', description: 'Design enterprise-grade security architectures', hours: 12 },
        ],
      },
    ],
    reviews: [
      { id: 'cs-r1', author: 'Net P.', rating: 5, date: '20/01/26', comment: 'Cybersecurity is the hottest field right now. Amazing salary!', likes: 25 },
      { id: 'cs-r2', author: 'Shield K.', rating: 5, date: '10/12/25', comment: 'Never boring—new challenges every day.', likes: 20 },
    ],
  },
  {
    id: 'devops-engineer',
    image: careerTech,
    track: 'Technology',
    title: '',
    description: '',
    salaryMin: 60,
    salaryMax: 210,
    growthRate: 'medium',
    keyResponsibilities: [],
    requiredSkills: [],
    learningPath: [
      {
        level: 'Beginner',
        courses: [
          { name: 'DevOps Fundamentals', description: 'Core DevOps concepts, culture, and practices', hours: 8 },
          { name: 'Linux Administration', description: 'Essential Linux skills for DevOps engineers', hours: 12 },
          { name: 'Docker & Containers', description: 'Containerize applications with Docker', hours: 10 },
        ],
      },
      {
        level: 'Intermediate',
        courses: [
          { name: 'Kubernetes Orchestration', description: 'Manage containerized applications with Kubernetes', hours: 15 },
          { name: 'CI/CD Pipeline Design', description: 'Build automated build and deployment pipelines', hours: 12 },
          { name: 'Infrastructure as Code', description: 'Manage infrastructure with Terraform and Ansible', hours: 10 },
        ],
      },
      {
        level: 'Advanced',
        courses: [
          { name: 'Site Reliability Engineering', description: 'SRE practices for high-availability systems', hours: 12 },
          { name: 'Cloud Architecture', description: 'Design multi-cloud and hybrid architectures', hours: 12 },
          { name: 'Security in DevOps', description: 'Integrate security into DevOps workflows (DevSecOps)', hours: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'do-r1', author: 'Ops T.', rating: 4, date: '15/01/26', comment: 'High demand and great salary. Automation is the future!', likes: 18 },
      { id: 'do-r2', author: 'Cloud S.', rating: 5, date: '28/12/25', comment: 'Love solving infrastructure challenges at scale.', likes: 15 },
    ],
  },
];

// Initialize and export careers with Supabase data
export let careers: Career[] = careersMockBase.map((baseCareers) => ({
  ...baseCareers,
  growthRate: baseCareers.growthRate as 'stable' | 'medium' | 'high',
  title: baseCareers.title || '',
  description: baseCareers.description || '',
  keyResponsibilities: baseCareers.keyResponsibilities || [],
  requiredSkills: baseCareers.requiredSkills || [],
} as Career));

// Function to fetch and merge Supabase data into careers
export async function initializeCareers(): Promise<Career[]> {
  const supabaseData = await fetchCareerDataFromSupabase();
  
  careers = careersMockBase.map((baseCareers, index) => {
    // Match by index since both arrays are ordered
    const data = supabaseData.get(String(index));
    const growthRate = (baseCareers.growthRate as 'stable' | 'medium' | 'high');
    return {
      ...baseCareers,
      growthRate,
      title: data?.title || baseCareers.title || '',
      description: data?.description || baseCareers.description || '',
      keyResponsibilities: data?.keyResponsibilities || baseCareers.keyResponsibilities || [],
      requiredSkills: data?.requiredSkills || baseCareers.requiredSkills || [],
    } as Career;
  });
  
  return careers;
}

// Initialize careers on module load
initializeCareers().catch((error) => console.error('Failed to initialize careers:', error));
