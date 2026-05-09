import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Navbar } from "../navbar and footer/Navbar";
import { AdminSidebar } from "./AdminSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#D5E3FF]/20 flex flex-col">
      <Navbar />
      
      {/* Mobile Sidebar Toggle - Only visible on small screens */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100 pl-6 pr-4 h-12 flex items-center">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-[#4A5DF9]"
        >
          <Menu className="h-6 w-6" />
          Admin Menu
        </button>
      </div>

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[var(--sidebar-width)] shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        <Sheet modal={false} open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0 bg-white [&>button]:hidden border-r border-gray-100">
            <AdminSidebar isMobile onItemClick={() => setIsMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 w-full overflow-x-hidden pt-12 lg:pt-0">
          <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


