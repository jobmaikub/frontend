import { useState } from "react";
import { ChevronDown, Bookmark, Settings, User, LogOut, Menu, Home, Briefcase, Newspaper, Sparkles, Map, LineChart } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Career", path: "/careers", icon: Briefcase },
  { name: "News", path: "/news", icon: Newspaper },
  { name: "AI Match", path: "/ai-match", icon: Sparkles },
  { name: "Learning Path", path: "/learning-path", icon: Map },
  { name: "Track Progress", path: "/track-progress", icon: LineChart },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const isAdmin = String(profile?.role || "").toLowerCase() === "admin";

  return (
    <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-[#FFFFFF] px-4 sm:px-8 lg:px-12 font-['Inter']">
      {/* Brand Section */}
      <div className="flex items-center gap-2">
        <Link to="/home" className="flex items-center gap-2">
          <img
            src="/jobmaikub-logo.png"
            alt="Jobmaikub logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold text-[#4A5DF9] tracking-tight uppercase">JOBMAIKUB</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} modal={false}>
          <SheetTrigger asChild>
            <button className="lg:hidden ml-4 p-2 text-muted-foreground hover:text-[#4A5DF9] transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-white flex flex-col border-r border-gray-100 shadow-xl [&>button]:hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            {/* Header */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-50">
              <img
                src="/jobmaikub-logo.png"
                alt="Jobmaikub logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold text-[#4A5DF9] tracking-tight uppercase">JOBMAIKUB</span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2 flex-1 p-4 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive
                      ? "bg-[#4A5DF9] text-white shadow-md shadow-[#4A5DF9]/20"
                      : "text-gray-600 hover:bg-[#D5E3FF]/30 hover:text-[#4A5DF9]"
                      }`}
                  >
                    <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#4A5DF9]"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden items-center gap-10 lg:flex h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group relative flex h-full items-center text-[15px] font-medium transition-colors hover:text-[#4A5DF9] ${isActive ? "text-[#4A5DF9]" : "text-muted-foreground"
                }`}
            >
              {item.name}
              <span
                className={`absolute bottom-0 inset-x-0 h-[2.5px] bg-[#4A5DF9] transition-transform duration-200 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Right Actions Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/bookmark"
          className={`p-2 rounded-md transition-colors ${location.pathname === "/bookmark"
            ? "text-[#4A5DF9] bg-[#D5E3FF]/30"
            : "text-muted-foreground hover:text-[#4A5DF9]"
            }`}
          aria-label="Bookmarks"
        >
          <Bookmark className="h-5 w-5" />
        </Link>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 ml-2 cursor-pointer group outline-none">
              <div className="h-9 w-9 rounded-full border border-[#D5E3FF] overflow-hidden bg-[#D5E3FF] flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    key={profile.avatar_url}
                    src={profile.avatar_url}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[#4A5DF9] font-bold text-sm">
                    {userInitial}
                  </span>
                )}
              </div>
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
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  onMouseEnter={() => setHoveredItem('profile')}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={getStyle('profile')}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-all outline-none"
                >
                  <User size={16} color={hoveredItem === 'profile' ? "#4A5DF9" : "#000000"} />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
              </DropdownMenuItem>

              {isAdmin && (
                <>
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
                </>
              )}

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
