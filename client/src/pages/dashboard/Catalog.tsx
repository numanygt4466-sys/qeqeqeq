import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, Plus, Music, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: releases = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/releases"],
  });

  const filtered = releases.filter((r: any) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.primaryArtist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getStatusPill = (status: string) => {
    if (status === "approved") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Released</span>;
    if (status === "rejected") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-catalog-title">Catalog</h1>
          <p className="text-gray-600 mt-1">Manage your releases</p>
        </div>
        <Link href="/app/upload">
          <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium inline-flex items-center gap-2" data-testid="button-new-release">
            <Plus className="w-4 h-4" /> Create Product
          </button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by title or artist..."
              className="pl-10 h-9 text-sm border-gray-200 rounded-md"
              data-testid="input-search-catalog"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Releases</h3>
            <p className="text-sm text-gray-600 mb-4">Submit your first release to get started</p>
            <Link href="/app/upload">
              <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium">
                Create Release
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Artist</th>
                    <th className="px-4 py-3 text-left">Release Date</th>
                    <th className="px-4 py-3 text-left">Tracks</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((release: any) => (
                    <tr key={release.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-testid={`row-catalog-${release.id}`}>
                      <td className="px-4 py-3 text-gray-600 capitalize">{release.releaseType}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {release.coverArtUrl ? (
                            <img src={release.coverArtUrl} alt={release.title} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Music className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{release.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{release.primaryArtist}</td>
                      <td className="px-4 py-3 text-gray-600">{release.releaseDate}</td>
                      <td className="px-4 py-3 text-gray-600">{release.trackCount ?? "—"}</td>
                      <td className="px-4 py-3">{getStatusPill(release.status)}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-400" data-testid={`button-menu-${release.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
              <span>{filtered.length} release{filtered.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
