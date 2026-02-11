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

export const careers: Career[] = [
  {
    id: 'ux-ui-designer',
    title: 'UX/UI Designer',
    image: careerTech,
    track: 'Technology',
    description:
      'Create intuitive and engaging user experiences for digital products. UX Designers research user needs, create wireframes and prototypes, and work closely with development teams to bring designs to life.',
    salaryMin: 45,
    salaryMax: 120,
    growthRate: 'high',
    keyResponsibilities: [
      'Conduct user research and usability testing',
      'Create wireframes and interactive prototypes',
      'Design intuitive user interfaces',
      'Collaborate with developers and stakeholders',
      'Iterate based on feedback and data',
      'Develop and maintain design systems',
      'Create user journey maps and personas',
    ],
    requiredSkills: [
      { name: 'Communication', type: 'Soft' },
      { name: 'Problem Solving', type: 'Analytical' },
      { name: 'Technical Proficiency', type: 'Technical' },
      { name: 'Team Collaboration', type: 'Soft' },
    ],
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
    title: 'Data Scientists',
    image: careerData,
    track: 'Technology',
    description:
      'Analyze complex data sets to help organizations make better decisions. Data Scientists use statistical methods, machine learning, and programming to extract insights from large datasets.',
    salaryMin: 60,
    salaryMax: 180,
    growthRate: 'high',
    keyResponsibilities: [
      'Collect, clean, and preprocess large datasets',
      'Build predictive models using machine learning algorithms',
      'Create data visualizations and dashboards',
      'Communicate findings to non-technical stakeholders',
      'Collaborate with engineering teams on data pipelines',
      'Research and implement new analytical methods',
    ],
    requiredSkills: [
      { name: 'Python Programming', type: 'Technical' },
      { name: 'Statistical Analysis', type: 'Analytical' },
      { name: 'Machine Learning', type: 'Technical' },
      { name: 'Data Visualization', type: 'Analytical' },
    ],
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
    title: 'Project Manager',
    image: careerBusiness,
    track: 'Technology',
    description:
      'Lead the development of products from concept to launch. Product Managers work cross-functionally to define product vision, prioritize features, and ensure successful delivery.',
    salaryMin: 70,
    salaryMax: 200,
    growthRate: 'high',
    keyResponsibilities: [
      'Define project scope, timeline, and deliverables',
      'Coordinate cross-functional teams and resources',
      'Manage project budgets and risk assessment',
      'Facilitate agile ceremonies and sprint planning',
      'Report progress to senior stakeholders',
      'Identify and resolve project blockers',
    ],
    requiredSkills: [
      { name: 'Leadership', type: 'Soft' },
      { name: 'Agile Methodology', type: 'Technical' },
      { name: 'Risk Analysis', type: 'Analytical' },
      { name: 'Stakeholder Management', type: 'Soft' },
    ],
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
    title: 'Software Engineering',
    image: careerTech,
    track: 'Technology',
    description:
      'Design, develop, and maintain software applications. Software Engineers write clean, efficient code and collaborate with teams to build scalable systems.',
    salaryMin: 50,
    salaryMax: 150,
    growthRate: 'high',
    keyResponsibilities: [
      'Write clean, maintainable, and efficient code',
      'Design software architecture and system components',
      'Participate in code reviews and quality assurance',
      'Debug and resolve software defects',
      'Collaborate with product and design teams',
      'Implement automated testing and CI/CD pipelines',
    ],
    requiredSkills: [
      { name: 'Programming Languages', type: 'Technical' },
      { name: 'System Design', type: 'Technical' },
      { name: 'Problem Solving', type: 'Analytical' },
      { name: 'Version Control', type: 'Technical' },
    ],
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
    title: 'Digital Marketing Specialist',
    image: careerBusiness,
    track: 'Marketing',
    description:
      'Plan and execute digital marketing campaigns across various channels. Digital Marketing Specialists analyze data to optimize marketing strategies and drive business growth.',
    salaryMin: 35,
    salaryMax: 80,
    growthRate: 'medium',
    keyResponsibilities: [
      'Develop and execute digital marketing strategies',
      'Manage social media accounts and content calendars',
      'Analyze campaign performance with analytics tools',
      'Optimize SEO and SEM campaigns for maximum ROI',
      'Create engaging content for multiple platforms',
    ],
    requiredSkills: [
      { name: 'Content Creation', type: 'Soft' },
      { name: 'Analytics', type: 'Analytical' },
      { name: 'SEO/SEM', type: 'Technical' },
      { name: 'Social Media', type: 'Technical' },
    ],
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
    title: 'Influencer Strategy Manager',
    image: careerBusiness,
    track: 'Marketing',
    description:
      'Develop influencer marketing plans across all tiers—from Mega to Nano. Influencer Strategy Managers build relationships, negotiate contracts, and measure campaign impact.',
    salaryMin: 45,
    salaryMax: 110,
    growthRate: 'medium',
    keyResponsibilities: [
      'Identify and recruit influencers aligned with brand values',
      'Develop influencer campaign strategies and briefs',
      'Negotiate contracts and manage partnerships',
      'Track campaign performance and ROI metrics',
      'Stay current with social media trends and platforms',
    ],
    requiredSkills: [
      { name: 'Negotiation', type: 'Soft' },
      { name: 'Social Media Analytics', type: 'Analytical' },
      { name: 'Content Strategy', type: 'Technical' },
      { name: 'Relationship Building', type: 'Soft' },
    ],
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
    title: 'Performance Marketer',
    image: careerBusiness,
    track: 'Marketing',
    description:
      'Optimize ad spend using predictive analytics across TikTok, LINE, and other platforms. Performance Marketers focus on driving measurable results through data-driven campaigns.',
    salaryMin: 45,
    salaryMax: 110,
    growthRate: 'stable',
    keyResponsibilities: [
      'Manage paid advertising campaigns across platforms',
      'Optimize campaign budgets for maximum ROAS',
      'Conduct A/B testing on ad creatives and landing pages',
      'Analyze conversion funnels and user acquisition costs',
      'Report on campaign performance and insights',
    ],
    requiredSkills: [
      { name: 'Paid Media', type: 'Technical' },
      { name: 'Data Analysis', type: 'Analytical' },
      { name: 'A/B Testing', type: 'Analytical' },
      { name: 'Budget Management', type: 'Soft' },
    ],
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
    title: 'Registered Nurse',
    image: careerHealth,
    track: 'Health',
    description:
      'Provide ongoing patient care in hospitals, clinics, and community settings. Registered Nurses assess patient conditions, administer medications, and coordinate with healthcare teams.',
    salaryMin: 65,
    salaryMax: 140,
    growthRate: 'medium',
    keyResponsibilities: [
      'Assess patient health conditions and vital signs',
      'Administer medications and treatments',
      'Coordinate with doctors and healthcare specialists',
      'Educate patients on health management and prevention',
      'Maintain accurate patient medical records',
      'Respond to medical emergencies',
    ],
    requiredSkills: [
      { name: 'Patient Care', type: 'Soft' },
      { name: 'Clinical Assessment', type: 'Technical' },
      { name: 'Critical Thinking', type: 'Analytical' },
      { name: 'Communication', type: 'Soft' },
    ],
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
    title: 'Occupational Therapist',
    image: careerHealth,
    track: 'Health',
    description:
      'Assist patients in developing skills for daily living and work activities. Occupational Therapists evaluate patient needs and create personalized treatment plans.',
    salaryMin: 60,
    salaryMax: 135,
    growthRate: 'high',
    keyResponsibilities: [
      'Evaluate patients functional abilities and limitations',
      'Develop personalized treatment plans',
      'Guide patients through therapeutic exercises',
      'Recommend adaptive equipment and home modifications',
      'Document patient progress and outcomes',
    ],
    requiredSkills: [
      { name: 'Empathy', type: 'Soft' },
      { name: 'Assessment Skills', type: 'Analytical' },
      { name: 'Therapeutic Techniques', type: 'Technical' },
      { name: 'Patient Education', type: 'Soft' },
    ],
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
    title: 'Psychiatrist',
    image: careerHealth,
    track: 'Health',
    description:
      'Diagnose and treat mental health conditions. Psychiatrists combine medical knowledge with psychological understanding to help patients achieve mental wellness.',
    salaryMin: 120,
    salaryMax: 250,
    growthRate: 'medium',
    keyResponsibilities: [
      'Diagnose mental health disorders through clinical assessment',
      'Prescribe and manage psychiatric medications',
      'Provide psychotherapy and counseling sessions',
      'Develop comprehensive treatment plans',
      'Collaborate with multidisciplinary healthcare teams',
    ],
    requiredSkills: [
      { name: 'Clinical Diagnosis', type: 'Technical' },
      { name: 'Empathy & Listening', type: 'Soft' },
      { name: 'Pharmacology', type: 'Technical' },
      { name: 'Research Analysis', type: 'Analytical' },
    ],
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
    title: '3D Designer / 3D Artist',
    image: careerCreative,
    track: 'Design & Creative',
    description:
      'Create 3D models and visuals for games, ads, or product visualization. 3D Artists combine artistic skills with technical software knowledge to bring concepts to life.',
    salaryMin: 80,
    salaryMax: 180,
    growthRate: 'medium',
    keyResponsibilities: [
      'Create 3D models, textures, and animations',
      'Render high-quality visual assets for projects',
      'Collaborate with creative directors and art teams',
      'Optimize 3D assets for various platforms',
      'Stay updated with latest 3D software and techniques',
    ],
    requiredSkills: [
      { name: '3D Modeling', type: 'Technical' },
      { name: 'Artistic Vision', type: 'Soft' },
      { name: 'Texturing & Lighting', type: 'Technical' },
      { name: 'Attention to Detail', type: 'Analytical' },
    ],
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
    title: 'Visual Designer',
    image: careerCreative,
    track: 'Design & Creative',
    description:
      'Design cohesive visual systems across web, mobile, and marketing. Visual Designers create compelling graphics that communicate brand messages effectively.',
    salaryMin: 30,
    salaryMax: 150,
    growthRate: 'medium',
    keyResponsibilities: [
      'Create visual designs for digital and print media',
      'Develop brand visual identity systems',
      'Design marketing materials and campaigns',
      'Collaborate with UX designers and developers',
      'Maintain brand consistency across all touchpoints',
    ],
    requiredSkills: [
      { name: 'Visual Design', type: 'Technical' },
      { name: 'Brand Identity', type: 'Soft' },
      { name: 'Typography', type: 'Technical' },
      { name: 'Color Theory', type: 'Analytical' },
    ],
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
    title: 'Brand Designer',
    image: careerCreative,
    track: 'Design & Creative',
    description:
      'Develop brand identities, logos, and visual guidelines. Brand Designers create the visual foundation that shapes how audiences perceive and connect with brands.',
    salaryMin: 55,
    salaryMax: 140,
    growthRate: 'stable',
    keyResponsibilities: [
      'Design logos and brand identity elements',
      'Create comprehensive brand guidelines',
      'Design packaging and marketing collateral',
      'Conduct brand research and competitor analysis',
      'Ensure brand consistency across all media',
    ],
    requiredSkills: [
      { name: 'Brand Strategy', type: 'Analytical' },
      { name: 'Logo Design', type: 'Technical' },
      { name: 'Creative Thinking', type: 'Soft' },
      { name: 'Presentation Skills', type: 'Soft' },
    ],
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
    title: 'Cybersecurity Analyst',
    image: careerTech,
    track: 'Technology',
    description:
      'Protect systems, networks, and data from cyber threats and attacks. Cybersecurity Analysts monitor security infrastructure and respond to incidents.',
    salaryMin: 60,
    salaryMax: 180,
    growthRate: 'high',
    keyResponsibilities: [
      'Monitor network traffic for security threats',
      'Conduct vulnerability assessments and penetration testing',
      'Respond to and investigate security incidents',
      'Implement security policies and procedures',
      'Stay current with emerging cyber threats',
    ],
    requiredSkills: [
      { name: 'Network Security', type: 'Technical' },
      { name: 'Threat Analysis', type: 'Analytical' },
      { name: 'Incident Response', type: 'Technical' },
      { name: 'Communication', type: 'Soft' },
    ],
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
    title: 'DevOps Engineer',
    image: careerTech,
    track: 'Technology',
    description:
      'Automate deployments and improve CI/CD pipelines for faster delivery. DevOps Engineers bridge development and operations to ensure reliable software delivery.',
    salaryMin: 60,
    salaryMax: 210,
    growthRate: 'medium',
    keyResponsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure and deployments',
      'Automate repetitive tasks and processes',
      'Monitor system performance and reliability',
      'Collaborate with development teams on deployment strategies',
    ],
    requiredSkills: [
      { name: 'Cloud Platforms', type: 'Technical' },
      { name: 'Automation', type: 'Technical' },
      { name: 'Problem Solving', type: 'Analytical' },
      { name: 'Collaboration', type: 'Soft' },
    ],
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
