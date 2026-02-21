import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, User, ChevronDown, ChevronUp, ExternalLink, Music, DollarSign, Archive } from "lucide-react";

export default function AdminApplications() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: applications = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/applications"],
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: string;
      rejectionReason?: string;
    }) => {
      await apiRequest("PATCH", `/api/admin/applications/${id}`, {
        status,
        rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setRejectionId(null);
      setRejectionReason("");
      toast({ title: "Success", description: "Application updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter((a: any) => a.status === statusFilter);

  const statusPill = (status: string) => {
    if (status === "approved")
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          data-testid="status-approved"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
          data-testid="status-rejected"
        >
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>
      );
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
        data-testid="status-pending"
      >
        <Clock className="w-3 h-3 mr-1" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-applications-title">
          Application Queue
        </h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No applications found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left w-8"></th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Label</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app: any) => (
                <>
                <tr
                  key={app.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  data-testid={`row-application-${app.id}`}
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                >
                  <td className="px-3 py-4 text-gray-400">
                    {expandedId === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900" data-testid={`text-applicant-name-${app.id}`}>
                          {app.user?.fullName}
                        </div>
                        <div className="text-xs text-gray-500">@{app.user?.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600" data-testid={`text-applicant-email-${app.id}`}>
                    {app.user?.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600" data-testid={`text-applicant-label-${app.id}`}>
                    {app.user?.labelName || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{statusPill(app.status)}</td>
                  <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                    {app.status === "pending" && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => mutation.mutate({ id: app.id, status: "approved" })}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                          data-testid={`button-approve-${app.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectionId(app.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 rounded-md"
                          data-testid={`button-reject-${app.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedId === app.id && (
                  <tr key={`detail-${app.id}`} className="border-b border-gray-100 bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Music className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Spotify Link</div>
                            {app.spotifyLink ? (
                              <a href={app.spotifyLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1" data-testid={`link-spotify-${app.id}`}>
                                View Profile <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">Not provided</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Archive className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Catalog Size</div>
                            <div className="text-sm text-gray-900 font-medium" data-testid={`text-catalog-${app.id}`}>{app.catalogSize || "Not provided"}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <DollarSign className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Revenue</div>
                            <div className="text-sm text-gray-900 font-medium" data-testid={`text-revenue-${app.id}`}>{app.currentRevenue || "Not provided"}</div>
                          </div>
                        </div>
                      </div>
                      {app.user?.country && (
                        <div className="mt-3 text-xs text-gray-500">
                          Country: <span className="text-gray-700">{app.user.country.toUpperCase()}</span>
                          {app.user?.timezone && <> · Timezone: <span className="text-gray-700">{app.user.timezone.toUpperCase()}</span></>}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={!!rejectionId} onOpenChange={(open) => { if (!open) { setRejectionId(null); setRejectionReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this application.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
            data-testid="input-rejection-reason"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectionId(null); setRejectionReason(""); }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => rejectionId && mutation.mutate({ id: rejectionId, status: "rejected", rejectionReason })}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="button-confirm-reject"
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
