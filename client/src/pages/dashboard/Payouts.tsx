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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Plus, CreditCard, Building } from "lucide-react";

export default function Payouts() {
  const { toast } = useToast();
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [methodType, setMethodType] = useState("");
  const [methodDetails, setMethodDetails] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethodId, setPayoutMethodId] = useState("");

  const { data: balanceData } = useQuery<{ balance: number }>({
    queryKey: ["/api/balance"],
  });

  const { data: methods = [] } = useQuery<any[]>({
    queryKey: ["/api/payout-methods"],
  });

  const { data: payouts = [] } = useQuery<any[]>({
    queryKey: ["/api/payouts"],
  });

  const addMethodMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/payout-methods", {
        type: methodType,
        details: methodDetails,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payout-methods"] });
      setShowAddMethod(false);
      setMethodType("");
      setMethodDetails("");
      toast({ title: "Payment method submitted for approval" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const requestPayoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/payouts", {
        methodId: Number(payoutMethodId),
        amount: Number(payoutAmount),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/balance"] });
      setPayoutAmount("");
      setPayoutMethodId("");
      toast({ title: "Payout request submitted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const balance = balanceData?.balance ?? 0;
  const approvedMethods = methods.filter((m: any) => m.status === "approved");
  const canRequestPayout = approvedMethods.length > 0 && balance >= 50;

  const statusVariant = (status: string) => {
    if (status === "approved" || status === "completed") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-payouts-title">Payouts</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your earnings and payment methods</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-md" data-testid="card-balance">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900" data-testid="text-balance">
              ${balance.toFixed(2)}
            </div>
            <p className="text-xs text-gray-400 mt-2">Minimum payout: $50</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Request Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                <Input
                  type="number"
                  min="50"
                  step="0.01"
                  placeholder="50.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  disabled={!canRequestPayout}
                  className="rounded-md"
                  data-testid="input-payout-amount"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <Select
                  value={payoutMethodId}
                  onValueChange={setPayoutMethodId}
                  disabled={!canRequestPayout}
                >
                  <SelectTrigger className="rounded-md" data-testid="select-payout-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedMethods.map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.type === "crypto" ? "Crypto" : "Bank Transfer"} — {m.details.substring(0, 20)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!canRequestPayout && (
              <p className="text-xs text-gray-400" data-testid="text-payout-disabled-reason">
                {approvedMethods.length === 0
                  ? "You need an approved payment method to request a payout."
                  : "Your balance must be at least $50 to request a payout."}
              </p>
            )}
            <Button
              onClick={() => requestPayoutMutation.mutate()}
              disabled={
                !canRequestPayout ||
                !payoutAmount ||
                !payoutMethodId ||
                Number(payoutAmount) < 50 ||
                Number(payoutAmount) > balance ||
                requestPayoutMutation.isPending
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              data-testid="button-request-payout"
            >
              {requestPayoutMutation.isPending ? "Submitting..." : "Request Payout"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold text-gray-900">Payment Methods</CardTitle>
          <Button
            onClick={() => setShowAddMethod(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            data-testid="button-add-method"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          {methods.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6" data-testid="text-no-methods">
              No payment methods added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {methods.map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                  data-testid={`method-${m.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                      {m.type === "crypto" ? (
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Building className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {m.type === "crypto" ? "Crypto Wallet" : "Bank Transfer"}
                      </p>
                      <p className="text-xs text-gray-400">{m.details}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(m.status)} data-testid={`status-method-${m.id}`}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 rounded-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">Payout History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payouts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8" data-testid="text-no-payouts">
              No payouts yet.
            </p>
          ) : (
            <table className="w-full text-left" data-testid="table-payouts">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payouts.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    data-testid={`row-payout-${p.id}`}
                  >
                    <td className="px-6 py-4 text-gray-600">#{p.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(p.status)} data-testid={`status-payout-${p.id}`}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddMethod} onOpenChange={setShowAddMethod}>
        <DialogContent className="bg-white rounded-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={methodType} onValueChange={setMethodType}>
                <SelectTrigger className="rounded-md" data-testid="select-method-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Details</label>
              <Textarea
                value={methodDetails}
                onChange={(e) => setMethodDetails(e.target.value)}
                placeholder={
                  methodType === "crypto"
                    ? "Enter wallet address..."
                    : "Enter bank account details..."
                }
                className="rounded-md"
                data-testid="input-method-details"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMethod(false)}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addMethodMutation.mutate()}
              disabled={!methodType || !methodDetails.trim() || addMethodMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              data-testid="button-submit-method"
            >
              {addMethodMutation.isPending ? "Submitting..." : "Add Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
