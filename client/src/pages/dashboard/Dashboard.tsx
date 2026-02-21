import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Music, Clock, Users, ShieldCheck, ArrowUpRight, Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: releases = [] } = useQuery<any[]>({ queryKey: ["/api/releases"] });
  const { data: tickets = [] } = useQuery<any[]>({ queryKey: ["/api/tickets"] });

  const pendingReleases = releases.filter((r: any) => r.status === "pending").length;
  const approvedReleases = releases.filter((r: any) => r.status === "approved").length;
  const openTickets = tickets.filter((t: any) => t.status !== "closed").length;

  const stats = [
    { label: "Total Releases", value: String(releases.length), icon: Music, sub: `${approvedReleases} approved` },
    { label: "Pending Review", value: String(pendingReleases), icon: Clock, sub: "Awaiting admin" },
    { label: "Open Tickets", value: String(openTickets), icon: Users, sub: `${tickets.length} total` },
    { label: "Account Role", value: user?.role?.toUpperCase() || "—", icon: ShieldCheck, sub: "Active" },
  ];

  const getStatusPill = (status: string) => {
    if (status === "approved") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
    if (status === "rejected") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dashboard-title">
          Welcome, {user?.fullName?.split(" ")[0]}
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" /> {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Releases</h2>
            </div>
            <div className="p-6">
              {releases.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No releases yet</p>
                  <Link href="/app/upload">
                    <button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium" data-testid="button-submit-first">
                      <Plus className="w-4 h-4 inline mr-1" /> Submit First Release
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-0">
                  {releases.slice(0, 5).map((rel: any) => (
                    <div key={rel.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        {rel.coverArtUrl ? (
                          <img src={rel.coverArtUrl} alt={rel.title} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Music className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rel.title}</div>
                          <div className="text-xs text-gray-400">{rel.primaryArtist} · {rel.releaseType}</div>
                        </div>
                      </div>
                      {getStatusPill(rel.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Submit Release", href: "/app/upload" },
                { label: "View Catalog", href: "/app/catalog" },
                { label: "Support", href: "/app/support" },
                ...(user?.role === "admin" ? [
                  { label: "Review Applications", href: "/app/admin/applications" },
                  { label: "Release Queue", href: "/app/admin/releases" },
                  { label: "Manage Users", href: "/app/admin/users" },
                ] : []),
              ].map(action => (
                <Link key={action.label} href={action.href}>
                  <button className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors" data-testid={`button-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {action.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
