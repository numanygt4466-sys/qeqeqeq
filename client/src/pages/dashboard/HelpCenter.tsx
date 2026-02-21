import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search, Plus, ArrowLeft, Send, MessageCircle,
  BookOpen, FileText, HelpCircle, ChevronRight, ChevronDown,
  LifeBuoy, Mail, Clock, Globe, Music, DollarSign,
  Headphones, Shield, Settings, Users
} from "lucide-react";

interface Article {
  title: string;
  body: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: Article[];
}

const categories: Category[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of submitting and managing your releases",
    icon: <BookOpen className="w-6 h-6" />,
    articles: [
      {
        title: "How do I submit my first release?",
        body: "Navigate to Distribution > Create Product from the top navigation bar. Fill in your release details including title, primary artist, genre, and release date. Upload your cover artwork (minimum 3000×3000 px, square JPG or PNG), add your audio tracks (WAV format only), select which DSPs you want to distribute to, and submit for review. Our team will review your submission within 24–48 hours.",
      },
      {
        title: "How long does the approval process take?",
        body: "Most releases are reviewed within 24–48 hours during business days. Complex releases or those requiring additional review may take up to 72 hours. You'll receive a notification when your release is approved, or if changes are required before approval.",
      },
      {
        title: "What file formats are accepted?",
        body: "Audio: WAV files only (16-bit, 44.1kHz recommended). MP3 and other compressed formats are not accepted. Cover Artwork: JPG or PNG, minimum 3000×3000 pixels, square format (1:1 aspect ratio). File names should not contain special characters.",
      },
      {
        title: "How do I set up my account after approval?",
        body: "Once your application is approved by an admin, you'll gain access to the full dashboard. Start by completing your profile under Settings — add your label name, country, timezone, and payout preferences. Then you're ready to submit your first release.",
      },
      {
        title: "What are the different user roles?",
        body: "There are three roles on the platform: Artist — can view own releases and earnings; Label Manager — can submit releases and manage artists within their label; Admin — full platform access including approving applications, managing releases, users, and support tickets.",
      },
    ],
  },
  {
    id: "distribution-guide",
    title: "Distribution Guide",
    description: "Everything about DSPs, territories, and release management",
    icon: <Globe className="w-6 h-6" />,
    articles: [
      {
        title: "Which DSPs do you distribute to?",
        body: "We distribute to 60+ global digital service providers including Spotify, Apple Music, Amazon Music, YouTube Music, Tidal, Deezer, Pandora, iHeartRadio, Napster, Audiomack, Anghami, JioSaavn, Boomplay, NetEase Cloud Music, Tencent Music, and many more. New platforms are added regularly as they become available.",
      },
      {
        title: "How do I select specific DSPs for my release?",
        body: "During the release creation process, you'll see a full list of available DSPs organized by region. You can select all platforms at once, or choose specific ones. We recommend distributing to all available platforms to maximize your reach, but you have full control over which stores carry your music.",
      },
      {
        title: "What territories can I distribute to?",
        body: "We support worldwide distribution across 200+ countries and territories. By default, releases are distributed globally. You can also set territory-specific restrictions if your release is limited to certain regions due to licensing or contractual obligations. Territory settings can be configured per release during the submission process.",
      },
      {
        title: "How long does it take for my music to appear on DSPs?",
        body: "After your release is approved on our platform, delivery to DSPs typically takes 24–72 hours. However, each platform has its own processing timeline: Spotify and Apple Music usually go live within 1–3 days, while some smaller platforms may take up to 2 weeks. We recommend submitting your release at least 2–3 weeks before your planned release date.",
      },
      {
        title: "How do I schedule a release date?",
        body: "When creating your release, you can set a future release date. The music will be delivered to DSPs in advance and set to go live on your chosen date. For the best chance of editorial playlist consideration on Spotify, submit at least 4 weeks before your release date. Pre-save and pre-order links can be generated once the release is delivered.",
      },
      {
        title: "Can I update metadata after distribution?",
        body: "Yes, you can request metadata changes (title, artist name, genre, etc.) by submitting a support ticket with the topic 'Metadata Change'. Changes are processed within 3–5 business days and pushed to all DSPs. Note that some platforms may take additional time to reflect updates. Cover art changes require a new image meeting the same specifications (minimum 3000×3000 px, square format).",
      },
      {
        title: "How do I take down a release?",
        body: "To remove a release from all or specific DSPs, submit a support ticket with the topic 'Release Takedown'. Include the release title, UPC/ISRC codes if available, and specify whether you want a full takedown or removal from specific platforms only. Takedowns are typically processed within 24–48 hours, but it may take up to 2 weeks for the release to fully disappear from all platforms.",
      },
      {
        title: "What is a UPC and ISRC code?",
        body: "UPC (Universal Product Code) is a unique identifier assigned to each release (album, EP, single). ISRC (International Standard Recording Code) is a unique identifier for each individual track. We automatically generate and assign these codes to your releases at no extra cost. These codes are essential for tracking sales, streams, and royalties across all platforms.",
      },
      {
        title: "How do Content ID and rights management work?",
        body: "When you distribute through our platform, your music is automatically registered with YouTube Content ID and other rights management systems. This means any unauthorized use of your music on YouTube will be detected and you can monetize those uses. Revenue from Content ID claims appears in your earnings dashboard alongside streaming royalties.",
      },
    ],
  },
  {
    id: "earnings-payouts",
    title: "Earnings & Payouts",
    description: "Royalties, payment methods, and payout schedules",
    icon: <DollarSign className="w-6 h-6" />,
    articles: [
      {
        title: "When do I get paid?",
        body: "Earnings are calculated monthly based on reports from DSPs. Most platforms report with a 2–3 month delay (e.g., streams from January are typically reported and paid in March or April). You can request a payout at any time once your balance reaches the $50 minimum threshold.",
      },
      {
        title: "What payment methods are available?",
        body: "We currently support PayPal and bank transfer (ACH for US accounts, international wire for non-US accounts). Additional payment methods may be available depending on your country. You can configure your preferred payment method in Settings.",
      },
      {
        title: "How are royalties calculated?",
        body: "Royalties are based on streams and downloads reported by each DSP. Per-stream rates vary by platform, territory, and the listener's subscription tier (free vs. premium). As a general guide, Spotify pays approximately $0.003–$0.005 per stream, while Apple Music pays approximately $0.007–$0.01 per stream. Your Earnings dashboard shows a detailed breakdown by platform and track.",
      },
      {
        title: "What is the minimum payout threshold?",
        body: "The minimum payout threshold is $50. Once your available balance reaches this amount, you can request a payout from the Finance > Payouts page. Payouts are processed within 5–7 business days after approval.",
      },
      {
        title: "Why are my earnings delayed?",
        body: "DSPs report earnings with a 2–3 month delay. This is an industry-standard reporting cycle. For example, if your song was streamed in January, the earnings will typically appear in your dashboard in March or April. Some platforms may report even later.",
      },
    ],
  },
  {
    id: "audio-artwork",
    title: "Audio & Artwork",
    description: "File requirements, quality standards, and upload guidelines",
    icon: <Headphones className="w-6 h-6" />,
    articles: [
      {
        title: "What are the audio file requirements?",
        body: "All audio tracks must be uploaded in WAV format. Recommended specifications: 16-bit or 24-bit, 44.1kHz sample rate, stereo. MP3, AAC, FLAC, and other formats are not accepted. The maximum file size per track is 200MB. Ensure your audio is properly mastered with no clipping or distortion.",
      },
      {
        title: "What are the cover art requirements?",
        body: "Cover artwork must be: JPG or PNG format, minimum 3000×3000 pixels, square (1:1 aspect ratio), RGB color mode. Do not include website URLs, social media handles, pricing information, or explicit content warnings in the artwork. The image should be high quality with no blurriness or pixelation.",
      },
      {
        title: "Can I use AI-generated artwork?",
        body: "Policies vary by DSP. Some platforms accept AI-generated artwork while others have restrictions. We recommend using original artwork created by a human artist or properly licensed stock imagery to avoid potential issues across all platforms.",
      },
    ],
  },
  {
    id: "account-security",
    title: "Account & Security",
    description: "Account settings, login issues, and security best practices",
    icon: <Shield className="w-6 h-6" />,
    articles: [
      {
        title: "How do I reset my password?",
        body: "Contact our support team by submitting a ticket with the topic 'Account & Login' and we'll help you reset your password securely.",
      },
      {
        title: "How do I update my profile information?",
        body: "Navigate to Settings from the user menu in the top navigation bar. You can update your full name, label name, email, country, and timezone. Some changes may require verification.",
      },
      {
        title: "What happens if my application is rejected?",
        body: "If your application is rejected, you'll see the rejection reason on your pending approval screen. You can contact support to discuss the rejection or reapply with updated information. Common rejection reasons include incomplete information or duplicate accounts.",
      },
    ],
  },
];

const topicOptions = [
  "Release Submission",
  "Release Takedown",
  "Metadata Change",
  "Earnings & Royalties",
  "Payout Issue",
  "Account & Login",
  "Cover Art / Artwork",
  "Audio Quality",
  "DSP / Distribution",
  "Copyright / DMCA",
  "Technical Issue",
  "Other",
];

export default function HelpCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"home" | "category" | "tickets">("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      const subject = newTopic ? `[${newTopic}] ${newSubject}` : newSubject;
      await apiRequest("POST", "/api/tickets", { subject, message: newMessage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setShowCreate(false);
      setNewTopic("");
      setNewSubject("");
      setNewMessage("");
      setActiveView("tickets");
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
    if (status === "in_progress") return "bg-blue-50 text-blue-700";
    return "bg-amber-50 text-amber-700";
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

  const searchResults = searchQuery.trim()
    ? categories.flatMap(cat =>
        cat.articles
          .filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.body.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(a => ({ ...a, categoryTitle: cat.title, categoryId: cat.id }))
      )
    : [];

  if (selectedTicketId && ticketDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedTicketId(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors"
            data-testid="button-back-tickets"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Help Center
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900" data-testid="text-ticket-subject">{ticketDetail.subject}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(ticketDetail.status)}`}>
                {ticketDetail.status.replace("_", " ")}
              </span>
              <span className="text-xs text-gray-400">Ticket #{ticketDetail.id}</span>
              <span className="text-xs text-gray-400">{new Date(ticketDetail.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="max-h-[500px] overflow-y-auto">
              {ticketDetail.messages?.map((msg: any, idx: number) => (
                <div
                  key={msg.id}
                  className={`px-6 py-5 ${idx > 0 ? "border-t border-gray-100" : ""} ${
                    msg.user?.role === "admin" ? "bg-blue-50/30" : ""
                  }`}
                  data-testid={`message-${msg.id}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      msg.user?.role === "admin" ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {(msg.user?.fullName || "U")[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{msg.user?.fullName || "Unknown"}</span>
                    {msg.user?.role === "admin" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded">Staff</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-9">{msg.message}</p>
                </div>
              ))}
            </div>
            {ticketDetail.status !== "closed" && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-white"
                  data-testid="input-reply"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && reply.trim()) {
                      replyMutation.mutate({ ticketId: selectedTicketId, message: reply });
                    }
                  }}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      <div className="bg-[#1a1a2e] px-6 py-14 text-center">
        <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-help-title">How can we help you?</h1>
        <p className="text-gray-400 text-sm mb-8">Search our knowledge base or browse categories below</p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) setActiveView("home");
            }}
            placeholder="Search for articles..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm border-0 outline-none shadow-lg focus:ring-2 focus:ring-white/30"
            data-testid="input-help-search"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {searchQuery.trim() ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"</p>
            </div>
            {searchResults.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">No articles found</p>
                <p className="text-xs text-gray-400">Try different keywords or <button onClick={() => setShowCreate(true)} className="text-black underline">submit a request</button></p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {searchResults.map((result, i) => {
                  const key = `search-${i}`;
                  const isExpanded = expandedArticle === key;
                  return (
                    <div key={key} className="group">
                      <button
                        onClick={() => setExpandedArticle(isExpanded ? null : key)}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                        data-testid={`search-result-${i}`}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{result.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{result.categoryTitle}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-4 pl-[52px]">
                          <p className="text-sm text-gray-600 leading-relaxed">{result.body}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeView === "category" && currentCategory ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 mt-8">
              <button onClick={() => { setActiveView("home"); setSelectedCategory(null); }} className="hover:text-gray-900 transition-colors" data-testid="breadcrumb-home">
                Help Center
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{currentCategory.title}</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    {currentCategory.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900" data-testid="text-category-title">{currentCategory.title}</h2>
                    <p className="text-sm text-gray-500">{currentCategory.description}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium py-3">{currentCategory.articles.length} articles</p>
              </div>
              <div className="divide-y divide-gray-100">
                {currentCategory.articles.map((article, i) => {
                  const key = `${currentCategory.id}-${i}`;
                  const isExpanded = expandedArticle === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setExpandedArticle(isExpanded ? null : key)}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                        data-testid={`article-${currentCategory.id}-${i}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{article.title}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 pl-[52px]">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 leading-relaxed">{article.body}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeView === "tickets" ? (
          <div className="mb-8 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button onClick={() => setActiveView("home")} className="hover:text-gray-900 transition-colors" data-testid="breadcrumb-home-tickets">
                Help Center
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">My Tickets</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Tickets</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                data-testid="button-create-ticket-tab"
              >
                <Plus className="w-4 h-4" /> New Ticket
              </button>
            </div>

            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <p className="text-sm text-gray-400">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-gray-900 mb-1">No tickets yet</h3>
                <p className="text-sm text-gray-400 mb-5">Submit a request and our team will get back to you</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Submit a Request
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Subject</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 w-24">ID</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 w-28">Created</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 w-28">Status</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tickets.map((t: any) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        data-testid={`row-ticket-${t.id}`}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{t.subject}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-400">#{t.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColor(t.status)}`}>
                            {t.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setActiveView("category"); setExpandedArticle(null); }}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-gray-300 transition-all group"
                  data-testid={`card-category-${cat.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                    <span>{cat.articles.length} articles</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => setActiveView("tickets")}
                className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-gray-300 transition-all group"
                data-testid="card-my-tickets"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">My Tickets</h3>
                <p className="text-xs text-gray-500 leading-relaxed">View and manage your support tickets</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <span>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
              <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Can't find what you're looking for?</h3>
              <p className="text-sm text-gray-500 mb-5">Our support team typically responds within 24 hours</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                data-testid="button-create-ticket"
              >
                <Plus className="w-4 h-4" /> Submit a Request
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white rounded-lg max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Submit a Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Topic <span className="text-red-500">*</span></label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm text-gray-900 bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                data-testid="select-ticket-topic"
              >
                <option value="">Select a topic...</option>
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief description of your issue"
                data-testid="input-ticket-subject"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="h-32 resize-none"
                data-testid="input-ticket-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newTopic || !newSubject.trim() || !newMessage.trim() || createMutation.isPending}
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
