import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface BankDetails {
  bankName: string;
  branchName: string;
  branchAddress: string;
  swiftBic: string;
  iban: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
}

interface CryptoDetails {
  walletAddress: string;
  network: string;
  currency: string;
  memo: string;
}

const defaultBankDetails: BankDetails = {
  bankName: "",
  branchName: "",
  branchAddress: "",
  swiftBic: "",
  iban: "",
  accountHolderName: "",
  accountNumber: "",
  routingNumber: "",
};

const defaultCryptoDetails: CryptoDetails = {
  walletAddress: "",
  network: "",
  currency: "",
  memo: "",
};

export default function Payouts() {
  const { toast } = useToast();
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [methodType, setMethodType] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails>({ ...defaultBankDetails });
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({ ...defaultCryptoDetails });
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

  const buildDetailsString = () => {
    if (methodType === "bank_transfer") {
      return JSON.stringify(bankDetails);
    }
    if (methodType === "crypto") {
      return JSON.stringify(cryptoDetails);
    }
    return "";
  };

  const getDetailsSummary = (type: string, details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (type === "bank_transfer") {
        return `${parsed.bankName || "Bank"} — ${parsed.accountHolderName || ""}`.trim();
      }
      if (type === "crypto") {
        return `${parsed.currency || "Crypto"} (${parsed.network || ""}) — ${(parsed.walletAddress || "").substring(0, 12)}...`;
      }
    } catch {
      return details.substring(0, 30);
    }
    return details.substring(0, 30);
  };

  const isBankValid = bankDetails.bankName.trim() && bankDetails.swiftBic.trim() && bankDetails.iban.trim() && bankDetails.accountHolderName.trim();
  const isCryptoValid = cryptoDetails.walletAddress.trim() && cryptoDetails.network && cryptoDetails.currency;
  const isMethodFormValid = methodType === "bank_transfer" ? isBankValid : methodType === "crypto" ? isCryptoValid : false;

  const addMethodMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/payout-methods", {
        type: methodType,
        details: buildDetailsString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payout-methods"] });
      setShowAddMethod(false);
      setMethodType("");
      setBankDetails({ ...defaultBankDetails });
      setCryptoDetails({ ...defaultCryptoDetails });
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
                        {m.type === "crypto" ? "Crypto" : "Bank Transfer"} — {getDetailsSummary(m.type, m.details)}
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
                      <p className="text-xs text-gray-400">{getDetailsSummary(m.type, m.details)}</p>
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
        <DialogContent className="bg-white rounded-md max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Payment Type <span className="text-red-500">*</span></label>
              <Select value={methodType} onValueChange={(v) => { setMethodType(v); }}>
                <SelectTrigger className="rounded-md" data-testid="select-method-type">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {methodType === "bank_transfer" && (
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bank Account Details</p>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Account Holder Name <span className="text-red-500">*</span></label>
                  <Input
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails(d => ({ ...d, accountHolderName: e.target.value }))}
                    placeholder="Full name as it appears on the account"
                    className="rounded-md"
                    data-testid="input-bank-holder-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Bank Name <span className="text-red-500">*</span></label>
                  <Input
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails(d => ({ ...d, bankName: e.target.value }))}
                    placeholder="e.g. Chase, HSBC, Barclays"
                    className="rounded-md"
                    data-testid="input-bank-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Branch Name</label>
                    <Input
                      value={bankDetails.branchName}
                      onChange={(e) => setBankDetails(d => ({ ...d, branchName: e.target.value }))}
                      placeholder="Branch name"
                      className="rounded-md"
                      data-testid="input-bank-branch-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Branch Address</label>
                    <Input
                      value={bankDetails.branchAddress}
                      onChange={(e) => setBankDetails(d => ({ ...d, branchAddress: e.target.value }))}
                      placeholder="Branch address"
                      className="rounded-md"
                      data-testid="input-bank-branch-address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">SWIFT / BIC Code <span className="text-red-500">*</span></label>
                    <Input
                      value={bankDetails.swiftBic}
                      onChange={(e) => setBankDetails(d => ({ ...d, swiftBic: e.target.value.toUpperCase() }))}
                      placeholder="e.g. CHASUS33"
                      className="rounded-md uppercase"
                      data-testid="input-bank-swift"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">IBAN <span className="text-red-500">*</span></label>
                    <Input
                      value={bankDetails.iban}
                      onChange={(e) => setBankDetails(d => ({ ...d, iban: e.target.value.toUpperCase() }))}
                      placeholder="e.g. GB29NWBK60161331926819"
                      className="rounded-md uppercase"
                      data-testid="input-bank-iban"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Account Number</label>
                    <Input
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails(d => ({ ...d, accountNumber: e.target.value }))}
                      placeholder="Account number"
                      className="rounded-md"
                      data-testid="input-bank-account-number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Routing Number</label>
                    <Input
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails(d => ({ ...d, routingNumber: e.target.value }))}
                      placeholder="Routing / Sort code"
                      className="rounded-md"
                      data-testid="input-bank-routing"
                    />
                  </div>
                </div>
              </div>
            )}

            {methodType === "crypto" && (
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cryptocurrency Wallet Details</p>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Wallet Address <span className="text-red-500">*</span></label>
                  <Input
                    value={cryptoDetails.walletAddress}
                    onChange={(e) => setCryptoDetails(d => ({ ...d, walletAddress: e.target.value }))}
                    placeholder="e.g. 0x742d35Cc6634C0532925a3b844..."
                    className="rounded-md font-mono text-xs"
                    data-testid="input-crypto-wallet"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Network <span className="text-red-500">*</span></label>
                    <Select value={cryptoDetails.network} onValueChange={(v) => setCryptoDetails(d => ({ ...d, network: v }))}>
                      <SelectTrigger className="rounded-md" data-testid="select-crypto-network">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ERC20">ERC-20 (Ethereum)</SelectItem>
                        <SelectItem value="TRC20">TRC-20 (Tron)</SelectItem>
                        <SelectItem value="BEP20">BEP-20 (BNB Smart Chain)</SelectItem>
                        <SelectItem value="SOL">Solana (SPL)</SelectItem>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="POLYGON">Polygon</SelectItem>
                        <SelectItem value="ARBITRUM">Arbitrum</SelectItem>
                        <SelectItem value="AVAX">Avalanche (C-Chain)</SelectItem>
                        <SelectItem value="BASE">Base</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Currency <span className="text-red-500">*</span></label>
                    <Select value={cryptoDetails.currency} onValueChange={(v) => setCryptoDetails(d => ({ ...d, currency: v }))}>
                      <SelectTrigger className="rounded-md" data-testid="select-crypto-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDT">USDT (Tether)</SelectItem>
                        <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                        <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                        <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                        <SelectItem value="BNB">BNB</SelectItem>
                        <SelectItem value="SOL">SOL (Solana)</SelectItem>
                        <SelectItem value="DAI">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Memo / Tag</label>
                  <Input
                    value={cryptoDetails.memo}
                    onChange={(e) => setCryptoDetails(d => ({ ...d, memo: e.target.value }))}
                    placeholder="Optional memo or destination tag"
                    className="rounded-md"
                    data-testid="input-crypto-memo"
                  />
                  <p className="text-xs text-gray-400">Required for some networks. Leave blank if not applicable.</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowAddMethod(false); setMethodType(""); setBankDetails({ ...defaultBankDetails }); setCryptoDetails({ ...defaultCryptoDetails }); }}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addMethodMutation.mutate()}
              disabled={!isMethodFormValid || addMethodMutation.isPending}
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
