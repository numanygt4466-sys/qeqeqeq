import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Music, UploadCloud, DollarSign, CreditCard, 
  Users, Settings, HelpCircle, LogOut, ChevronDown,
  ShieldCheck, FileCheck, ClipboardList, MessageSquare, Radio,
  Search, Bell, Menu, X
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
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const distributionItems = [
    { href: "/app/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/app/catalog", label: "Digital Releases", icon: Music },
    { href: "/app/upload", label: "Create Product", icon: UploadCloud },
  ];

  const financeItems = [
    { href: "/app/earnings", label: "Earnings", icon: DollarSign },
    { href: "/app/payouts", label: "Payouts", icon: CreditCard },
  ];

  const supportItems = [
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

  const NavLink = ({ item, prefix = "nav" }: { item: { href: string; label: string; icon: any }; prefix?: string }) => (
    <Link
      href={item.href}
      onClick={() => setMobileMenuOpen(false)}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all",
        location === item.href 
          ? "bg-indigo-50 text-indigo-700" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      data-testid={`${prefix}-${item.label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <item.icon className="w-4 h-4" />
      {item.label}
    </Link>
  );

  const SidebarSection = ({ title, items, prefix }: { title: string; items: typeof distributionItems; prefix?: string }) => (
    <>
      <div className="mt-5 mb-1.5 px-3 text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">
        {title}
      </div>
      {items.map((item) => (
        <NavLink key={item.href} item={item} prefix={prefix || "nav"} />
      ))}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f8]">
      <aside className="w-[230px] bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <div className="h-[56px] flex items-center px-5 border-b border-gray-200">
          <Link href="/" className="font-bold text-[13px] tracking-[0.15em] uppercase text-gray-900">
            RAW ARCHIVES
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-1 flex flex-col gap-0.5 px-3">
          <SidebarSection title="Distribution" items={distributionItems} />
          <SidebarSection title="Finance" items={financeItems} />
          <SidebarSection title="Support" items={supportItems} />
          {adminItems.length > 0 && (
            <SidebarSection title="Admin" items={adminItems} prefix="nav-admin" />
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8 border border-gray-200">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/app/catalog" className="text-[13px] font-medium text-gray-500 hover:text-indigo-600 transition-colors" data-testid="header-link-releases">
                Releases
              </Link>
              <Link href="/app/earnings" className="text-[13px] font-medium text-gray-500 hover:text-indigo-600 transition-colors" data-testid="header-link-earnings">
                Earnings
              </Link>
              <Link href="/app/support" className="text-[13px] font-medium text-gray-500 hover:text-indigo-600 transition-colors" data-testid="header-link-support">
                Support
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" data-testid="button-notifications">
              <Bell className="w-[18px] h-[18px]" />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="w-8 h-8 border border-gray-200 cursor-pointer">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-[13px] font-medium text-gray-900" data-testid="text-user-name">{user?.fullName}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
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

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1 shadow-sm">
            {[...distributionItems, ...financeItems, ...supportItems, ...adminItems].map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
