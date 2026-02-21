import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, TrendingUp, BarChart3 } from "lucide-react";

export default function Earnings() {
  const summary = [
    { label: "Total Revenue", value: "$42,504.00", trend: "+12.5%", period: "Lifetime" },
    { label: "This Month", value: "$4,120.50", trend: "+8.2%", period: "Nov 2024" },
    { label: "Pending Payout", value: "$1,250.00", trend: "Ready", period: "Available Now" },
    { label: "Avg. eCPM", value: "$0.0042", trend: "+0.0001", period: "Per Stream" },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Financial Intelligence</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Earnings</h1>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <Card key={i} className="bg-black border-white/5 rounded-none group hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">
                {item.label}
              </CardTitle>
              <DollarSign className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter mb-1 text-white">{item.value}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {item.trend}
                </span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest">{item.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black border-white/5 rounded-none">
        <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Revenue Breakdown</CardTitle>
          <div className="flex gap-2">
             <select className="bg-transparent border border-white/10 rounded-none h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white">
                <option className="bg-black">All Time</option>
                <option className="bg-black">This Year</option>
                <option className="bg-black">Last 6 Months</option>
             </select>
          </div>
        </CardHeader>
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
          <BarChart3 className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-xl font-black uppercase tracking-tight mb-2">Chart Visualization Unavailable</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest max-w-md text-center">Connect charting library to visualize revenue data across DSPs and territories.</p>
        </CardContent>
      </Card>
    </div>
  );
}