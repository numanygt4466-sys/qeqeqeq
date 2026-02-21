import { Link, useLocation } from "wouter";
import { Menu, Globe, User, LayoutDashboard, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/artists", label: "Artists" },
    { href: "/catalog", label: "Catalog" },
    { href: "/submissions", label: "Submit Application", icon: Send },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 hover:bg-white/5 transition-colors group min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Menu">
                <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-r border-white/10 p-0 w-full sm:max-w-md">
              <SheetHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                <SheetTitle className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-8 gap-8">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link 
                      href={item.href} 
                      className={cn(
                        "text-3xl font-black tracking-tighter uppercase transition-colors hover:text-primary",
                        location === item.href ? "text-primary" : "text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link href="/dashboard" className="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Portal
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/login" className="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" /> Member Login
                    </Link>
                  </SheetClose>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 pb-[env(safe-area-inset-bottom)]">
                <div className="flex flex-col gap-1">
                  <span className="font-black text-xl tracking-[0.3em] uppercase leading-none text-white">RAW ARCHIVES</span>
                  <span className="text-[7px] tracking-[0.6em] font-bold text-white/40 uppercase mt-1">Global Music Group</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  "text-[10px] font-black tracking-[0.25em] uppercase transition-colors flex items-center gap-2",
                  location === item.href ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                {item.icon && <item.icon className="w-3 h-3" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
          <div className="flex flex-col items-center gap-0">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-white mb-1 transition-transform group-hover:rotate-12" />
            <span className="font-black text-sm md:text-xl tracking-[0.2em] md:tracking-[0.3em] uppercase leading-none">RAW ARCHIVES</span>
            <span className="text-[7px] tracking-[0.6em] font-bold text-white/40 uppercase mt-1 hidden sm:block">Music Group</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className={cn(
              "hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors",
              location === "/dashboard" ? "text-white" : "text-white/40 hover:text-white"
            )}
          >
            <LayoutDashboard className="w-3 h-3" />
            Portal
          </Link>
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-white text-black px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all min-h-[44px]"
          >
            <User className="w-3 h-3" />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
