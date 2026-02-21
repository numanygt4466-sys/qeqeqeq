import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/artists", label: "ARTISTS" },
    { href: "/releases", label: "RELEASES" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tighter" data-testid="link-home-logo">
          RAW ARCHIVES
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-mono tracking-widest transition-colors hover:text-foreground",
                location === item.href ? "text-foreground" : "text-muted-foreground"
              )}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Nav Toggle could go here later */}
        <div className="md:hidden">
          <span className="font-mono text-xs">MENU</span>
        </div>
      </div>
    </header>
  );
}