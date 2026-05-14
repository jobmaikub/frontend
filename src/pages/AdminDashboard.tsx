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
import { getDashboardStats } from "@/lib/stats.api";

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
        const dashboardStats = await getDashboardStats().catch(() => null);

        if (dashboardStats) {
          setStats([
            { icon: Users, value: dashboardStats.users, label: "Users", variant: "blue", path: "/admin/users" },
            { icon: ClipboardList, value: dashboardStats.reports, label: "Reports", variant: "cyan", path: "/admin/reports" },
            { icon: GraduationCap, value: dashboardStats.faculties, label: "Faculties", variant: "pink", path: "/admin/faculties" },
            { icon: BookOpen, value: dashboardStats.majors, label: "Majors", variant: "purple", path: "/admin/majors" },
            { icon: Lightbulb, value: dashboardStats.skills, label: "Skills", variant: "green", path: "/admin/skills" },
            { icon: Heart, value: dashboardStats.interests, label: "Interests", variant: "mint", path: "/admin/interests" },
            { icon: Briefcase, value: dashboardStats.careers, variant: "coral", label: "Careers", path: "/admin/careers" },
            { icon: BookMarked, value: dashboardStats.courses, label: "Courses", variant: "pink", path: "/admin/courses" },
            { icon: FileText, value: dashboardStats.lessons, label: "Lessons", variant: "cyan", path: "/admin/lessons" },
            { icon: Newspaper, value: dashboardStats.news, label: "News", variant: "mint", path: "/admin/news" },
          ]);
        }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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
