import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function AdminSupport() {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [reply, setReply] = useState("");

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: ticketDetail } = useQuery<any>({
    queryKey: ["/api/tickets", selectedTicket],
    queryFn: async () => {
      if (!selectedTicket) return null;
      const res = await fetch(`/api/tickets/${selectedTicket}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!selectedTicket,
  });

  const replyMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      await apiRequest("POST", `/api/tickets/${ticketId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", selectedTicket] });
      setReply("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/tickets/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", selectedTicket] });
    },
  });

  const statusColor = (s: string) => {
    if (s === "open") return "text-yellow-500 border-yellow-500/20";
    if (s === "in_progress") return "text-blue-400 border-blue-500/20";
    return "text-green-500 border-green-500/20";
  };

  if (selectedTicket && ticketDetail) {
    return (
      <div className="space-y-6 max-w-[900px] mx-auto">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors" data-testid="button-back-tickets">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight" data-testid="text-ticket-subject">{ticketDetail.subject}</h2>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Ticket #{ticketDetail.id}</span>
          </div>
          <div className="flex gap-2">
            {["open", "in_progress", "closed"].map(s => (
              <Button
                key={s}
                size="sm"
                variant={ticketDetail.status === s ? "default" : "outline"}
                onClick={() => statusMutation.mutate({ id: ticketDetail.id, status: s })}
                className={`rounded-none h-8 px-3 text-[9px] font-bold uppercase tracking-widest ${ticketDetail.status === s ? 'bg-white text-black' : 'border-white/10'}`}
                data-testid={`button-status-${s}`}
              >
                {s.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        <Card className="bg-black border-white/5 rounded-none">
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
              {ticketDetail.messages?.map((msg: any) => (
                <div key={msg.id} className="border-b border-white/5 pb-4 last:border-0" data-testid={`message-${msg.id}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-tight">{msg.user?.fullName || "Unknown"}</span>
                    <span className={`text-[9px] px-1 border ${msg.user?.role === 'admin' ? 'text-red-400 border-red-500/20' : 'text-white/40 border-white/10'} uppercase tracking-widest`}>
                      {msg.user?.role}
                    </span>
                    <span className="text-[10px] text-white/30">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-white/80">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 p-4 flex gap-2">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-transparent border border-white/10 rounded-none px-4 py-3 text-sm focus:border-white focus:outline-none"
                data-testid="input-admin-reply"
              />
              <Button
                onClick={() => replyMutation.mutate({ ticketId: selectedTicket, message: reply })}
                disabled={!reply.trim()}
                className="bg-white text-black hover:bg-white/90 rounded-none px-6"
                data-testid="button-send-reply"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header>
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Admin</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" data-testid="text-admin-support-title">Support Tickets</h1>
      </header>

      <Card className="bg-black border-white/5 rounded-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">No tickets found</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                  <th className="p-4 font-medium">#</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map((t: any) => (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t.id)} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    data-testid={`row-ticket-${t.id}`}
                  >
                    <td className="p-4 text-white/40 font-mono text-xs">#{t.id}</td>
                    <td className="p-4 font-bold uppercase tracking-tight">{t.subject}</td>
                    <td className="p-4 text-xs text-white/60">{t.user?.fullName || "—"}</td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${statusColor(t.status)}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] text-white/60">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
