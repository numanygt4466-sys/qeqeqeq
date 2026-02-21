import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal, PlayCircle, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");

  const releases = [
    { id: "RAW-004", title: "Global Expansion", artist: "Void Circuit", type: "Single", status: "Live", date: "Nov 24, 2024", streams: "1.2M", revenue: "$4,250" },
    { id: "RAW-003", title: "Concrete Pulse", artist: "V/A", type: "Compilation", status: "Pending", date: "Dec 15, 2024", streams: "-", revenue: "-" },
    { id: "RAW-002", title: "Static Decay", artist: "Nihil", type: "EP", status: "Live", date: "Sep 12, 2024", streams: "850K", revenue: "$2,980" },
    { id: "RAW-001", title: "First Impact", artist: "Kredence", type: "Single", status: "Rejected", date: "Jul 05, 2024", streams: "-", revenue: "-" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Live": return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "Pending": return <Clock className="w-3 h-3 text-yellow-500" />;
      case "Rejected": return <XCircle className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Release Management</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Catalog</h1>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 text-xs font-black tracking-[0.2em] uppercase">
          New Release
        </Button>
      </header>

      <Card className="bg-black border-white/5 rounded-none">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, artist, or ISRC..." 
                className="bg-white/5 border-white/10 rounded-none pl-10 h-10 text-xs focus:border-white focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" className="border-white/10 rounded-none h-10 px-4 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all flex-1 sm:flex-none">
                <Filter className="w-3 h-3 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                  <th className="p-4 font-medium">Release</th>
                  <th className="p-4 font-medium">Artist</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Release Date</th>
                  <th className="p-4 font-medium text-right">Streams</th>
                  <th className="p-4 font-medium text-right">Revenue</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {releases.map((release) => (
                  <tr key={release.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#111] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                          <PlayCircle className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-tight">{release.title}</div>
                          <div className="text-[10px] text-white/40 font-mono">{release.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 uppercase tracking-widest text-[11px] text-white/80">{release.artist}</td>
                    <td className="p-4 text-[10px] tracking-widest uppercase text-white/60">{release.type}</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 px-2 py-1 border border-white/10 text-[9px] font-bold tracking-widest uppercase bg-black">
                        {getStatusIcon(release.status)}
                        {release.status}
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-white/60 uppercase tracking-widest">{release.date}</td>
                    <td className="p-4 text-right font-mono text-xs">{release.streams}</td>
                    <td className="p-4 text-right font-mono text-xs text-green-500">{release.revenue}</td>
                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-white hover:text-black transition-colors rounded-sm text-white/40">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
            <span>Showing 1 to {releases.length} of {releases.length} entries</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="rounded-none border-white/10 h-8 px-3 text-[9px]">Prev</Button>
              <Button variant="outline" size="sm" disabled className="rounded-none border-white/10 h-8 px-3 text-[9px]">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}