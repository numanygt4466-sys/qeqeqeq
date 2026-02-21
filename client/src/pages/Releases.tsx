import { Link } from "wouter";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";

const RELEASES = [
  { id: "RAW-004", title: "Global Expansion", category: "Corporate", image: release1, date: "NOV 2024", summary: "Raw Archives partners with major streaming platforms for enhanced artist visibility." },
  { id: "RAW-003", title: "New Studio Opening", category: "Infrastructure", image: release1, date: "OCT 2024", summary: "State-of-the-art recording facilities now available for our global roster." },
  { id: "RAW-002", title: "Tech Innovation", category: "Technology", image: release2, date: "SEP 2024", summary: "Launching our proprietary analytics dashboard for independent labels." },
  { id: "RAW-001", title: "Artist Spotlight", category: "Talent", image: release3, date: "JUL 2024", summary: "Celebrating the chart-topping success of our latest independent signings." },
];

export default function Releases() {
  return (
    <div className="min-h-screen pb-24 bg-white">
      <header className="py-24 border-b border-border bg-secondary">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4">News & Updates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">The latest from Raw Archives Records — global insights, artist news, and corporate updates.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {RELEASES.map((release) => (
            <article key={release.id} className="group cursor-pointer" data-testid={`news-item-${release.id}`}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                <img 
                  src={release.image} 
                  alt={release.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {release.category}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-primary text-sm mb-2 block">{release.date}</span>
                <h2 className="text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">{release.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{release.summary}</p>
                <Link href="#" className="font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  READ MORE <span className="text-primary">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}