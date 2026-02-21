import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import heroEditorial from "@/assets/images/hero-editorial.png";
import release1 from "@/assets/images/release-1.png";
import release2 from "@/assets/images/release-2.png";
import release3 from "@/assets/images/release-3.png";
import virginMusicLogo from "@assets/Virgin_Music_Group.svg_1771701368920.png";
import { ChevronRight, Play, Globe, ChevronUp, ChevronDown } from "lucide-react";

export default function Home() {
  const { data: newsPosts = [] } = useQuery<any[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="bg-black min-h-screen">
      {/* Universal-style Hero Section */}
      <section className="relative w-full h-screen overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroEditorial} 
            alt="Featured Artist" 
            className="w-full h-full object-cover grayscale transition-transform duration-[20s] scale-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Right Side Navigation Arrows */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-px">
          <button className="w-12 h-12 bg-black flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-black flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-end items-center pb-24">
          <h2 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-[#00AEEF] drop-shadow-sm">ARCANE</h2>
        </div>
      </section>

      {/* Editorial News Grid - UMG Style */}
      <section className="py-24 px-6 md:px-24">
        <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Latest News</h2>
          <Link href="/news" className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase group">
            All News <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {newsPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <Link href={`/news/${newsPosts[0].id}`} className="md:col-span-8 group cursor-pointer block" data-testid="card-featured-news">
              <div className="aspect-[16/8] overflow-hidden mb-8 bg-[#111]">
                {newsPosts[0].imageUrl ? (
                  <img src={newsPosts[0].imageUrl} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:scale-105 group-hover:brightness-100" alt={newsPosts[0].title} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
                    <span className="text-[80px] md:text-[120px] font-black text-white/5 uppercase tracking-tighter select-none">NEWS</span>
                  </div>
                )}
              </div>
              <div className="max-w-2xl">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mb-4 block">
                  {newsPosts[0].publishedAt ? new Date(newsPosts[0].publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'News'}
                </span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-6 leading-tight group-hover:underline underline-offset-8" data-testid="text-featured-news-title">
                  {newsPosts[0].title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {newsPosts[0].excerpt || newsPosts[0].content?.substring(0, 200) + '...'}
                </p>
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white pb-1 border-b-2 border-white inline-block">Read Article</span>
              </div>
            </Link>

            <div className="md:col-span-4 flex flex-col gap-12 border-l-0 pl-0 md:border-l md:border-white/5 md:pl-12">
              {newsPosts.slice(1, 3).map((post: any, i: number) => (
                <Link href={`/news/${post.id}`} key={post.id} className="group cursor-pointer block" data-testid={`card-news-${post.id}`}>
                  <div className="aspect-video overflow-hidden mb-6 bg-[#111]">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center">
                        <span className="text-[40px] font-black text-white/5 uppercase tracking-tighter select-none">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] mb-3 block">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'News'}
                  </span>
                  <h3 className="text-lg font-black tracking-tight uppercase leading-tight group-hover:text-white/80 transition-colors">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8 group cursor-pointer">
              <div className="aspect-[16/8] overflow-hidden mb-8 bg-[#111]">
                <img src={release1} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:scale-105 group-hover:brightness-100" alt="Global News" />
              </div>
              <div className="max-w-2xl">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mb-4 block">Corporate Announcement</span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-6 leading-tight group-hover:underline underline-offset-8">Raw Archives Records Launches Strategic Partnership with Independent Innovators</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">The expansion marks a significant milestone in providing global infrastructure to the independent sector, bridging the gap between artistic freedom and institutional power.</p>
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white pb-1 border-b-2 border-white inline-block">Read Article</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-12 border-l-0 pl-0 md:border-l md:border-white/5 md:pl-12">
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
        )}
      </section>

      {/* Corporate Capabilities - UMG Philosophy */}
      <section className="py-16 md:py-32 px-6 md:px-24 bg-[#050505] border-t border-white/5">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
           <div className="col-span-12 md:col-span-5">
              <span className="text-[10px] tracking-[0.5em] font-bold text-white/40 uppercase mb-8 block">Our Leadership</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">The Power of Independence.</h2>
              <p className="text-white/40 leading-relaxed mb-12 max-w-md">We define the future of music through transparency, technology, and unconditional support for independent visionaries worldwide.</p>
              <button className="border-2 border-white px-10 py-4 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
                About the Group
              </button>
           </div>
           <div className="col-span-12 md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { title: 'Distribution', stat: '60 Markets' },
                { title: 'Publishing', stat: 'Direct Admin' },
                { title: 'Technology', stat: 'Real-time API' },
                { title: 'Marketing', stat: 'Global Strategy' }
              ].map((item) => (
                <div key={item.title} className="bg-black p-6 md:p-12 hover:bg-[#111] transition-all group cursor-pointer">
                   <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/40 mb-4 block group-hover:text-white transition-colors">{item.title}</span>
                   <div className="text-xl md:text-2xl font-black tracking-tighter uppercase">{item.stat}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Global Presence Banner */}
      <section className="h-[40vh] relative flex items-center justify-center border-t border-white/5 overflow-hidden">
         <div className="absolute inset-0 bg-[#080808] opacity-50" />
         <div className="relative z-10 flex flex-col items-center px-6">
            <Globe className="w-12 h-12 text-white/20 mb-6 animate-pulse" />
            <h4 className="text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-white/40 text-center">Global Headquarters: New York • London • Berlin • Tokyo</h4>
         </div>
      </section>
      
      <section className="py-20 px-6 md:px-24 border-t border-white/5">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/40 mb-8">Our Official Distribution Partner</span>
          <img
            src={virginMusicLogo}
            alt="Virgin Records"
            className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity"
            data-testid="img-distribution-partner"
          />
        </div>
      </section>

      <div className="h-12"></div>
    </div>
  );
}
