import { Link } from "wouter";
import { Menu, Search, Globe, ChevronRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="p-2 -ml-2 hover:bg-white/5 transition-colors group" aria-label="Menu">
            <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <div className="hidden lg:flex items-center gap-6">
            {['Company', 'Artists', 'Labels', 'News', 'Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
        
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
          <span className="font-black text-2xl tracking-[0.3em] uppercase leading-none transition-all group-hover:tracking-[0.4em]">RAW ARCHIVES</span>
          <span className="text-[9px] tracking-[0.55em] font-medium text-white/40 uppercase mt-1">Music Group</span>
        </Link>

        <div className="flex items-center gap-6">
          <button className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">EN</span>
          </button>
          <button className="p-2 hover:bg-white/5 transition-colors group" aria-label="Search">
            <Search className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
}