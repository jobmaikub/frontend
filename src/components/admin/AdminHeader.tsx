import { Box, ChevronDown, Bell, Settings, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = ["Home", "Career", "News", "AI Match", "Learning Path", "Track Progress"];

export function AdminHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b border-border bg-[#FFFFFF] px-12">
      {/* Brand Section */}
      <div className="flex items-center gap-2 ml-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4A5DF9]">
          <Box className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[#4A5DF9] tracking-tight uppercase">JOBMAIKUB</span>
      </div>
      
      {/* Navigation Menu */}
      <nav className="hidden items-center gap-10 lg:flex h-full">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="group relative flex h-full items-center text-[15px] font-medium text-muted-foreground transition-colors hover:text-[#4A5DF9]"
          >
            {item}
            <span className="absolute bottom-[14px] inset-x-0 h-[2.5px] scale-x-0 bg-[#4A5DF9] transition-transform duration-200 group-hover:scale-x-100" />
          </a>
        ))}
      </nav>
      
      {/* Right Actions Section */}
      <div className="flex items-center gap-4 mr-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 font-medium text-muted-foreground hover:bg-transparent hover:text-[#4A5DF9]"
        >
          <Settings className="h-5 w-5" />
          <span>Admin</span>
        </Button>

        <div className="p-2 cursor-pointer text-muted-foreground hover:text-[#4A5DF9] transition-colors">
          <Bell className="h-5 w-5" />
        </div>

        {/* Profile Dropdown Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 ml-2 cursor-pointer group outline-none">
              <Avatar className="h-9 w-9 border border-[#D5E3FF]">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#D5E3FF] text-[#4A5DF9] font-bold text-sm">Y</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-[#4A5DF9] transition-colors" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-72 mt-2 bg-white" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                {/* Fixed: Reduced font weight from font-bold to font-semibold */}
                <p className="text-sm font-semibold leading-none text-black tracking-tight">
                    Yanisa Klongkleaw
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                    julia12a2005@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <div className="p-1">
              <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#F9FAFB] hover:bg-[#F9FAFB] rounded-md">
                <User className="h-4 w-4 text-black group-hover:text-[#4A5DF9] transition-colors" />
                <span className="text-sm font-medium text-black group-hover:text-[#4A5DF9] transition-colors">
                  My Profile
                </span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#F9FAFB] hover:bg-[#F9FAFB] rounded-md">
                <Settings className="h-4 w-4 text-black group-hover:text-[#4A5DF9] transition-colors" />
                <span className="text-sm font-medium text-black group-hover:text-[#4A5DF9] transition-colors">
                  Admin Panel
                </span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-[#EF4444] focus:bg-[#FEF2F2] hover:bg-[#FEF2F2] focus:text-[#EF4444] rounded-md transition-colors">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}