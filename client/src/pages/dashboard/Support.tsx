import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageCircle, Plus, ArrowLeft, Send } from "lucide-react";

export default function Support() {
  const { toast } = useToast();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: ticketDetail } = useQuery<any>({
    queryKey: ["/api/tickets", selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return null;
      const res = await fetch(`/api/tickets/${selectedTicketId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load ticket");
      return res.json();
    },
    enabled: !!selectedTicketId,
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
      toast({ title: "Ticket created successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      await apiRequest("POST", `/api/tickets/${ticketId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", selectedTicketId] });
      setReply("");
      toast({ title: "Reply sent" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const statusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "outline",
      in_progress: "default",
      closed: "secondary",
    };
    return variants[status] || "outline";
  };

  const priorityBadge = (priority: string) => {
    if (priority === "high" || priority === "urgent") return "destructive";
    return "secondary";
  };

  if (selectedTicketId && ticketDetail) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedTicketId(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
          data-testid="button-back-support"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-900" data-testid="text-ticket-subject">
            {ticketDetail.subject}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={statusBadge(ticketDetail.status)} data-testid="status-ticket">
              {ticketDetail.status.replace("_", " ")}
            </Badge>
            <Badge variant={priorityBadge(ticketDetail.priority)}>
              {ticketDetail.priority}
            </Badge>
            <span className="text-xs text-gray-400">Ticket #{ticketDetail.id}</span>
          </div>
        </div>

        <Card className="bg-white border border-gray-200 rounded-md">
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
              {ticketDetail.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                  data-testid={`message-${msg.id}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.user?.fullName || "Unknown"}
                    </span>
                    {msg.user?.role === "admin" && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
              ))}
            </div>
            {ticketDetail.status !== "closed" && (
              <div className="border-t border-gray-200 p-4 flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 rounded-md"
                  data-testid="input-reply"
                />
                <Button
                  onClick={() =>
                    replyMutation.mutate({ ticketId: selectedTicketId, message: reply })
                  }
                  disabled={!reply.trim() || replyMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-support-title">
            Support
          </h1>
          <p className="text-gray-500 text-sm mt-1">Get help with your account and releases</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          data-testid="button-create-ticket"
        >
          <Plus className="w-4 h-4 mr-1" /> New Ticket
        </Button>
      </header>

      <Card className="bg-white border border-gray-200 rounded-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Tickets</h3>
              <p className="text-sm text-gray-400">Create a support ticket to get help</p>
            </div>
          ) : (
            <table className="w-full text-left" data-testid="table-tickets">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map((t: any) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    data-testid={`row-ticket-${t.id}`}
                  >
                    <td className="px-6 py-4 text-gray-400 text-xs">#{t.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.subject}</td>
                    <td className="px-6 py-4">
                      <Badge variant={priorityBadge(t.priority)}>{t.priority}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusBadge(t.status)}>
                        {t.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white rounded-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="rounded-md"
                data-testid="input-ticket-subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="rounded-md h-32"
                data-testid="input-ticket-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-md">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newSubject.trim() || !newMessage.trim() || createMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              data-testid="button-submit-ticket"
            >
              {createMutation.isPending ? "Submitting..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
