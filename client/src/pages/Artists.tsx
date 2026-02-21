import { motion } from "framer-motion";
import artist1 from "@/assets/images/release-1.png";

const ARTISTS = [
  { name: "VOID CIRCUIT", genre: "Industrial / Techno", bio: "Hailing from the Berlin underground, Void Circuit merges raw analog synth textures with punishing industrial rhythms." },
  { name: "NIHIL", genre: "Ambient / Drone", bio: "Cinematic soundscapes that explore the void between silence and noise. A study in minimalist sonic architecture." },
  { name: "KREDENCE", genre: "Experimental Electronic", bio: "Pushing the boundaries of rhythmic complexity and digital synthesis. The next evolution of the RAW sound." },
  { name: "ARCANE", genre: "Leftfield House", bio: "Deep, moody, and undeniably groovy. Arcane defines the sophisticated edge of independent dance music." },
];

export default function Artists() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6">
        <header className="mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Roster</span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6">Artists</h1>
          <p className="text-white/40 max-w-xl">A curated selection of visionaries defining the next generation of sound.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {ARTISTS.map((artist, i) => (
            <motion.div 
              key={artist.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-12 hover:bg-muted/50 transition-colors group relative overflow-hidden"
              data-testid={`artist-card-${i}`}
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 grayscale group-hover:grayscale-0 transition-all border border-white/10">
                  <img src={artist1} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-4xl font-display font-bold mb-2 tracking-tighter">{artist.name}</h2>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-6 block">{artist.genre}</span>
                  <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">{artist.bio}</p>
                  <div className="flex gap-4">
                    <button className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all">Listen</button>
                    <button className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all">Profile</button>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 right-10 text-[100px] font-black opacity-[0.02] pointer-events-none select-none italic group-hover:opacity-[0.05] transition-opacity">0{i+1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}