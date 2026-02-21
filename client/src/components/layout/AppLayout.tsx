import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Music, UploadCloud, DollarSign, CreditCard, 
  Users, Settings, HelpCircle, LogOut, ChevronDown,
  ShieldCheck, FileCheck, ClipboardList, MessageSquare, Disc, Radio
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
    { href: "/app/catalog", label: "Releases", icon: Music },
    { href: "/app/upload", label: "Create Product", icon: UploadCloud },
    { href: "/app/earnings", label: "Earnings", icon: DollarSign },
    { href: "/app/payouts", label: "Payouts", icon: CreditCard },
    { href: "/app/support", label: "Support", icon: HelpCircle },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ];

  const adminItems = user?.role === "admin" ? [
    { href: "/app/admin/applications", label: "Applications", icon: ClipboardList },
    { href: "/app/admin/releases", label: "Release Queue", icon: FileCheck },
    { href: "/app/admin/payouts", label: "Payouts Queue", icon: CreditCard },
    { href: "/app/admin/users", label: "User Management", icon: ShieldCheck },
    { href: "/app/admin/dsps", label: "DSP Management", icon: Radio },
    { href: "/app/admin/support", label: "All Tickets", icon: MessageSquare },
    { href: "/app/admin/settings", label: "Platform Settings", icon: Settings },
  ] : [];

  const initials = user?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "??";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa]">
      <aside className="w-[220px] bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <Link href="/" className="font-bold text-sm tracking-wider uppercase text-gray-900 flex items-center gap-2">
            <Disc className="w-5 h-5 text-indigo-600" />
            RAW ARCHIVES
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5 px-3">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all",
                location === item.href 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}

          {adminItems.length > 0 && (
            <>
              <div className="mt-4 mb-1.5 px-3 text-[10px] font-semibold tracking-wider uppercase text-gray-400">
                Admin
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all",
                    location === item.href 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none flex items-center gap-2">
                <Avatar className="w-8 h-8 border border-gray-200 cursor-pointer">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900" data-testid="text-user-name">{user?.fullName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 rounded-lg shadow-lg mt-1">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/app/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
