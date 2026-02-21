import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  Music, Clock, Search, ChevronRight, CalendarDays,
  Plus, CheckCircle2, AlertCircle, XCircle, ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarFilter, setCalendarFilter] = useState<"upcoming" | "previous">("upcoming");

  const { data: releases = [] } = useQuery<any[]>({ queryKey: ["/api/releases"] });
  const { data: tickets = [] } = useQuery<any[]>({ queryKey: ["/api/tickets"] });

  const pendingReleases = releases.filter((r: any) => r.status === "pending");
  const approvedReleases = releases.filter((r: any) => r.status === "approved");
  const rejectedReleases = releases.filter((r: any) => r.status === "rejected");

  const today = new Date();
  const upcomingReleases = releases.filter((r: any) => new Date(r.releaseDate) >= today);
  const previousReleases = releases.filter((r: any) => new Date(r.releaseDate) < today);
  const calendarReleases = calendarFilter === "upcoming" ? upcomingReleases : previousReleases;

  const filteredReleases = searchQuery.trim()
    ? releases.filter((r: any) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.primaryArtist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      day: d.getDate().toString(),
    };
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    if (status === "rejected") return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    return <Clock className="w-3.5 h-3.5 text-amber-500" />;
  };

  const getStatusLabel = (status: string) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending Review";
  };

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-5">
          <div>
            <p className="text-gray-500 text-sm">Hello,</p>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dashboard-title">{firstName}!</h1>
          </div>

          <div className="relative" data-testid="search-wrapper">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your releases, artists, songs..."
              className="pl-10 h-11 text-sm text-gray-900 bg-white border-gray-300 rounded-lg shadow-sm"
              data-testid="input-search"
            />
          </div>

          {filteredReleases && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="search-results">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Search Results ({filteredReleases.length})
                </p>
              </div>
              {filteredReleases.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No results found</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredReleases.slice(0, 8).map((rel: any) => (
                    <div key={rel.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      {rel.coverArtUrl ? (
                        <img src={rel.coverArtUrl} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Music className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{rel.title}</p>
                        <p className="text-xs text-gray-500">{rel.primaryArtist}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {getStatusIcon(rel.status)}
                        {getStatusLabel(rel.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap" data-testid="quick-links">
            <Link href="/app/catalog" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1" data-testid="quick-link-releases">
              Releases <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/app/earnings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1" data-testid="quick-link-earnings">
              Earnings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/app/support" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1" data-testid="quick-link-support">
              Support <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="card-stats">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Overview</h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="px-5 py-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{releases.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Releases</p>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{pendingReleases.length}</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
              <div className="px-5 py-4 text-center">
                <p className="text-2xl font-bold text-green-600">{approvedReleases.length}</p>
                <p className="text-xs text-gray-500 mt-1">Approved</p>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-2xl font-bold text-red-500">{rejectedReleases.length}</p>
                <p className="text-xs text-gray-500 mt-1">Rejected</p>
              </div>
            </div>
          </div>

          {tickets.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="card-notifications">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Notifications</h3>
                <Link href="/app/support" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {tickets.slice(0, 3).map((t: any) => (
                  <div key={t.id} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${t.status === "closed" ? "bg-green-400" : t.status === "open" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{t.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" data-testid="card-calendar">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Calendar</h2>
          </div>
          <div className="flex items-center bg-gray-100 rounded-md p-0.5">
            <button
              onClick={() => setCalendarFilter("upcoming")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                calendarFilter === "upcoming" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid="button-calendar-upcoming"
            >
              Upcoming
            </button>
            <button
              onClick={() => setCalendarFilter("previous")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                calendarFilter === "previous" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid="button-calendar-previous"
            >
              Previous
            </button>
          </div>
        </div>

        <div className="px-5 py-2">
          <p className="text-xs text-gray-500">
            {calendarFilter === "upcoming" ? "Upcoming" : "Previous"}{" "}
            <strong>releases and distribution dates.</strong>
          </p>
        </div>

        {calendarReleases.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">No {calendarFilter} releases</p>
            <p className="text-xs text-gray-400 mb-4">
              {calendarFilter === "upcoming" ? "Submit a new release to see it here." : "Your previous releases will appear here."}
            </p>
            {calendarFilter === "upcoming" && (
              <Link href="/app/upload">
                <button className="inline-flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium transition-colors" data-testid="button-create-release">
                  <Plus className="w-4 h-4" /> Create Release
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {calendarReleases
              .sort((a: any, b: any) => {
                const dateA = new Date(a.releaseDate).getTime();
                const dateB = new Date(b.releaseDate).getTime();
                return calendarFilter === "upcoming" ? dateA - dateB : dateB - dateA;
              })
              .map((rel: any) => {
                const date = formatDate(rel.releaseDate);
                return (
                  <div key={rel.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors" data-testid={`calendar-release-${rel.id}`}>
                    <div className="w-12 sm:w-16 shrink-0 text-center">
                      <div className="bg-indigo-600 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-t-md px-1.5 sm:px-2 py-0.5 sm:py-1">
                        Release
                      </div>
                      <div className="border border-gray-200 border-t-0 rounded-b-md px-1.5 sm:px-2 py-1 sm:py-1.5 bg-white">
                        <p className="text-[9px] sm:text-[10px] text-gray-500 leading-tight">{date.month}</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{date.day}</p>
                      </div>
                    </div>

                    {rel.coverArtUrl ? (
                      <img src={rel.coverArtUrl} alt="" className="w-14 h-14 rounded object-cover border border-gray-200 shadow-sm shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate" title={rel.title}>{rel.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500" title={rel.primaryArtist}>{rel.primaryArtist}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-400">{rel.releaseType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(rel.status)}
                        <span className="text-xs text-gray-500 hidden sm:inline">{getStatusLabel(rel.status)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
