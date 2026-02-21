import { Link, useLocation } from "wouter";
import { Menu, Globe, User, LayoutDashboard, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <button className="p-2 -ml-2 hover:bg-white/5 transition-colors group" aria-label="Menu">
            <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          
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
            <Globe className="w-6 h-6 text-white mb-1 transition-transform group-hover:rotate-12" />
            <span className="font-black text-xl tracking-[0.3em] uppercase leading-none">RAW ARCHIVES</span>
            <span className="text-[7px] tracking-[0.6em] font-bold text-white/40 uppercase mt-1">Music Group</span>
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
            className="flex items-center gap-2 bg-white text-black px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all"
          >
            <User className="w-3 h-3" />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}