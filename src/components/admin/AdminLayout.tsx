import { Navbar } from "../navbar and footer/Navbar";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#D5E3FF]/20">
      <Navbar />
      <AdminSidebar />
      <main className="ml-[var(--sidebar-width)] pt-[var(--header-height)]">
        <div className="p-8 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}


