import { Link } from "wouter";
import { Menu, Globe } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div className="h-24 px-0 flex items-start justify-between">
        {/* Menu Toggle */}
        <div className="w-12 h-12 bg-[#00AEEF] flex items-center justify-center cursor-pointer hover:bg-[#0096ce] transition-colors">
          <Menu className="w-6 h-6 text-black" />
        </div>
        
        {/* Centered Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 top-6 flex flex-col items-center group">
          <div className="flex flex-col items-center gap-0">
            <Globe className="w-8 h-8 text-white mb-1" />
            <span className="font-black text-xl tracking-[0.3em] uppercase leading-none">RAW ARCHIVES</span>
            <span className="text-[8px] tracking-[0.5em] font-bold text-white uppercase mt-2">Music Group</span>
          </div>
        </Link>

        {/* News Button */}
        <Link href="/news" className="bg-black px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all">
          News
        </Link>
      </div>
    </nav>
  );
}