export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 mt-24">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-bold text-lg mb-4 tracking-tighter">RAW ARCHIVES</h2>
          <p className="text-muted-foreground font-mono text-xs max-w-xs leading-relaxed">
            Independent record label and sonic archive. <br />
            Curating raw, industrial, and experimental soundscapes.
            Established 2024.
          </p>
        </div>
        
        <div>
          <h3 className="font-mono text-sm font-bold mb-4">CONNECT</h3>
          <ul className="space-y-2 font-mono text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-social">BANDCAMP</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-social">SOUNDCLOUD</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-social">INSTAGRAM</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-social">TWITTER</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-sm font-bold mb-4">LEGAL</h3>
          <ul className="space-y-2 font-mono text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-legal">TERMS</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-legal">PRIVACY</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-legal">DEMOS</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-legal">CONTACT</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs font-mono text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RAW ARCHIVES. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 md:mt-0">SYSTEM: 1.0.4</p>
      </div>
    </footer>
  );
}