import { Link, useLocation } from "wouter";
import { Menu, User, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import SparkleText from "@/components/SparkleText";
import blingLogo from "@/assets/images/raw-archives-logo-bling.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

let hasSpunOnce = false;

export default function Navbar() {
  const [location] = useLocation();
  const [spinning, setSpinning] = useState(!hasSpunOnce);

  useEffect(() => {
    if (!hasSpunOnce) {
      hasSpunOnce = true;
      const timer = setTimeout(() => setSpinning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const navItems = [
    { href: "/artists", label: "Artists" },
    { href: "/catalog", label: "Catalog" },
    { href: "/register", label: "Submit Application", icon: Send },
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
                    <Link href="/login" className="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" /> Sign In
                    </Link>
                  </SheetClose>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 pb-[env(safe-area-inset-bottom)]">
                <SparkleText color="rgba(255,255,255,0.9)" sparkleCount={4}>
                  <img src={blingLogo} alt="Raw Archives Records" className="h-12 object-contain" />
                </SparkleText>
              </div>
            </SheetContent>
          </Sheet>
          
        </div>
        
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center group">
          <SparkleText color="rgba(255,255,255,0.9)" sparkleCount={6}>
            <img
              src={blingLogo}
              alt="Raw Archives Records"
              className={cn(
                "h-14 md:h-20 object-contain transition-transform group-hover:scale-105",
                spinning && "logo-spin-intro"
              )}
            />
          </SparkleText>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-white text-black px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all min-h-[44px]"
          >
            <User className="w-3 h-3" />
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
