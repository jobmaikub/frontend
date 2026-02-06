export interface Career {
  id: number;
  title: string;
  industry: string;
  minSalary: number;
  growth: "High" | "Medium" | "Stable";
  image: string;
}

export const careersData: Career[] = [
  {
    id: 1,
    title: "UX Designer",
    industry: "Technology",
    minSalary: 45000,
    growth: "High",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Data Scientist",
    industry: "Technology",
    minSalary: 60000,
    growth: "High",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Product Manager",
    industry: "Technology",
    minSalary: 70000,
    growth: "Medium",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Software Engineer",
    industry: "Technology",
    minSalary: 50000,
    growth: "High",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Digital Marketing Specialist",
    industry: "Technology",
    minSalary: 35000,
    growth: "Stable",
    image: "/placeholder.svg",
  },
];
