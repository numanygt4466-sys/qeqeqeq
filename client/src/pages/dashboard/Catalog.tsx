import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlayCircle, Clock, CheckCircle, XCircle, UploadCloud } from "lucide-react";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: releases = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/releases"],
  });

  const filtered = releases.filter((r: any) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.primaryArtist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="w-3 h-3 text-green-500" />;
    if (status === "pending") return <Clock className="w-3 h-3 text-yellow-500" />;
    if (status === "rejected") return <XCircle className="w-3 h-3 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Release Management</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" data-testid="text-catalog-title">Catalog</h1>
        </div>
        <Link href="/app/upload">
          <Button className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 text-xs font-black tracking-[0.2em] uppercase" data-testid="button-new-release">
            <UploadCloud className="w-4 h-4 mr-2" /> New Release
          </Button>
        </Link>
      </header>

      <Card className="bg-black border-white/5 rounded-none">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or artist..." 
              className="bg-white/5 border-white/10 rounded-none pl-10 h-10 text-xs focus:border-white focus:ring-0"
              data-testid="input-search-catalog"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <PlayCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">No Releases</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-6">Submit your first release to get started</p>
              <Link href="/app/upload">
                <Button className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 text-xs font-black tracking-[0.2em] uppercase">
                  Create Release
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                      <th className="p-4 font-medium">Release</th>
                      <th className="p-4 font-medium">Artist</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Release Date</th>
                      <th className="p-4 font-medium">Genre</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filtered.map((release: any) => (
                      <tr key={release.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-catalog-${release.id}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#111] border border-white/10 flex items-center justify-center">
                              <PlayCircle className="w-4 h-4 text-white/20" />
                            </div>
                            <div>
                              <div className="font-bold uppercase tracking-tight">{release.title}</div>
                              <div className="text-[10px] text-white/40 font-mono">ID-{release.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 uppercase tracking-widest text-[11px] text-white/80">{release.primaryArtist}</td>
                        <td className="p-4 text-[10px] tracking-widest uppercase text-white/60">{release.releaseType}</td>
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 px-2 py-1 border border-white/10 text-[9px] font-bold tracking-widest uppercase bg-black">
                            {getStatusIcon(release.status)}
                            {release.status}
                          </div>
                        </td>
                        <td className="p-4 text-[11px] text-white/60 uppercase tracking-widest">{release.releaseDate}</td>
                        <td className="p-4 text-[10px] text-white/60 uppercase tracking-widest">{release.genre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-white/40">
                {filtered.length} release{filtered.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
