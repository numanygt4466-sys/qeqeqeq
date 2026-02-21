import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { User, Pencil, Trash2, KeyRound } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [resetUser, setResetUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [deleteUser, setDeleteUser] = useState<any | null>(null);

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditUser(null);
      toast({ title: "Success", description: "User updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ id, newPassword }: { id: number; newPassword: string }) => {
      await apiRequest("POST", `/api/admin/users/${id}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      setResetUser(null);
      setNewPassword("");
      toast({ title: "Success", description: "Password reset successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDeleteUser(null);
      toast({ title: "Success", description: "User deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const openEditDialog = (u: any) => {
    setEditUser(u);
    setEditForm({
      fullName: u.fullName || "",
      email: u.email || "",
      labelName: u.labelName || "",
      role: u.role || "artist",
      isApproved: u.isApproved ?? false,
    });
  };

  const rolePill = (role: string) => {
    if (role === "label_manager")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Label Manager
        </span>
      );
    if (role === "ar")
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          A&R
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Artist
      </span>
    );
  };

  const statusPill = (isApproved: boolean) => {
    if (isApproved)
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-users-title">
        User Management
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  data-testid={`row-user-${u.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900" data-testid={`text-username-${u.id}`}>
                        {u.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600" data-testid={`text-user-email-${u.id}`}>{u.email}</td>
                  <td className="px-6 py-4 text-gray-900" data-testid={`text-user-fullname-${u.id}`}>{u.fullName}</td>
                  <td className="px-6 py-4">{rolePill(u.role)}</td>
                  <td className="px-6 py-4">{statusPill(u.isApproved)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(u)}
                        className="rounded-md"
                        data-testid={`button-edit-user-${u.id}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setResetUser(u)}
                        className="rounded-md"
                        data-testid={`button-reset-password-${u.id}`}
                      >
                        <KeyRound className="w-3 h-3 mr-1" /> Reset
                      </Button>
                      {u.role !== "label_manager" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteUser(u)}
                          className="border-red-300 text-red-600 hover:bg-red-50 rounded-md"
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
      </div>

      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <Input
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                data-testid="input-edit-fullname"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Label Name</label>
              <Input
                value={editForm.labelName}
                onChange={(e) => setEditForm({ ...editForm, labelName: e.target.value })}
                data-testid="input-edit-labelname"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
              <Select value={editForm.role} onValueChange={(val) => setEditForm({ ...editForm, role: val })}>
                <SelectTrigger data-testid="select-edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="ar">A&R</SelectItem>
                  <SelectItem value="label_manager">Label Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Approved</label>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, isApproved: !editForm.isApproved })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.isApproved ? "bg-indigo-600" : "bg-gray-300"}`}
                data-testid="toggle-approved"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.isApproved ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button
              onClick={() => editUser && updateMutation.mutate({ id: editUser.id, data: editForm })}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              data-testid="button-save-user"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resetUser} onOpenChange={(open) => { if (!open) { setResetUser(null); setNewPassword(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetUser?.fullName} (@{resetUser?.username}).
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password..."
              data-testid="input-new-password"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetUser(null); setNewPassword(""); }}>Cancel</Button>
            <Button
              onClick={() => resetUser && resetPasswordMutation.mutate({ id: resetUser.id, newPassword })}
              disabled={newPassword.length < 6}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              data-testid="button-confirm-reset"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {deleteUser?.fullName} (@{deleteUser?.username})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button
              onClick={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
