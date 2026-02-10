// import { 
//   LayoutDashboard, 
//   Users, 
//   GraduationCap, 
//   BookOpen, 
//   Lightbulb, 
//   Briefcase, 
//   FolderOpen, 
//   FileText, 
//   Newspaper 
// } from "lucide-react";
// import { sidebarItems } from "@/data/lessonsData";
// import { cn } from "@/lib/utils";
// import { NavLink } from "@/components/NavLink";

// const iconMap = {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   BookOpen,
//   Lightbulb,
//   Briefcase,
//   FolderOpen,
//   FileText,
//   Newspaper,
// };

// export function AdminSidebar() {
//   return (
//     <aside className="fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] border-r border-sidebar-border bg-sidebar">
//       <div className="p-6">
//         <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
//         <p className="text-sm text-muted-foreground">Manage Data</p>
//       </div>
      
//       <nav className="px-3">
//         {sidebarItems.map((item) => {
//           const Icon = iconMap[item.icon as keyof typeof iconMap];
          
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//               activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
//             >
//               <Icon className="h-5 w-5" />
//               {item.label}
//             </NavLink>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

// import { 
//   LayoutDashboard, 
//   Users, 
//   GraduationCap, 
//   BookOpen, 
//   Lightbulb, 
//   Heart, // Added for Interests
//   Briefcase, 
//   FolderOpen, 
//   FileText, 
//   Newspaper 
// } from "lucide-react";
// import { sidebarItems } from "@/data/lessonsData";
// import { cn } from "@/lib/utils";
// import { NavLink } from "@/components/NavLink";

// const iconMap = {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   BookOpen,
//   Lightbulb,
//   Heart, // Added to map
//   Briefcase,
//   FolderOpen,
//   FileText,
//   Newspaper,
// };

// export function AdminSidebar() {
//   return (
//     <aside className="fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] border-r border-sidebar-border bg-sidebar">
//       <div className="p-6">
//         <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
//         <p className="text-sm text-muted-foreground">Manage Data</p>
//       </div>
      
//       <nav className="px-3">
//         {sidebarItems.map((item) => {
//           const Icon = iconMap[item.icon as keyof typeof iconMap];
          
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//               activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
//             >
//               {/* Ensure Icon exists before rendering to prevent errors */}
//               {Icon && <Icon className="h-5 w-5" />}
//               {item.label}
//             </NavLink>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

//2
// import { 
//   LayoutDashboard, 
//   Users, 
//   ClipboardList, // New
//   GraduationCap, 
//   BookOpen, 
//   Lightbulb, 
//   Heart, // New
//   Briefcase, 
//   FolderOpen, 
//   FileText, 
//   Newspaper 
// } from "lucide-react";
// import { sidebarItems } from "@/data/lessonsData";
// import { NavLink } from "@/components/NavLink";

// const iconMap = {
//   LayoutDashboard,
//   Users,
//   ClipboardList, // For Reports
//   GraduationCap, // For Faculty
//   BookOpen,      // For Majors
//   Lightbulb,     // For Skills
//   Heart,         // For Interests
//   Briefcase,     // For Careers
//   FolderOpen,    // For Courses
//   FileText,      // For Lessons
//   Newspaper,     // For News
// };

// export function AdminSidebar() {
//   return (
//     <aside className="fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] border-r border-sidebar-border bg-sidebar">
//       <div className="p-6">
//         <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
//         <p className="text-sm text-muted-foreground">Manage Data</p>
//       </div>
      
//       <nav className="px-3">
//         {sidebarItems.map((item) => {
//           const Icon = iconMap[item.icon as keyof typeof iconMap];
          
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//               activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
//             >
//               <Icon className="h-5 w-5" />
//               {item.label}
//             </NavLink>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Briefcase, 
  FolderOpen, 
  FileText, 
  Newspaper 
} from "lucide-react";
import { sidebarItems } from "@/data/lessonsData";
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
  FolderOpen,
  FileText,
  Newspaper,
};

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] border-r border-sidebar-border bg-sidebar">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Manage Data</p>
      </div>
      
      <nav className="px-3">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
            >
              {Icon ? <Icon className="h-5 w-5" /> : null}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}