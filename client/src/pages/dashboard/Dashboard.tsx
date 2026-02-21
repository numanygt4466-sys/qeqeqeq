import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Music, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: releases = [] } = useQuery<any[]>({ queryKey: ["/api/releases"] });
  const { data: tickets = [] } = useQuery<any[]>({ queryKey: ["/api/tickets"] });

  const pendingReleases = releases.filter((r: any) => r.status === "pending").length;
  const approvedReleases = releases.filter((r: any) => r.status === "approved").length;
  const openTickets = tickets.filter((t: any) => t.status !== "closed").length;

  const stats = [
    { label: "Total Releases", value: String(releases.length), icon: Music, trend: `${approvedReleases} approved` },
    { label: "Pending Review", value: String(pendingReleases), icon: Clock, trend: "Awaiting admin" },
    { label: "Open Tickets", value: String(openTickets), icon: Users, trend: `${tickets.length} total` },
    { label: "Account Role", value: user?.role?.toUpperCase() || "—", icon: ShieldCheck, trend: "Active" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Central Command</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none" data-testid="text-dashboard-title">
            Welcome, {user?.fullName?.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-12">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">System Status</span>
            <span className="text-[11px] font-bold text-green-500 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Operational
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-black border-white/5 rounded-none group hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">
                {stat.label}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-black border-white/5 rounded-none">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Recent Releases</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {releases.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-4">No releases yet</p>
                  <Link href="/app/upload">
                    <button className="px-6 py-3 border border-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all" data-testid="button-submit-first">
                      Submit First Release
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {releases.slice(0, 5).map((rel: any) => (
                    <div key={rel.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                          <Music className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-tight">{rel.title}</div>
                          <div className="text-[9px] text-white/40 uppercase tracking-widest">{rel.primaryArtist} • {rel.releaseType}</div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 border border-white/10 uppercase tracking-widest ${rel.status === 'approved' ? 'text-green-500' : rel.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {rel.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-black border-white/5 rounded-none">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
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
                  <button className="w-full text-left p-3 border border-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all" data-testid={`button-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {action.label}
                  </button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
