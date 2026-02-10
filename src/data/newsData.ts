export interface NewsItem {
  id: number;
  image: string;
  title: string;
  industry: string;
  source: string;
  date: string; // Added date property
}

export const newsData: NewsItem[] = [
  { id: 1, image: "/placeholder.svg", title: "Tech Industry Sees 15% Growth in Q4 2025", industry: "Technology", source: "Tech News", date: "2025-12-15" },
  { id: 2, image: "/placeholder.svg", title: "Remote Work Reshapes Career Landscape", industry: "Technology", source: "Career Insider", date: "2025-12-10" },
  { id: 3, image: "/placeholder.svg", title: "AI Skills Most In-Demand for 2025", industry: "Technology", source: "Job Market Report", date: "2025-12-05" },
  { id: 4, image: "/placeholder.svg", title: "Digital Marketing Evolves with AI Tools", industry: "Marketing", source: "Marketing Weekly", date: "2025-11-28" },
  { id: 5, image: "/placeholder.svg", title: "Cloud Computing Skills Employers Want in 2025", industry: "Technology", source: "Tech News", date: "2025-11-20" },
  { id: 6, image: "/placeholder.svg", title: "Fresh Graduates Struggle With Skill Gaps", industry: "Marketing", source: "Career Insider", date: "2025-11-15" },
  { id: 7, image: "/placeholder.svg", title: "AI Literacy Becomes a Core Workplace Skill", industry: "Technology", source: "Job Market Report", date: "2025-11-01" },
  { id: 8, image: "/placeholder.svg", title: "UX Designers in High Demand Across Industries", industry: "Design & Creative", source: "Design Weekly", date: "2025-10-25" },
  { id: 9, image: "/placeholder.svg", title: "Social Media Strategy Skills Boost Hiring Chances", industry: "Marketing", source: "Marketing Weekly", date: "2025-10-18" },
  { id: 10, image: "/placeholder.svg", title: "Short Courses Gain Popularity Among Job Seekers", industry: "Education", source: "Education Today", date: "2025-10-10" },
  { id: 11, image: "/placeholder.svg", title: "Universities Shift Focus to Job-Ready Skills", industry: "Education", source: "Education Today", date: "2025-10-05" },
  { id: 12, image: "/placeholder.svg", title: "Healthcare Careers See Steady Growth in 2026", industry: "Health", source: "Health Report", date: "2025-09-30" },
];