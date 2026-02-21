import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, ArrowLeft, Send, Clock, CheckCircle } from "lucide-react";

export default function Support() {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
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

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/tickets", { subject: newSubject, message: newMessage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setShowCreate(false);
      setNewSubject("");
      setNewMessage("");
    },
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

  const statusColor = (s: string) => {
    if (s === "open") return "text-yellow-500 border-yellow-500/20";
    if (s === "in_progress") return "text-blue-400 border-blue-500/20";
    return "text-green-500 border-green-500/20";
  };

  if (selectedTicket && ticketDetail) {
    return (
      <div className="space-y-6 max-w-[900px] mx-auto">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors" data-testid="button-back-support">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight" data-testid="text-ticket-subject">{ticketDetail.subject}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${statusColor(ticketDetail.status)}`}>
              {ticketDetail.status.replace("_", " ")}
            </span>
            <span className="text-[10px] text-white/40">Ticket #{ticketDetail.id}</span>
          </div>
        </div>

        <Card className="bg-black border-white/5 rounded-none">
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
              {ticketDetail.messages?.map((msg: any) => (
                <div key={msg.id} className="border-b border-white/5 pb-4 last:border-0" data-testid={`message-${msg.id}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-tight">{msg.user?.fullName || "Unknown"}</span>
                    {msg.user?.role === "admin" && (
                      <span className="text-[9px] px-1 border text-red-400 border-red-500/20 uppercase tracking-widest">Admin</span>
                    )}
                    <span className="text-[10px] text-white/30">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-white/80">{msg.message}</p>
                </div>
              ))}
            </div>
            {ticketDetail.status !== "closed" && (
              <div className="border-t border-white/5 p-4 flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border border-white/10 rounded-none px-4 py-3 text-sm focus:border-white focus:outline-none"
                  data-testid="input-reply"
                />
                <Button
                  onClick={() => replyMutation.mutate({ ticketId: selectedTicket, message: reply })}
                  disabled={!reply.trim()}
                  className="bg-white text-black hover:bg-white/90 rounded-none px-6"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Help Center</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" data-testid="text-support-title">Support</h1>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 text-xs font-black tracking-[0.2em] uppercase" data-testid="button-create-ticket">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </header>

      {showCreate && (
        <Card className="bg-black border-white/10 rounded-none">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Subject *</label>
              <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="Brief description of your issue" data-testid="input-ticket-subject" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Message *</label>
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full bg-transparent border border-white/10 rounded-none p-3 text-sm text-white h-32 focus:border-white focus:outline-none"
                data-testid="input-ticket-message"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowCreate(false)} variant="outline" className="rounded-none border-white/10 h-10 px-6 text-xs uppercase tracking-widest">Cancel</Button>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!newSubject.trim() || !newMessage.trim() || createMutation.isPending}
                className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 text-xs font-black uppercase tracking-widest"
                data-testid="button-submit-ticket"
              >
                {createMutation.isPending ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-black border-white/5 rounded-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">No Tickets</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest">Create a support ticket to get help</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                  <th className="p-4 font-medium">#</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map((t: any) => (
                  <tr key={t.id} onClick={() => setSelectedTicket(t.id)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" data-testid={`row-ticket-${t.id}`}>
                    <td className="p-4 text-white/40 font-mono text-xs">#{t.id}</td>
                    <td className="p-4 font-bold uppercase tracking-tight">{t.subject}</td>
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
