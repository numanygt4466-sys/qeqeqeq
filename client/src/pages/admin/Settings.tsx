import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [minimumPayout, setMinimumPayout] = useState("");
  const [allowCrypto, setAllowCrypto] = useState(false);
  const [allowBankTransfer, setAllowBankTransfer] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { data: settings = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings.length > 0) {
      const minPayout = settings.find((s: any) => s.key === "minimum_payout");
      const allowedMethods = settings.find((s: any) => s.key === "allowed_payout_methods");

      if (minPayout) setMinimumPayout(minPayout.value);
      if (allowedMethods) {
        try {
          const methods = JSON.parse(allowedMethods.value);
          setAllowCrypto(methods.includes("crypto"));
          setAllowBankTransfer(methods.includes("bank_transfer"));
        } catch {
          setAllowCrypto(false);
          setAllowBankTransfer(false);
        }
      }
      setIsDirty(false);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const allowedMethods: string[] = [];
      if (allowCrypto) allowedMethods.push("crypto");
      if (allowBankTransfer) allowedMethods.push("bank_transfer");

      await apiRequest("PUT", "/api/admin/settings", {
        key: "minimum_payout",
        value: minimumPayout,
      });
      await apiRequest("PUT", "/api/admin/settings", {
        key: "allowed_payout_methods",
        value: JSON.stringify(allowedMethods),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setIsDirty(false);
      toast({ title: "Settings saved successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleChange = (setter: (v: any) => void, value: any) => {
    setter(value);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-settings-title">
          Platform Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure platform-wide settings</p>
      </header>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
      ) : (
        <Card className="bg-white border border-gray-200 rounded-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Payout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Minimum Payout Amount ($)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={minimumPayout}
                onChange={(e) => handleChange(setMinimumPayout, e.target.value)}
                className="max-w-xs rounded-md"
                data-testid="input-minimum-payout"
              />
              <p className="text-xs text-gray-400">
                Users must reach this amount before requesting a payout.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Allowed Payout Methods
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow-crypto"
                    checked={allowCrypto}
                    onCheckedChange={(checked) =>
                      handleChange(setAllowCrypto, checked === true)
                    }
                    data-testid="checkbox-allow-crypto"
                  />
                  <label
                    htmlFor="allow-crypto"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Crypto
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow-bank-transfer"
                    checked={allowBankTransfer}
                    onCheckedChange={(checked) =>
                      handleChange(setAllowBankTransfer, checked === true)
                    }
                    data-testid="checkbox-allow-bank-transfer"
                  />
                  <label
                    htmlFor="allow-bank-transfer"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!isDirty || saveMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                data-testid="button-save-settings"
              >
                <Save className="w-4 h-4 mr-1" />
                {saveMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
