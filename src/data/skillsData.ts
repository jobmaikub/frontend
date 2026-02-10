export interface Skill {
  id: number;
  name: string;
  faculty: string;
  major: string;
}

export const skillsData: Skill[] = [
  { 
    id: 1, 
    name: "Python Programming", 
    faculty: "Engineering", 
    major: "Computer Science" 
  },
  { 
    id: 2, 
    name: "JavaScript", 
    faculty: "Engineering", 
    major: "Computer Science" 
  },
  { 
    id: 3, 
    name: "Data Analysis", 
    faculty: "Science", 
    major: "Statistics" 
  },
  { 
    id: 4, 
    name: "Communication", 
    faculty: "Arts", 
    major: "Communication Arts" 
  },
  { 
    id: 5, 
    name: "Leadership", 
    faculty: "Business", 
    major: "Management" 
  },
  { 
    id: 6, 
    name: "Problem Solving", 
    faculty: "Engineering", 
    major: "General Engineering" 
  },
  { 
    id: 7, 
    name: "Project Management", 
    faculty: "Business", 
    major: "Business Administration" 
  },
  { 
    id: 8, 
    name: "Machine Learning", 
    faculty: "Engineering", 
    major: "Computer Science" 
  },
  { 
    id: 9, 
    name: "UX/UI Design", 
    faculty: "Arts", 
    major: "Digital Media" 
  },
  { 
    id: 10, 
    name: "Digital Marketing", 
    faculty: "Business", 
    major: "Marketing" 
  },
];