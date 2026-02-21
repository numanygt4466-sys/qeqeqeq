export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 w-full h-12 bg-black/80 backdrop-blur-sm border-t border-white/10 flex items-center justify-between px-6 md:px-12 z-50 text-[9px] tracking-widest uppercase font-bold text-white/40">
      <div className="flex-1">
        &copy; {year} RAW ARCHIVES MUSIC GROUP. ALL RIGHTS RESERVED.
      </div>

      <div className="flex-1 flex justify-center gap-6">
        <a href="#" className="hover:text-white transition-colors">FB</a>
        <a href="#" className="hover:text-white transition-colors">X</a>
        <a href="#" className="hover:text-white transition-colors">IG</a>
        <a href="#" className="hover:text-white transition-colors">YT</a>
      </div>

      <div className="flex-1 flex justify-end gap-4">
        <a href="#" className="hover:text-white transition-colors">TERMS</a>
        <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
        <a href="#" className="hover:text-white transition-colors">COOKIES</a>
      </div>
    </footer>
  );
}