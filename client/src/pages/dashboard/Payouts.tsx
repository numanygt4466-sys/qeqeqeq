import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Building, CheckCircle } from "lucide-react";

export default function Payouts() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">Treasury</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Payouts</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-black border-white/5 rounded-none">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Payout History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black tracking-[0.2em] uppercase text-white/40">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Method</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {[
                    { date: "Oct 01, 2024", amount: "$1,450.00", method: "Bank Transfer (...4592)", status: "Completed" },
                    { date: "Sep 01, 2024", amount: "$1,200.50", method: "Bank Transfer (...4592)", status: "Completed" },
                    { date: "Aug 01, 2024", amount: "$980.25", method: "Bank Transfer (...4592)", status: "Completed" },
                  ].map((payout, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white/60">{payout.date}</td>
                      <td className="p-4 text-white">{payout.amount}</td>
                      <td className="p-4 text-white/60">{payout.method}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2 px-2 py-1 border border-white/10 text-[9px] font-sans font-bold tracking-widest uppercase bg-black text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary text-black rounded-none border-none">
            <CardContent className="p-8">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70 block mb-2">Available Balance</span>
              <div className="text-5xl font-black tracking-tighter mb-8">$1,250.00</div>
              <Button className="w-full bg-black text-white hover:bg-black/80 rounded-none h-14 text-xs font-black tracking-[0.2em] uppercase transition-all">
                Request Payout
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border-white/5 rounded-none">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center border border-white/10">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">Bank Account</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">**** **** 4592</div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest border border-green-500/20 px-2 py-1">Primary</span>
              </div>
              
              <Button variant="outline" className="w-full rounded-none border-white/10 hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12 border-dashed">
                + Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}