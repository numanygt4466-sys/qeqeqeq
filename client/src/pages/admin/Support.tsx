import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircle, Clock, CheckCircle, ArrowLeft, Send, AlertCircle } from "lucide-react";

export default function AdminSupport() {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [reply, setReply] = useState("");

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/tickets"],
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
      toast({ title: "Sent", description: "Reply sent successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/tickets/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", selectedTicket] });
      toast({ title: "Updated", description: "Ticket status updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const statusPill = (status: string) => {
    if (status === "closed")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Closed
        </span>
      );
    if (status === "in_progress")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" /> In Progress
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" /> Open
      </span>
    );
  };

  const priorityPill = (priority: string) => {
    if (priority === "high" || priority === "urgent")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {priority}
        </span>
      );
    if (priority === "low")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {priority}
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-support-title">
          Support Tickets
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No tickets found</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left hidden md:table-cell">ID</th>
                <th className="px-3 md:px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">User</th>
                <th className="px-3 md:px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Priority</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Date</th>
                <th className="px-3 md:px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t: any) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  data-testid={`row-ticket-${t.id}`}
                >
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs hidden md:table-cell">#{t.id}</td>
                  <td className="px-3 md:px-6 py-4 font-medium text-gray-900" data-testid={`text-ticket-subject-${t.id}`}>
                    <span className="truncate block max-w-[150px] md:max-w-none">{t.subject}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{t.user?.fullName || "—"}</td>
                  <td className="px-3 md:px-6 py-4">{statusPill(t.status)}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{priorityPill(t.priority)}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTicket(t.id)}
                      className="rounded-md min-h-[44px] md:min-h-0"
                      data-testid={`button-view-ticket-${t.id}`}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Dialog open={!!selectedTicket && !!ticketDetail} onOpenChange={(open) => { if (!open) setSelectedTicket(null); }}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-ticket-subject">
              {ticketDetail?.subject}
            </DialogTitle>
            <DialogDescription>
              Ticket #{ticketDetail?.id} — {ticketDetail?.user?.fullName || "Unknown"}
            </DialogDescription>
          </DialogHeader>

          {ticketDetail && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {["open", "in_progress", "closed"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={ticketDetail.status === s ? "default" : "outline"}
                    onClick={() => statusMutation.mutate({ id: ticketDetail.id, status: s })}
                    className={ticketDetail.status === s ? "bg-indigo-600 text-white hover:bg-indigo-700 rounded-md" : "rounded-md"}
                    data-testid={`button-status-${s}`}
                  >
                    {s.replace("_", " ")}
                  </Button>
                ))}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {ticketDetail.messages?.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                      data-testid={`message-${msg.id}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {msg.user?.fullName || "Unknown"}
                        </span>
                        {msg.user?.role === "label_manager" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
                            Staff
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 p-3 flex gap-2 bg-white flex-col sm:flex-row">
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && reply.trim() && selectedTicket) {
                        replyMutation.mutate({ ticketId: selectedTicket, message: reply });
                      }
                    }}
                    data-testid="input-admin-reply"
                  />
                  <Button
                    onClick={() => selectedTicket && replyMutation.mutate({ ticketId: selectedTicket, message: reply })}
                    disabled={!reply.trim()}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                    data-testid="button-send-reply"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
