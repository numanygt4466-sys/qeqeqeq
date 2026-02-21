import { Link } from "wouter";
import heroBg from "@/assets/images/hero-bg.png";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";
import { Button } from "@/components/ui/button";

const LATEST_RELEASES = [
  { id: "RAW-003", title: "CONCRETE PULSE", artist: "V/A", image: release1, date: "OCT 2024" },
  { id: "RAW-002", title: "STATIC DECAY", artist: "NIHIL", image: release2, date: "SEP 2024" },
  { id: "RAW-001", title: "FIRST IMPACT", artist: "KREDENCE", image: release3, date: "JUL 2024" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-grain">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Raw Archives Texture" 
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-4 text-xs font-mono tracking-[0.3em] text-muted-foreground uppercase border border-muted-foreground/30 px-3 py-1 inline-block">
            System Online
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6 drop-shadow-lg">
            Raw<br/>Archives
          </h1>
          <p className="text-lg md:text-xl font-mono text-muted-foreground max-w-2xl mb-10">
            A PLATFORM FOR INDUSTRIAL, EXPERIMENTAL, AND RAW SONIC EXPLORATION.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-none font-mono tracking-widest bg-foreground text-background hover:bg-muted-foreground hover-invert" data-testid="button-listen-now">
              <Link href="/releases">LISTEN NOW</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none font-mono tracking-widest border-border hover:bg-border" data-testid="button-view-artists">
              <Link href="/artists">ROSTER</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Releases Marquee/Section */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
            <h2 className="text-3xl font-bold tracking-tighter">LATEST ARCHIVES</h2>
            <Link href="/releases" className="font-mono text-sm hover:underline decoration-1 underline-offset-4" data-testid="link-view-all-releases">
              VIEW ALL [→]
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LATEST_RELEASES.map((release) => (
              <Link key={release.id} href={`/releases`} className="group group block" data-testid={`card-release-${release.id}`}>
                <div className="relative aspect-square overflow-hidden border border-border mb-4 bg-muted">
                  <img 
                    src={release.image} 
                    alt={`${release.title} by ${release.artist}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="font-mono text-sm border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">EXPLORE</span>
                  </div>
                </div>
                <div className="flex justify-between items-start font-mono text-sm">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-muted-foreground transition-colors">{release.title}</h3>
                    <p className="text-muted-foreground">{release.artist}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-muted-foreground">{release.id}</span>
                    <span className="text-xs text-muted-foreground/60">{release.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto / About Snippet */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-mono text-sm text-muted-foreground tracking-[0.2em] mb-8">STATEMENT OF INTENT</h2>
          <p className="text-2xl md:text-4xl font-medium leading-tight tracking-tight mb-12">
            WE EXIST TO DOCUMENT THE UNDOCUMENTED. TO ARCHIVE THE NOISE. TO PROVIDE A PLATFORM FOR FREQUENCIES THAT DEFY CONVENTION.
          </p>
          <Button asChild variant="outline" className="rounded-none font-mono" data-testid="button-read-manifesto">
            <Link href="/about">READ FULL MANIFESTO</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}