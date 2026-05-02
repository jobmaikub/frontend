// src/components/news/mockData.ts

export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  source: string;
  date: string;
  imageUrl: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    category: "Technology",
    title: "Tech Industry Sees 15% Growth in Q4 2025",
    description: "The technology sector continues to expand with increasing demand for skilled professionals in AI and cloud computing.",
    source: "Tech News",
    date: "29/12/2025",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "2",
    category: "Technology",
    title: "Remote Work Reshapes Career Landscape",
    description: "More companies adopting hybrid models, creating new opportunities for global talent and flexible work arrangements.",
    source: "Career Insider",
    date: "14/12/2025",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "3",
    category: "Technology",
    title: "AI Skills Most In-Demand for 2025",
    description: "Machine learning and AI expertise tops the list of sought-after skills according to industry surveys.",
    source: "Job Market Report",
    date: "12/12/2025",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "4",
    category: "Marketing",
    title: "Digital Marketing Evolves with AI Tools",
    description: "New AI-powered marketing tools are transforming how businesses reach and engage customers.",
    source: "Marketing Weekly",
    date: "25/11/2025",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "5",
    category: "Technology",
    title: "Cloud Computing Skills Employers Want in 2025",
    description: "Demand for cloud platforms like AWS, Azure, and Google Cloud continues to rise as companies scale digital infrastructure.",
    source: "Tech News",
    date: "22/11/2025",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "6",
    category: "Marketing",
    title: "Fresh Graduates Struggle With Skill Gaps",
    description: "Employers report that many graduates lack practical experience, increasing demand for internships and project-based learning.",
    source: "Career Insider",
    date: "17/11/2025",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500"
  }
];

export const industries = ["All Industries", "Technology", "Marketing", "Design & Creative", "Education", "Health"];