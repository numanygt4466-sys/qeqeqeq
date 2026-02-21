import { motion } from "framer-motion";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";

const RELEASES = [
  { id: "01", title: "CONCRETE PULSE", artist: "V/A", image: release1, platform: "Spotify" },
  { id: "02", title: "STATIC DECAY", artist: "NIHIL", image: release2, platform: "Apple Music" },
  { id: "03", title: "FIRST IMPACT", artist: "KREDENCE", image: release3, platform: "Tidal" },
  { id: "04", title: "VOID CIRCUIT", artist: "VOID CIRCUIT", image: release1, platform: "Soundcloud" },
];

export default function Catalog() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6">
        <header className="mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Archive</span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6">Catalog</h1>
          <div className="h-[1px] w-20 bg-primary"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {RELEASES.map((release, i) => (
            <motion.div 
              key={release.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
              data-testid={`catalog-item-${release.id}`}
            >
              <div className="relative aspect-square overflow-hidden mb-6 border border-white/5 bg-muted">
                <img 
                  src={release.image} 
                  alt={release.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="flex gap-4">
                    {/* Placeholder streaming icons */}
                    <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white flex items-center justify-center transition-colors">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white flex items-center justify-center transition-colors">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-display font-bold text-lg uppercase tracking-tight">{release.title}</h3>
                  <span className="font-mono text-[10px] text-primary">{release.id}</span>
                </div>
                <p className="text-white/40 text-sm uppercase tracking-widest">{release.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}