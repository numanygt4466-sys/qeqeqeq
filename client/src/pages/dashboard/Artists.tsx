import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Music, BarChart2 } from "lucide-react";

export default function Artists() {
  const artists = [
    { name: "Void Circuit", genre: "Industrial Techno", releases: 4, streams: "2.1M", status: "Active" },
    { name: "Nihil", genre: "Ambient / Drone", releases: 2, streams: "850K", status: "Active" },
    { name: "Kredence", genre: "Experimental", releases: 1, streams: "120K", status: "Development" },
    { name: "Arcane", genre: "Leftfield House", releases: 0, streams: "0", status: "Onboarding" },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Roster Management</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Artists</h1>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Artist
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            placeholder="Search artists..." 
            className="bg-black border-white/10 rounded-none pl-10 h-12 text-sm focus:border-white focus:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {artists.map((artist, i) => (
          <Card key={i} className="bg-black border-white/5 rounded-none group hover:border-white/20 transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
               <button className="w-8 h-8 bg-white text-black flex items-center justify-center hover:bg-white/80">
                  <BarChart2 className="w-4 h-4" />
               </button>
            </div>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-[#111] border border-white/10 flex items-center justify-center mb-6 text-2xl font-black tracking-tighter text-white/20 uppercase group-hover:text-white group-hover:border-white/30 transition-all">
                {artist.name.substring(0, 2)}
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-1">{artist.name}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">{artist.genre}</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Releases</span>
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <Music className="w-3 h-3 text-white/40" /> {artist.releases}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Total Streams</span>
                  <div className="flex items-center gap-2 text-sm font-mono text-green-500">
                    <BarChart2 className="w-3 h-3 text-white/40" /> {artist.streams}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${artist.status === 'Active' ? 'border-green-500/20 text-green-500' : 'border-white/10 text-white/60'}`}>
                  {artist.status}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">View Profile →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}