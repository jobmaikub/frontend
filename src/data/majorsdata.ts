// export interface Major {
//   id: number;
//   name: string;
//   thaiName: string;
//   faculty: string;
// }
// export const majorsData: Major[] = [
//   { id: 1, name: "Computer Science", thaiName: "วิทยาการคอมพิวเตอร์", faculty: "Science" },
// { id: 2, name: "Software Engineering", thaiName: "วิศวกรรมซอฟต์แวร์", faculty: "Engineering" },
// { id: 3, name: "Data Science", thaiName: "วิทยาศาสตร์ข้อมูล", faculty: "Science" },
// { id: 4, name: "Marketing", thaiName: "การตลาด", faculty: "Business Administration" },
// { id: 5, name: "Graphic Design", thaiName: "การออกแบบกราฟฟิก", faculty: "Art & Humanities" },
// { id: 6, name: "Information Systems", thaiName: "ระบบสารสนเทศ", faculty: "Information Technology" },
// ];
export interface Major {
  id: number;
  name: string;
  faculty: string;
}

export const majorsData: Major[] = [
  { 
    id: 1, 
    name: "Computer Science", 
    faculty: "Engineering" 
  },
  { 
    id: 2, 
    name: "Software Engineering", 
    faculty: "Engineering" 
  },
  { 
    id: 3, 
    name: "Data Science", 
    faculty: "Science" 
  },
  { 
    id: 4, 
    name: "Marketing", 
    faculty: "Business" 
  },
  { 
    id: 5, 
    name: "Graphic Design", 
    faculty: "Arts" 
  },
  { 
    id: 6, 
    name: "Information Systems", 
    faculty: "Information Technology" 
  },
];