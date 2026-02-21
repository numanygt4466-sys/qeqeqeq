import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Music, 
  UploadCloud, 
  DollarSign, 
  CreditCard, 
  Users, 
  Settings, 
  HelpCircle,
  Bell,
  Search,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const sidebarItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/catalog", label: "Catalog", icon: Music },
    { href: "/app/upload", label: "Upload", icon: UploadCloud },
    { href: "/app/earnings", label: "Earnings", icon: DollarSign },
    { href: "/app/payouts", label: "Payouts", icon: CreditCard },
    { href: "/app/artists", label: "Artists", icon: Users },
    { href: "/app/users", label: "Users", icon: UserIcon },
    { href: "/app/settings", label: "Settings", icon: Settings },
    { href: "/app/support", label: "Support", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="font-black text-xl tracking-[0.2em] uppercase text-white">
            RAW ARCHIVES
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                location === item.href 
                  ? "bg-white/10 text-white" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-white/5">
          <Link 
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#050505] flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search catalog, artists..." 
                className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="w-8 h-8 border border-white/10 cursor-pointer">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback className="bg-white/10 text-xs">AD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white rounded-md p-1 mt-2 shadow-2xl">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs text-white/40 leading-none">admin@rawarchives.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="p-3 text-sm cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 text-sm cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white text-red-400 focus:text-red-400">
                  <Link href="/login" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-black p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}