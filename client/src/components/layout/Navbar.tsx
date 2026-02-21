import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/artists", label: "Artists" },
    { href: "/catalog", label: "Catalog" },
    { href: "/submissions", label: "Submissions" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" data-testid="link-home-logo">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-white tracking-tighter transition-transform group-hover:scale-110">RA</div>
          <span className="font-display font-black text-xl tracking-[0.2em] uppercase">RAW ARCHIVES</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.15em] transition-all hover:text-primary",
                location === item.href ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/submissions" className="hidden sm:block text-xs font-bold uppercase tracking-widest border border-white/10 px-6 py-2.5 hover:bg-white hover:text-black transition-all" data-testid="link-nav-submit">
            Submit Demo
          </Link>
          <button className="lg:hidden text-white" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h16M4 16h16"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}