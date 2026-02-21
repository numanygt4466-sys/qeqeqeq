import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Globe, Music, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Active Artists", value: "124", icon: Users, trend: "+12%" },
    { label: "Monthly Streams", value: "48.2M", icon: BarChart3, trend: "+8.4%" },
    { label: "Global Reach", value: "142", icon: Globe, trend: "Stable" },
    { label: "New Releases", value: "12", icon: Music, trend: "+2" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Central Command</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Intelligence Dashboard</h1>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-black border-white/5 rounded-none group hover:border-white/20 transition-all">
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
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-black border-white/5 rounded-none">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Global Activity Feed</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {[
                    { action: "New Release", target: "ARCANE - VOID CIRCUIT", time: "2m ago", status: "Published" },
                    { action: "Contract Signed", target: "VOID CIRCUIT", time: "45m ago", status: "Verified" },
                    { action: "Payment Batch", target: "Q3 Royalties - Europe", time: "3h ago", status: "Processed" },
                    { action: "Metadata Update", target: "NIHIL - STATIC DECAY", time: "5h ago", status: "Synced" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-tight">{item.target}</div>
                          <div className="text-[9px] text-white/40 uppercase tracking-widest">{item.action} • {item.time}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-1 border border-white/10 text-white/60 uppercase tracking-widest">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="bg-black border-white/5 rounded-none">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Security Clearance</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-[11px] font-black uppercase">Level 4 Access</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest">Administrator: User_771</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 italic">Quick Actions</div>
                  <div className="space-y-2">
                    {["Generate Report", "Issue Payment", "Manage Users", "System Config"].map(action => (
                      <button key={action} className="w-full text-left p-3 border border-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
