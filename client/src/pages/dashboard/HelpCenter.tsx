import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Search, Plus, ArrowLeft, Send, MessageCircle, 
  BookOpen, FileText, HelpCircle, ChevronRight,
  LifeBuoy, Mail, Clock
} from "lucide-react";

const faqItems = [
  {
    category: "Getting Started",
    questions: [
      { q: "How do I submit my first release?", a: "Navigate to Distribution > Create Product, fill in your release details, upload artwork, add tracks, select DSPs, and submit for review." },
      { q: "How long does approval take?", a: "Most releases are reviewed within 24–48 hours. You'll receive a notification when your release is approved or if changes are needed." },
      { q: "What file formats are accepted?", a: "We accept WAV files (16-bit, 44.1kHz) for audio tracks and JPG/PNG (3000x3000px minimum) for cover artwork." },
    ],
  },
  {
    category: "Earnings & Payouts",
    questions: [
      { q: "When do I get paid?", a: "Earnings are calculated monthly. You can request a payout once your balance reaches the $50 minimum threshold." },
      { q: "What payment methods are available?", a: "We support PayPal, bank transfer (ACH/Wire), and other regional payment methods depending on your country." },
      { q: "How are royalties calculated?", a: "Royalties are based on streams and downloads reported by each DSP. Rates vary by platform and territory." },
    ],
  },
  {
    category: "Distribution",
    questions: [
      { q: "Which platforms do you distribute to?", a: "We distribute to 60+ global platforms including Spotify, Apple Music, Amazon Music, YouTube Music, Tidal, Deezer, and more." },
      { q: "Can I choose specific platforms?", a: "Yes, during the release creation process you can select exactly which DSPs you want your release distributed to." },
      { q: "How do I take down a release?", a: "Contact support with your release details and we'll process the takedown request across all selected platforms." },
    ],
  },
];

export default function HelpCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"help" | "tickets">("help");

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
      setActiveTab("tickets");
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

  const statusColor = (status: string) => {
    if (status === "closed") return "bg-gray-100 text-gray-600";
    if (status === "in_progress") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  const filteredFaq = searchQuery.trim()
    ? faqItems.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : faqItems;

  if (selectedTicketId && ticketDetail) {
    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedTicketId(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
          data-testid="button-back-tickets"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Help Center
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-900" data-testid="text-ticket-subject">{ticketDetail.subject}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(ticketDetail.status)}`}>
              {ticketDetail.status.replace("_", " ")}
            </span>
            <span className="text-xs text-gray-400">Ticket #{ticketDetail.id}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-[450px] overflow-y-auto p-5 space-y-4">
            {ticketDetail.messages?.map((msg: any) => (
              <div key={msg.id} className="border-b border-gray-100 pb-4 last:border-0" data-testid={`message-${msg.id}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">{msg.user?.fullName || "Unknown"}</span>
                  {msg.user?.role === "admin" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Staff</span>
                  )}
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
          {ticketDetail.status !== "closed" && (
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1"
                data-testid="input-reply"
              />
              <Button
                onClick={() => replyMutation.mutate({ ticketId: selectedTicketId, message: reply })}
                disabled={!reply.trim() || replyMutation.isPending}
                className="bg-black hover:bg-gray-900 text-white"
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-xl px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-help-title">How can we help?</h1>
        <p className="text-gray-400 text-sm mb-6">Search our knowledge base or submit a support ticket</p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, FAQs..."
            className="w-full h-12 pl-11 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-colors"
            data-testid="input-help-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("help")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "help" ? "border-black text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-help"
        >
          Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "tickets" ? "border-black text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-tickets"
        >
          My Tickets {tickets.length > 0 && <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{tickets.length}</span>}
        </button>
      </div>

      {activeTab === "help" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <BookOpen className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Getting Started</h3>
              <p className="text-xs text-gray-500">Learn the basics of submitting and managing your releases</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <FileText className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Distribution Guide</h3>
              <p className="text-xs text-gray-500">Everything about DSPs, territories, and release management</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowCreate(true)} data-testid="card-submit-request">
              <LifeBuoy className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">Submit a Request</h3>
              <p className="text-xs text-gray-500">Can't find what you're looking for? Contact our support team</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {filteredFaq.map((category) => (
                <div key={category.category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{category.category}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {category.questions.map((faq) => {
                      const key = `${category.category}-${faq.q}`;
                      const isExpanded = expandedFaq === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setExpandedFaq(isExpanded ? null : key)}
                          className="w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors"
                          data-testid={`faq-${key.replace(/\s/g, '-').toLowerCase().slice(0, 40)}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                            <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </div>
                          {isExpanded && (
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Mail className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Still need help?</h3>
            <p className="text-xs text-gray-500 mb-4">Our support team typically responds within 24 hours</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
              data-testid="button-create-ticket"
            >
              <Plus className="w-4 h-4" /> Submit a Request
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
              data-testid="button-create-ticket-tab"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Tickets</h3>
              <p className="text-sm text-gray-400">Create a support ticket to get help</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {tickets.map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                    data-testid={`row-ticket-${t.id}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      t.status === "closed" ? "bg-gray-300" : t.status === "in_progress" ? "bg-blue-500" : "bg-amber-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.subject}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">#{t.id}</span>
                        <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor(t.status)}`}>
                      {t.status.replace("_", " ")}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Submit a Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief description of your issue"
                data-testid="input-ticket-subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="h-32"
                data-testid="input-ticket-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newSubject.trim() || !newMessage.trim() || createMutation.isPending}
              className="bg-black hover:bg-gray-900 text-white"
              data-testid="button-submit-ticket"
            >
              {createMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
