import { Link } from "wouter";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";

const RELEASES = [
  { id: "RAW-004", title: "MACHINE LEARNING", artist: "VOID CIRCUIT", format: "12\" VINYL / DIGITAL", image: release1, date: "NOV 2024", genre: "INDUSTRIAL TECHNO" },
  { id: "RAW-003", title: "CONCRETE PULSE", artist: "V/A", format: "DIGITAL COMPILATION", image: release1, date: "OCT 2024", genre: "EXPERIMENTAL" },
  { id: "RAW-002", title: "STATIC DECAY", artist: "NIHIL", format: "CASSETTE / DIGITAL", image: release2, date: "SEP 2024", genre: "DARK AMBIENT" },
  { id: "RAW-001", title: "FIRST IMPACT", artist: "KREDENCE", format: "12\" VINYL / DIGITAL", image: release3, date: "JUL 2024", genre: "HARD TECHNO" },
];

export default function Releases() {
  return (
    <div className="min-h-screen pb-24 bg-grain">
      <header className="py-20 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">RELEASES</h1>
          <p className="font-mono text-muted-foreground">THE COMPLETE ARCHIVE [ {RELEASES.length} ENTRIES ]</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {RELEASES.map((release) => (
            <article key={release.id} className="group grid grid-cols-1 md:grid-cols-2 gap-8 border border-transparent hover:border-border p-4 transition-colors" data-testid={`release-item-${release.id}`}>
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img 
                  src={release.image} 
                  alt={release.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm bg-foreground text-background px-2 py-0.5">{release.id}</span>
                    <span className="font-mono text-xs text-muted-foreground">{release.date}</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-1 uppercase">{release.title}</h2>
                  <h3 className="text-xl text-muted-foreground font-medium mb-6">{release.artist}</h3>
                  
                  <div className="space-y-2 font-mono text-xs text-muted-foreground mb-8">
                    <p className="flex justify-between border-b border-border/50 pb-1">
                      <span>FORMAT:</span> <span>{release.format}</span>
                    </p>
                    <p className="flex justify-between border-b border-border/50 pb-1">
                      <span>GENRE:</span> <span>{release.genre}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <a href="#" className="font-mono text-sm underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors" data-testid={`link-listen-${release.id}`}>
                    LISTEN
                  </a>
                  <a href="#" className="font-mono text-sm underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors" data-testid={`link-buy-${release.id}`}>
                    PURCHASE
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}