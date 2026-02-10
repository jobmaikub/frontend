import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Building2,
  BookMarked,
  FileText,
  Newspaper,
} from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";

const DashboardPage = () => {
  const [stats, setStats] = useState([
    { icon: Users, value: 0, label: "Users", variant: "blue" as const },
    { icon: GraduationCap, value: 0, label: "Faculties", variant: "pink" as const },
    { icon: BookOpen, value: 0, label: "Majors", variant: "purple" as const },
    { icon: Lightbulb, value: 0, label: "Skills", variant: "green" as const },
    { icon: Building2, value: 0, label: "Careers", variant: "coral" as const },
    { icon: BookMarked, value: 0, label: "Courses", variant: "pink" as const },
    { icon: FileText, value: 0, label: "Lessons", variant: "cyan" as const },
    { icon: Newspaper, value: 0, label: "News", variant: "mint" as const },
  ]);

  useEffect(() => {
    const fetchCounts = async () => {
      const [
        users,
        faculties,
        majors,
        skills,
        careers,
        courses,
        lessons,
        news,
      ] = await Promise.all([
        fetch("http://localhost:3000/users").then(r => r.json()),
        fetch("http://localhost:3000/faculties").then(r => r.json()),
        fetch("http://localhost:3000/majors").then(r => r.json()),
        fetch("http://localhost:3000/skills").then(r => r.json()),
        fetch("http://localhost:3000/careers").then(r => r.json()),
        fetch("http://localhost:3000/courses").then(r => r.json()),
        fetch("http://localhost:3000/lessons").then(r => r.json()),
        fetch("http://localhost:3000/news").then(r => r.json()),
      ]);
      console.log("users:", users, Array.isArray(users), users?.length);

      setStats([
        { icon: Users, value: users.length, label: "Users", variant: "blue" },
        { icon: GraduationCap, value: faculties.length, label: "Faculties", variant: "pink" },
        { icon: BookOpen, value: majors.length, label: "Majors", variant: "purple" },
        { icon: Lightbulb, value: skills.length, label: "Skills", variant: "green" },
        { icon: Building2, value: careers.length, label: "Careers", variant: "coral" },
        { icon: BookMarked, value: courses.length, label: "Courses", variant: "pink" },
        { icon: FileText, value: lessons.length, label: "Lessons", variant: "cyan" },
        { icon: Newspaper, value: news.length, label: "News", variant: "mint" },
      ]);
    };

    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              variant={stat.variant}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
