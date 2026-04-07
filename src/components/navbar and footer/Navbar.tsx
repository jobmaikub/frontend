import { useState } from "react";
import { Box, ChevronDown, Bell, Settings, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", path: "/not-found" },
  { name: "Career", path: "/not-found" },
  { name: "News", path: "/news" },
  { name: "AI Match", path: "/ai-match" },
  { name: "Learning Path", path: "/learning-path" },
  { name: "Track Progress", path: "/not-found" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getStyle = (id: string) => ({
    backgroundColor: hoveredItem === id ? "rgba(213, 227, 255, 0.2)" : "transparent",
    color: hoveredItem === id ? "#4A5DF9" : "#000000",
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const userName = user?.email?.split("@")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const fullName = profile?.full_name || "User"; // Ensure full_name is fetched from profile
  const userEmail = user?.email || "";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between border-b border-gray-100 bg-[#FFFFFF] px-12 font-['Inter']">
      {/* Brand Section */}
      <div className="flex items-center gap-2 ml-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4A5DF9]">
          <Box className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[#4A5DF9] tracking-tight uppercase">JOBMAIKUB</span>
      </div>
      
      {/* Navigation Menu */}
      <nav className="hidden items-center gap-10 lg:flex h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group relative flex h-full items-center text-[15px] font-medium transition-colors hover:text-[#4A5DF9] ${
                isActive ? "text-[#4A5DF9]" : "text-muted-foreground"
              }`}
            >
              {item.name}
              <span 
                className={`absolute bottom-[22px] inset-x-0 h-[2.5px] bg-[#4A5DF9] transition-transform duration-200 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} 
              />
            </Link>
          );
        })}
      </nav>
      
      {/* Right Actions Section */}
      <div className="flex items-center gap-4 mr-4">
        <div className="p-2 cursor-pointer text-muted-foreground hover:text-[#4A5DF9] transition-colors">
          <Bell className="h-5 w-5" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 ml-2 cursor-pointer group outline-none">
              <Avatar className="h-9 w-9 border border-[#D5E3FF]">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#D5E3FF] text-[#4A5DF9] font-bold text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-[#4A5DF9] transition-colors" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-72 mt-2 bg-white" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-black tracking-tight">{fullName}</p>
                {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <div className="p-1 space-y-1">
              <DropdownMenuItem 
                onMouseEnter={() => setHoveredItem('profile')}
                onMouseLeave={() => setHoveredItem(null)}
                style={getStyle('profile')}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-all outline-none"
              >
                <User size={16} color={hoveredItem === 'profile' ? "#4A5DF9" : "#000000"} />
                <span className="text-sm font-medium">My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/dashboard" 
                  onMouseEnter={() => setHoveredItem('admin')}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={getStyle('admin')}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-all outline-none"
                >
                  <Settings size={16} color={hoveredItem === 'admin' ? "#4A5DF9" : "#000000"} />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-[#EF4444] focus:bg-[#FEF2F2] hover:bg-[#FEF2F2] focus:text-[#EF4444] rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}