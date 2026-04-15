import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Briefcase,
  BookMarked,
  FileText,
  Newspaper,
  ClipboardList,
  Heart,
  LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { fetchUsers } from "@/lib/users.api";
import { getFaculties } from "@/lib/faculties.api";
import { getMajors } from "@/lib/majors.api";
import { getSkills } from "@/lib/skills.api";
import { fetchCareers } from "@/lib/careers.api";
import { getCourses } from "@/lib/courses.api";
import { getLessons } from "@/lib/lessons.api";
import { getNews } from "@/lib/news.api";
import { getInterests } from "@/lib/interests.api";
import { reportsData } from "@/data/reportsData";

interface StatItem {
  icon: LucideIcon;
  value: number;
  label: string;
  variant: "blue" | "pink" | "purple" | "green" | "coral" | "cyan" | "mint";
  path: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([
    { icon: Users, value: 0, label: "Users", variant: "blue", path: "/admin/users" },
    { icon: ClipboardList, value: 0, label: "Reports", variant: "cyan", path: "/admin/reports" },
    { icon: GraduationCap, value: 0, label: "Faculties", variant: "pink", path: "/admin/faculties" },
    { icon: BookOpen, value: 0, label: "Majors", variant: "purple", path: "/admin/majors" },
    { icon: Lightbulb, value: 0, label: "Skills", variant: "green", path: "/admin/skills" },
    { icon: Heart, value: 0, label: "Interests", variant: "mint", path: "/admin/interests" },
    { icon: Briefcase, value: 0, label: "Careers", variant: "coral", path: "/admin/careers" },
    { icon: BookMarked, value: 0, label: "Courses", variant: "pink", path: "/admin/courses" },
    { icon: FileText, value: 0, label: "Lessons", variant: "cyan", path: "/admin/lessons" },
    { icon: Newspaper, value: 0, label: "News", variant: "mint", path: "/admin/news" },
  ]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          users,
          faculties,
          majors,
          skills,
          careers,
          courses,
          lessons,
          news,
          interests,
        ] = await Promise.all([
          fetchUsers().catch(() => []),
          getFaculties().catch(() => []),
          getMajors().catch(() => []),
          getSkills().catch(() => []),
          fetchCareers().catch(() => []),
          getCourses().catch(() => []),
          getLessons().catch(() => []),
          getNews().catch(() => []),
          getInterests().catch(() => []),
        ]);

        setStats([
          { icon: Users, value: users?.length || 0, label: "Users", variant: "blue", path: "/admin/users" },
          { icon: ClipboardList, value: reportsData.length || 0, label: "Reports", variant: "cyan", path: "/admin/reports" },
          { icon: GraduationCap, value: faculties?.length || 0, label: "Faculties", variant: "pink", path: "/admin/faculties" },
          { icon: BookOpen, value: majors?.length || 0, label: "Majors", variant: "purple", path: "/admin/majors" },
          { icon: Lightbulb, value: skills?.length || 0, label: "Skills", variant: "green", path: "/admin/skills" },
          { icon: Heart, value: interests?.length || 0, label: "Interests", variant: "mint", path: "/admin/interests" },
          { icon: Briefcase, value: careers?.length || 0, label: "Careers", variant: "coral", path: "/admin/careers" },
          { icon: BookMarked, value: courses?.length || 0, label: "Courses", variant: "pink", path: "/admin/courses" },
          { icon: FileText, value: lessons?.length || 0, label: "Lessons", variant: "cyan", path: "/admin/lessons" },
          { icon: Newspaper, value: news?.length || 0, label: "News", variant: "mint", path: "/admin/news" },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard counts:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <StatCard
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                variant={stat.variant}
              />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
