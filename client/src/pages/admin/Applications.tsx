import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: applications = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/applications"],
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: number; status: string; rejectionReason?: string }) => {
      await apiRequest("PATCH", `/api/admin/applications/${id}`, { status, rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setRejectionId(null);
      setRejectionReason("");
    },
  });

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="w-3 h-3 text-green-500" />;
    if (status === "rejected") return <XCircle className="w-3 h-3 text-red-500" />;
    return <Clock className="w-3 h-3 text-yellow-500" />;
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header>
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Admin</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" data-testid="text-admin-applications-title">Application Queue</h1>
      </header>

      <Card className="bg-black border-white/5 rounded-none">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">Pending Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">No applications found</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                  <th className="p-4 font-medium">Applicant</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Label</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {applications.map((app: any) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-application-${app.id}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#111] border border-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-tight">{app.user?.fullName}</div>
                          <div className="text-[10px] text-white/40">@{app.user?.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-white/60">{app.user?.email}</td>
                    <td className="p-4 text-xs text-white/60 uppercase tracking-widest">{app.user?.labelName || "—"}</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 px-2 py-1 border border-white/10 text-[9px] font-bold tracking-widest uppercase">
                        {statusIcon(app.status)}
                        {app.status}
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-white/60">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      {app.status === "pending" && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => mutation.mutate({ id: app.id, status: "approved" })}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-none h-8 px-3 text-[9px] font-bold uppercase tracking-widest"
                            data-testid={`button-approve-${app.id}`}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectionId(app.id)}
                            className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-none h-8 px-3 text-[9px] font-bold uppercase tracking-widest"
                            data-testid={`button-reject-${app.id}`}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {rejectionId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#050505] border border-white/10 p-8 w-full max-w-md">
            <h3 className="text-lg font-black uppercase tracking-tight mb-4">Rejection Reason</h3>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              className="w-full bg-black border border-white/10 rounded-none p-3 text-sm text-white h-32 focus:border-white focus:outline-none mb-4"
              data-testid="input-rejection-reason"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => { setRejectionId(null); setRejectionReason(""); }}
                variant="outline"
                className="flex-1 rounded-none border-white/10 h-10 text-xs uppercase tracking-widest"
              >
                Cancel
              </Button>
              <Button
                onClick={() => mutation.mutate({ id: rejectionId, status: "rejected", rejectionReason })}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none h-10 text-xs uppercase tracking-widest"
                data-testid="button-confirm-reject"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
