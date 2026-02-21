import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, DollarSign, CreditCard } from "lucide-react";

export default function AdminPayouts() {
  const { toast } = useToast();
  const [rejectTarget, setRejectTarget] = useState<{ type: "method" | "payout"; id: number } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: methods = [], isLoading: methodsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/payout-methods"],
  });

  const { data: payouts = [], isLoading: payoutsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/payouts"],
  });

  const methodMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: number; status: string; rejectionReason?: string }) => {
      await apiRequest("PATCH", `/api/admin/payout-methods/${id}`, { status, rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payout-methods"] });
      setRejectTarget(null);
      setRejectionReason("");
      toast({ title: "Success", description: "Payout method updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const payoutMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: number; status: string; rejectionReason?: string }) => {
      await apiRequest("PATCH", `/api/admin/payouts/${id}`, { status, rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payouts"] });
      setRejectTarget(null);
      setRejectionReason("");
      toast({ title: "Success", description: "Payout request updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const handleReject = () => {
    if (!rejectTarget) return;
    if (rejectTarget.type === "method") {
      methodMutation.mutate({ id: rejectTarget.id, status: "rejected", rejectionReason });
    } else {
      payoutMutation.mutate({ id: rejectTarget.id, status: "rejected", rejectionReason });
    }
  };

  const statusPill = (status: string) => {
    if (status === "approved")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-payouts-title">
        Payouts Management
      </h1>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" /> Payout Method Applications
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {methodsLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : methods.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No payout method applications</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-3 md:px-6 py-3 text-left">User</th>
                  <th className="px-3 md:px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left hidden md:table-cell">Details</th>
                  <th className="px-3 md:px-6 py-3 text-left">Status</th>
                  <th className="px-3 md:px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((m: any) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    data-testid={`row-method-${m.id}`}
                  >
                    <td className="px-3 md:px-6 py-4 text-gray-900 font-medium" data-testid={`text-method-user-${m.id}`}>
                      <span className="truncate block max-w-[100px] md:max-w-none">{m.user?.fullName || m.user?.username || `User #${m.userId}`}</span>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-gray-600 capitalize" data-testid={`text-method-type-${m.id}`}>
                      {m.type?.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[300px] truncate hidden md:table-cell" data-testid={`text-method-details-${m.id}`}>
                      {m.details}
                    </td>
                    <td className="px-3 md:px-6 py-4">{statusPill(m.status)}</td>
                    <td className="px-3 md:px-6 py-4 text-center">
                      {m.status === "pending" && (
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <Button
                            size="sm"
                            onClick={() => methodMutation.mutate({ id: m.id, status: "approved" })}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                            data-testid={`button-approve-method-${m.id}`}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectTarget({ type: "method", id: m.id })}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-md"
                            data-testid={`button-reject-method-${m.id}`}
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
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" /> Payout Requests
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {payoutsLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : payouts.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No payout requests</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-3 md:px-6 py-3 text-left">User</th>
                  <th className="px-3 md:px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left hidden md:table-cell">Method</th>
                  <th className="px-3 md:px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left hidden md:table-cell">Date</th>
                  <th className="px-3 md:px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    data-testid={`row-payout-${p.id}`}
                  >
                    <td className="px-3 md:px-6 py-4 text-gray-900 font-medium" data-testid={`text-payout-user-${p.id}`}>
                      <span className="truncate block max-w-[100px] md:max-w-none">{p.user?.fullName || p.user?.username || `User #${p.userId}`}</span>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-gray-900 font-semibold" data-testid={`text-payout-amount-${p.id}`}>
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize hidden md:table-cell" data-testid={`text-payout-method-${p.id}`}>
                      {p.method?.type?.replace("_", " ") || "—"}
                    </td>
                    <td className="px-3 md:px-6 py-4">{statusPill(p.status)}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-center">
                      {p.status === "pending" && (
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <Button
                            size="sm"
                            onClick={() => payoutMutation.mutate({ id: p.id, status: "approved" })}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                            data-testid={`button-approve-payout-${p.id}`}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectTarget({ type: "payout", id: p.id })}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-md"
                            data-testid={`button-reject-payout-${p.id}`}
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
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) { setRejectTarget(null); setRejectionReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {rejectTarget?.type === "method" ? "Payout Method" : "Payout Request"}</DialogTitle>
            <DialogDescription>Provide a reason for rejection.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
            data-testid="input-payout-rejection-reason"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionReason(""); }}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="button-confirm-reject-payout"
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
