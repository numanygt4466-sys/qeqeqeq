import { Link } from "wouter";
import heroBg from "@/assets/images/hero-bg.png";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-tight mb-8">
              Empowering Independent Music Worldwide.
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
              We provide the tools, technology, and team to help artists and labels reach their global potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg" data-testid="button-hero-primary">
                Explore Solutions
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-8 h-14 text-lg" data-testid="button-hero-secondary">
                View Roster
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Distribution", desc: "Global reach to 100+ digital platforms with advanced analytics." },
              { title: "Marketing", desc: "Data-driven campaigns to grow your audience and influence." },
              { title: "Label Services", desc: "Tailored support for established labels and emerging talent." }
            ].map((service, i) => (
              <div key={i} className="group p-8 border border-border rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 font-bold">0{i+1}</div>
                <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-display font-bold tracking-tight">Latest News</h2>
            <Link href="/releases" className="text-primary font-semibold hover:underline">View All News</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl cursor-pointer">
              <img src={release1} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="text-primary font-bold mb-2 uppercase tracking-widest text-sm">Partnership</span>
                <h3 className="text-3xl font-bold text-white">Raw Archives Expands Global Distribution Network</h3>
              </div>
            </div>
            <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl cursor-pointer">
              <img src={release2} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="text-primary font-bold mb-2 uppercase tracking-widest text-sm">Artist News</span>
                <h3 className="text-3xl font-bold text-white">New Signing: VOID CIRCUIT Joins the Archive</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}