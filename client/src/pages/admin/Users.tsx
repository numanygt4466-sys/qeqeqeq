import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trash2, Shield } from "lucide-react";

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, role, isApproved }: { id: number; role?: string; isApproved?: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, { role, isApproved });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const roleColor = (role: string) => {
    if (role === "admin") return "text-red-400 border-red-500/20";
    if (role === "label_manager") return "text-blue-400 border-blue-500/20";
    return "text-white/60 border-white/10";
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <header>
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Admin</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" data-testid="text-admin-users-title">User Management</h1>
      </header>

      <Card className="bg-black border-white/5 rounded-none">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xs font-black tracking-[0.3em] uppercase">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-white/40 text-xs uppercase tracking-widest">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`row-user-${u.id}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#111] border border-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-tight">{u.fullName}</div>
                          <div className="text-[10px] text-white/40">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-white/60">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={e => updateMutation.mutate({ id: u.id, role: e.target.value })}
                        className={`bg-transparent border ${roleColor(u.role)} rounded-none px-2 py-1 text-[10px] font-bold uppercase tracking-widest focus:outline-none`}
                        data-testid={`select-role-${u.id}`}
                      >
                        <option value="artist" className="bg-black">Artist</option>
                        <option value="label_manager" className="bg-black">Label Manager</option>
                        <option value="admin" className="bg-black">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${u.isApproved ? 'border-green-500/20 text-green-500' : 'border-yellow-500/20 text-yellow-500'}`}>
                        {u.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] text-white/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!u.isApproved && (
                          <Button
                            size="sm"
                            onClick={() => updateMutation.mutate({ id: u.id, isApproved: true })}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-none h-8 px-3 text-[9px] font-bold uppercase tracking-widest"
                            data-testid={`button-approve-user-${u.id}`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        {u.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm("Delete this user permanently?")) {
                                deleteMutation.mutate(u.id);
                              }
                            }}
                            className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-none h-8 px-3 text-[9px] font-bold uppercase tracking-widest"
                            data-testid={`button-delete-user-${u.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
