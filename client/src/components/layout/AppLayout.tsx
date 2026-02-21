import { Link, useLocation } from "wouter";
import { 
  LogOut, ChevronDown, Settings, HelpCircle, Menu, X
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
import { useState, useRef, useEffect } from "react";
import SparkleText from "@/components/SparkleText";

type NavItem = { href: string; label: string };

function NavDropdown({ label, items, currentPath }: { label: string; items: NavItem[]; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = items.some(i => currentPath === i.href);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-1 py-1 text-[13px] font-medium tracking-wide uppercase transition-colors",
          isActive ? "text-white" : "text-gray-400 hover:text-white"
        )}
        data-testid={`nav-${label.toLowerCase()}`}
      >
        {label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-[13px] font-medium transition-colors",
                currentPath === item.href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              data-testid={`nav-item-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const distributionItems: NavItem[] = [
    { href: "/app/catalog", label: "Digital Releases" },
    { href: "/app/upload", label: "Create Product" },
  ];

  const financeItems: NavItem[] = [
    { href: "/app/earnings", label: "Earnings" },
    { href: "/app/payouts", label: "Payouts" },
  ];

  const adminItems: NavItem[] = user?.role === "label_manager" ? [
    { href: "/app/admin/applications", label: "Applications" },
    { href: "/app/admin/releases", label: "Release Queue" },
    { href: "/app/admin/payouts", label: "Payouts Queue" },
    { href: "/app/admin/users", label: "User Management" },
    { href: "/app/admin/dsps", label: "DSP Management" },
    { href: "/app/admin/support", label: "All Tickets" },
    { href: "/app/admin/news", label: "News" },
    { href: "/app/admin/settings", label: "Platform Settings" },
  ] : [];

  const initials = user?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "??";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f6f8]">
      <nav className="bg-black shrink-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center h-[52px]">
          <Link href="/app/dashboard" className="mr-8 shrink-0" data-testid="nav-brand">
            <SparkleText color="rgba(255,255,255,0.8)" sparkleCount={4}>
              <span className="font-bold text-[15px] tracking-[0.18em] uppercase text-white">RAW ARCHIVES</span>
            </SparkleText>
          </Link>

          <div className="hidden md:flex items-center gap-5 flex-1">
            <Link
              href="/app/dashboard"
              className={cn(
                "text-[13px] font-medium tracking-wide uppercase transition-colors px-1 py-1",
                location === "/app/dashboard" ? "text-white" : "text-gray-400 hover:text-white"
              )}
              data-testid="nav-home"
            >
              Home
            </Link>

            <NavDropdown label="Distribution" items={distributionItems} currentPath={location} />
            <NavDropdown label="Finance" items={financeItems} currentPath={location} />

            {adminItems.length > 0 && (
              <NavDropdown label="Admin" items={adminItems} currentPath={location} />
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/app/help"
              className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white transition-colors"
              data-testid="nav-help"
            >
              help
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <Avatar className="w-8 h-8 border-2 border-gray-600 cursor-pointer">
                  <AvatarFallback className="bg-gray-700 text-gray-200 text-[10px] font-bold">{initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 rounded-lg shadow-xl mt-2">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900" data-testid="text-user-name">{user?.fullName}</p>
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

            <button
              className="md:hidden p-1 text-gray-400 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 px-4 py-2 bg-black max-h-[calc(100vh-52px)] overflow-y-auto pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
            <Link
              href="/app/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                location === "/app/dashboard"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Home
            </Link>

            <div className="mt-3 mb-1 px-3 pt-3 border-t border-gray-700">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Distribution</span>
            </div>
            {distributionItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                  location === item.href
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 mb-1 px-3 pt-3 border-t border-gray-700">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Finance</span>
            </div>
            {financeItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                  location === item.href
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}

            {adminItems.length > 0 && (
              <>
                <div className="mt-3 mb-1 px-3 pt-3 border-t border-gray-700">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Admin</span>
                </div>
                {adminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                      location === item.href
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            <div className="mt-3 mb-1 px-3 pt-3 border-t border-gray-700">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Support</span>
            </div>
            <Link
              href="/app/support"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                location === "/app/support"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Support
            </Link>
            <Link
              href="/app/help"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                location === "/app/help"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Help Center
            </Link>

            <Link
              href="/app/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded text-[13px] font-medium transition-colors mt-3 pt-3 border-t border-gray-700",
                location === "/app/settings"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              Settings
            </Link>
          </div>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
