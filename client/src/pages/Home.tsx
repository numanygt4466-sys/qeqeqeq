import { Link } from "wouter";
import heroEditorial from "@/assets/images/hero-editorial.png";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";
import { ChevronRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Universal-style Hero Slider Section */}
      <section className="relative w-full aspect-[21/9] min-h-[600px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroEditorial} 
            alt="Featured Artist" 
            className="w-full h-full object-cover grayscale transition-transform duration-[20s] scale-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
               <span className="w-12 h-[1px] bg-white/40"></span>
               <span className="text-[10px] tracking-[0.5em] font-bold text-white/60 uppercase">Featured Spotlight</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.85]">ARCANE</h2>
            <p className="text-sm md:text-lg text-white/60 max-w-lg mb-10 leading-relaxed font-medium">
              Global independent tour dates announced. Experience the evolution of the independent frontier.
            </p>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white/5 transition-all">
                <Play className="w-4 h-4 fill-current" /> Watch Trailer
              </button>
            </div>
          </div>
        </div>

        {/* Pager Dots */}
        <div className="absolute bottom-10 right-24 flex gap-3 z-20">
           {[0, 1, 2, 3].map((i) => (
             <button key={i} className={`w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-white w-8' : 'bg-white/20 hover:bg-white/40'}`} />
           ))}
        </div>
      </section>

      {/* Editorial News Grid - UMG Style */}
      <section className="py-24 px-6 md:px-24">
        <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Latest News</h2>
          <Link href="/news" className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase group">
            All News <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Main News Card */}
          <div className="md:col-span-8 group cursor-pointer">
            <div className="aspect-[16/8] overflow-hidden mb-8 bg-[#111]">
              <img src={release1} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:scale-105 group-hover:brightness-100" alt="Global News" />
            </div>
            <div className="max-w-2xl">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mb-4 block">Corporate Announcement</span>
              <h3 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-tight group-hover:underline underline-offset-8">Raw Archives Music Group Launches Strategic Partnership with Independent Innovators</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">The expansion marks a significant milestone in providing global infrastructure to the independent sector, bridging the gap between artistic freedom and institutional power.</p>
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white pb-1 border-b-2 border-white inline-block">Read Article</span>
            </div>
          </div>

          {/* Secondary News Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-12 border-l border-white/5 pl-12">
            {[
              { title: "Arcane's 'Void' Certified Platinum in Global Markets", category: "Milestone", img: release2 },
              { title: "2024 Artist Development Grant Recipients Announced", category: "Community", img: release3 }
            ].map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video overflow-hidden mb-6 bg-[#111]">
                   <img src={news.img} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" alt={news.title} />
                </div>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] mb-3 block">{news.category}</span>
                <h3 className="text-lg font-black tracking-tight uppercase leading-tight group-hover:text-white/80 transition-colors">{news.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Capabilities - UMG Philosophy */}
      <section className="py-32 px-6 md:px-24 bg-[#050505] border-t border-white/5">
        <div className="editorial-grid">
           <div className="col-span-12 md:col-span-5">
              <span className="text-[10px] tracking-[0.5em] font-bold text-white/40 uppercase mb-8 block">Our Leadership</span>
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">The Power of Independence.</h2>
              <p className="text-white/40 leading-relaxed mb-12 max-w-md">We define the future of music through transparency, technology, and unconditional support for independent visionaries worldwide.</p>
              <button className="border-2 border-white px-10 py-4 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
                About the Group
              </button>
           </div>
           <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { title: 'Distribution', stat: '120+ Markets' },
                { title: 'Publishing', stat: 'Direct Admin' },
                { title: 'Technology', stat: 'Real-time API' },
                { title: 'Marketing', stat: 'Global Strategy' }
              ].map((item) => (
                <div key={item.title} className="bg-black p-12 hover:bg-[#111] transition-all group cursor-pointer">
                   <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/40 mb-4 block group-hover:text-white transition-colors">{item.title}</span>
                   <div className="text-2xl font-black tracking-tighter uppercase">{item.stat}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Global Presence Banner */}
      <section className="h-[40vh] relative flex items-center justify-center border-t border-white/5 overflow-hidden">
         <div className="absolute inset-0 bg-[#080808] opacity-50" />
         <div className="relative z-10 flex flex-col items-center">
            <Globe className="w-12 h-12 text-white/20 mb-6 animate-pulse" />
            <h4 className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">Global Headquarters: New York • London • Berlin • Tokyo</h4>
         </div>
      </section>
      
      <div className="h-12"></div>
    </div>
  );
}