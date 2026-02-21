import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Music, UploadCloud, DollarSign, CreditCard, 
  Users, Settings, HelpCircle, Bell, Search, LogOut,
  User as UserIcon, ShieldCheck, FileCheck, ClipboardList, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const mainItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/catalog", label: "Catalog", icon: Music },
    { href: "/app/upload", label: "Upload", icon: UploadCloud },
    { href: "/app/earnings", label: "Earnings", icon: DollarSign },
    { href: "/app/payouts", label: "Payouts", icon: CreditCard },
    { href: "/app/artists", label: "Artists", icon: Users },
    { href: "/app/settings", label: "Settings", icon: Settings },
    { href: "/app/support", label: "Support", icon: HelpCircle },
  ];

  const adminItems = user?.role === "admin" ? [
    { href: "/app/admin/applications", label: "Applications", icon: ClipboardList },
    { href: "/app/admin/releases", label: "Release Queue", icon: FileCheck },
    { href: "/app/admin/users", label: "User Mgmt", icon: ShieldCheck },
    { href: "/app/admin/support", label: "All Tickets", icon: MessageSquare },
  ] : [];

  const initials = user?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "??";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="w-64 border-r border-white/5 bg-[#050505] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="font-black text-xl tracking-[0.2em] uppercase text-white">
            RAW ARCHIVES
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                location === item.href 
                  ? "bg-white/10 text-white" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}

          {adminItems.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-4 text-[9px] font-black tracking-[0.3em] uppercase text-white/20">
                Admin
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                    location === item.href 
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                  data-testid={`nav-admin-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200 w-full"
            data-testid="button-sidebar-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
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
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="w-8 h-8 border border-white/10 cursor-pointer">
                  <AvatarFallback className="bg-white/10 text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white rounded-md p-1 mt-2 shadow-2xl">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none" data-testid="text-user-name">{user?.fullName}</p>
                    <p className="text-xs text-white/40 leading-none">{user?.email}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                  <Link href="/app/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="p-3 text-sm cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-black p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
