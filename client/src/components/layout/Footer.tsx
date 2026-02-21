import { Facebook, Twitter, Instagram, Mail, Search } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 w-full h-12 bg-black border-t border-white/10 flex items-center justify-between px-6 md:px-12 z-50 text-[9px] tracking-widest uppercase font-bold text-white/40">
      <div className="flex-1 flex items-center gap-2">
        <span>&copy; {year} RAW ARCHIVES MUSIC GROUP N.V. ALL RIGHTS RESERVED.</span>
      </div>

      <div className="flex-1 flex justify-center items-center gap-6">
        <a href="#" className="hover:text-white transition-colors"><Facebook className="w-3 h-3" /></a>
        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-3 h-3" /></a>
        <a href="#" className="hover:text-white transition-colors"><Instagram className="w-3 h-3" /></a>
        <a href="#" className="hover:text-white transition-colors"><Mail className="w-3 h-3" /></a>
        <a href="#" className="hover:text-white transition-colors"><Search className="w-3 h-3" /></a>
      </div>

      <div className="flex-1 flex justify-end gap-6">
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Cookie Choices</a>
      </div>
    </footer>
  );
}