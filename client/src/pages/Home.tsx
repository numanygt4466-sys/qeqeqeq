import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/images/hero-virgin.png";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="RAW ARCHIVES Visual" 
            className="w-full h-full object-cover grayscale opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-cinematic" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-[10rem] font-display font-black tracking-tighter leading-none mb-4 uppercase text-gradient">
              RAW<br/>ARCHIVES
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/60 tracking-widest uppercase mb-12 max-w-3xl mx-auto">
              Independent Music. Global Infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-10 h-14 text-sm font-bold tracking-[0.2em] uppercase" data-testid="button-hero-submit">
                <Link href="/submissions">Submit Your Music</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white hover:text-black rounded-none px-10 h-14 text-sm font-bold tracking-[0.2em] uppercase transition-all" data-testid="button-hero-partner">
                <Link href="/about">Partner With Us</Link>
              </Button>
              <Button asChild variant="ghost" className="text-white/60 hover:text-white uppercase tracking-widest text-xs font-bold" data-testid="button-hero-catalog">
                <Link href="/catalog">Explore Catalog</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-10 flex items-center gap-4 animate-pulse">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Global Node: Active</span>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-background relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Our Mission</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
                Empowering the Underground with Global Scale.
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-8">
                RAW ARCHIVES is a next-generation music company bridging the gap between artistic freedom and industrial power. We provide independent artists with the global infrastructure typically reserved for major labels, without compromising the raw, creative essence of their sound.
              </p>
              <div className="grid grid-cols-2 gap-8 font-display">
                <div>
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">Artist Ownership</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">Global Support</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-12 aspect-square flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">The RAW Edge</h3>
              <ul className="space-y-6">
                {[
                  "Global DSP distribution in 120+ territories",
                  "Direct-to-Artist rights management",
                  "Advanced publishing & sync licensing",
                  "Real-time analytics & transparency",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 mt-1 border border-primary flex items-center justify-center text-[10px] text-primary">✓</div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Full-Spectrum Label Services</h2>
            <p className="text-white/40">From distribution to global branding, we provide a complete ecosystem for the modern independent label.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Music Distribution", desc: "Global DSP delivery to Spotify, Apple, Tidal and 100+ others.", icon: "🌐" },
              { title: "Royalty Dashboard", desc: "Advanced real-time analytics and transparent metadata control.", icon: "📊" },
              { title: "Rights Management", desc: "Total control over your intellectual property and publishing.", icon: "⚖️" },
              { title: "Artist Development", desc: "Cinematic branding and strategic growth marketing.", icon: "⚡" }
            ].map((service, i) => (
              <div key={i} className="glass-card p-8 group hover:bg-primary/10 transition-colors">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}