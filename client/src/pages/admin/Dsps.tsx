import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";

export default function Dsps() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: dsps = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/dsps"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      await apiRequest("PATCH", `/api/admin/dsps/${id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dsps"] });
      toast({ title: "DSP updated successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filtered = dsps.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc: Record<string, any[]>, dsp: any) => {
    const region = dsp.region || "Other";
    if (!acc[region]) acc[region] = [];
    acc[region].push(dsp);
    return acc;
  }, {});

  const regions = Object.keys(grouped).sort();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dsps-title">
          DSP Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage digital service providers</p>
      </header>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search DSPs..."
          className="pl-9 rounded-md"
          data-testid="input-search-dsps"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
      ) : regions.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No DSPs found.</div>
      ) : (
        regions.map((region) => (
          <Card key={region} className="bg-white border border-gray-200 rounded-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide" data-testid={`text-region-${region}`}>
                {region}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left" data-testid={`table-dsps-${region}`}>
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Region</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {grouped[region].map((dsp: any) => (
                    <tr
                      key={dsp.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      data-testid={`row-dsp-${dsp.id}`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{dsp.name}</td>
                      <td className="px-6 py-4 text-gray-500">{dsp.region}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={dsp.enabled ? "default" : "secondary"}
                          data-testid={`status-dsp-${dsp.id}`}
                        >
                          {dsp.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-400">
                            {dsp.enabled ? "On" : "Off"}
                          </span>
                          <Switch
                            checked={dsp.enabled}
                            onCheckedChange={(checked) =>
                              toggleMutation.mutate({ id: dsp.id, enabled: checked })
                            }
                            data-testid={`switch-dsp-${dsp.id}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
