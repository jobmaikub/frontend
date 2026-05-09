import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Briefcase, 
  BookMarked, 
  FileText, 
  Newspaper 
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const iconMap = {
  LayoutDashboard,
  Users,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Heart,
  Briefcase,
  BookMarked,
  FileText,
  Newspaper,
};

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/admin/dashboard" },
  { id: "users", label: "Users", icon: "Users", path: "/admin/users" },
  { id: "reports", label: "Reports", icon: "ClipboardList" , path: "/admin/reports" },
  { id: "faculties", label: "Faculties", icon: "GraduationCap", path: "/admin/faculties" },
  { id: "majors", label: "Majors", icon: "BookOpen", path: "/admin/majors" },
  { id: "skills", label: "Skills", icon: "Lightbulb", path: "/admin/skills" },
  { id: "interests", label: "Interests", path: "/admin/interests", icon: "Heart" },
  { id: "careers", label: "Careers", icon: "Briefcase", path: "/admin/careers" },
  { id: "courses", label: "Courses", icon: "BookMarked", path: "/admin/courses" },
  { id: "lessons", label: "Lessons", icon: "FileText", path: "/admin/lessons" },
  { id: "news", label: "News", icon: "Newspaper", path: "/admin/news" },
] as const;

interface AdminSidebarProps {
  onItemClick?: () => void;
  isMobile?: boolean;
}

export function AdminSidebar({ onItemClick, isMobile }: AdminSidebarProps) {
  const sidebarClasses = isMobile
    ? "h-full w-full bg-white flex flex-col"
    : "fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] border-r border-gray-100 bg-white flex flex-col";

  return (
    <aside className={sidebarClasses}>
      {isMobile && (
        <div className="flex h-16 shrink-0 items-center gap-2 px-6 border-b border-gray-50">
          <img
            src="/jobmaikub-logo.png"
            alt="Jobmaikub logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold text-[#4A5DF9] tracking-tight uppercase">JOBMAIKUB</span>
        </div>
      )}
      
      <nav className="flex-1 px-3 pt-8 pb-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onItemClick}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 text-gray-600 hover:bg-[#D5E3FF]/30 hover:text-[#4A5DF9]"
              activeClassName="bg-[#4A5DF9] text-white shadow-md shadow-[#4A5DF9]/20"
            >
              {Icon ? <Icon className="h-5 w-5 transition-colors" /> : null}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
