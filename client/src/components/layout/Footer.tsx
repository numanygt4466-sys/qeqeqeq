import { Facebook, Twitter, Instagram, Mail, Search } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 w-full bg-black border-t border-white/10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 z-50 text-[9px] tracking-widest uppercase font-bold text-white/40 py-3 md:py-0 md:h-12 gap-3 md:gap-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="flex-1 flex items-center justify-center md:justify-start gap-2">
        <span className="hidden md:inline">&copy; {year} RAW ARCHIVES RECORDS N.V. ALL RIGHTS RESERVED.</span>
        <span className="md:hidden">&copy; {year} RAW ARCHIVES</span>
      </div>

      <div className="flex-1 flex justify-center items-center gap-6">
        <a href="#" className="hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Facebook className="w-4 h-4 md:w-3 md:h-3" /></a>
        <a href="#" className="hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Twitter className="w-4 h-4 md:w-3 md:h-3" /></a>
        <a href="#" className="hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Instagram className="w-4 h-4 md:w-3 md:h-3" /></a>
        <a href="#" className="hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Mail className="w-4 h-4 md:w-3 md:h-3" /></a>
        <a href="#" className="hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Search className="w-4 h-4 md:w-3 md:h-3" /></a>
      </div>

      <div className="flex-1 flex justify-center md:justify-end gap-6">
        <Link href="/terms-of-service" className="hover:text-white transition-colors min-h-[44px] flex items-center" data-testid="link-terms">Terms of Service</Link>
        <Link href="/privacy-policy" className="hover:text-white transition-colors min-h-[44px] flex items-center" data-testid="link-privacy">Privacy Policy</Link>
        <Link href="/cookie-choices" className="hover:text-white transition-colors min-h-[44px] flex items-center" data-testid="link-cookies">Cookie Choices</Link>
      </div>
    </footer>
  );
}
