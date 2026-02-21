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
import { CheckCircle, XCircle, Clock, Music, Eye, Edit } from "lucide-react";

export default function AdminReleases() {
  const { toast } = useToast();
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editRelease, setEditRelease] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const { data: releases = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/releases"],
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: string;
      rejectionReason?: string;
    }) => {
      await apiRequest("PATCH", `/api/admin/releases/${id}`, {
        status,
        rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/releases"] });
      setRejectionId(null);
      setRejectionReason("");
      toast({ title: "Success", description: "Release status updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/admin/releases/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/releases"] });
      setEditRelease(null);
      toast({ title: "Success", description: "Release updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const openEditDialog = (release: any) => {
    setEditRelease(release);
    setEditForm({
      title: release.title || "",
      primaryArtist: release.primaryArtist || "",
      releaseType: release.releaseType || "",
      genre: release.genre || "",
      releaseDate: release.releaseDate || "",
    });
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
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-releases-title">
        Release Queue
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : releases.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No releases found</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-3 md:px-6 py-3 text-left hidden md:table-cell">Cover</th>
                <th className="px-3 md:px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Artist</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Type</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Date</th>
                <th className="px-3 md:px-6 py-3 text-left">Status</th>
                <th className="px-3 md:px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release: any) => (
                <tr
                  key={release.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  data-testid={`row-release-${release.id}`}
                >
                  <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                    {release.coverArtUrl ? (
                      <img
                        src={release.coverArtUrl}
                        alt={release.title}
                        className="w-10 h-10 rounded object-cover"
                        data-testid={`img-cover-${release.id}`}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Music className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-[150px] md:max-w-none" data-testid={`text-release-title-${release.id}`}>
                      {release.title}
                    </div>
                    <div className="text-xs text-gray-500">ID: {release.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell" data-testid={`text-release-artist-${release.id}`}>
                    {release.primaryArtist}
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize hidden md:table-cell">{release.releaseType}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{release.releaseDate}</td>
                  <td className="px-3 md:px-6 py-4">{statusPill(release.status)}</td>
                  <td className="px-3 md:px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(release)}
                        className="rounded-md"
                        data-testid={`button-edit-release-${release.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      {release.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => statusMutation.mutate({ id: release.id, status: "approved" })}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                            data-testid={`button-approve-release-${release.id}`}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectionId(release.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-md"
                            data-testid={`button-reject-release-${release.id}`}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Dialog open={!!rejectionId} onOpenChange={(open) => { if (!open) { setRejectionId(null); setRejectionReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Release</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this release.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
            data-testid="input-release-rejection-reason"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectionId(null); setRejectionReason(""); }}>
              Cancel
            </Button>
            <Button
              onClick={() => rejectionId && statusMutation.mutate({ id: rejectionId, status: "rejected", rejectionReason })}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="button-confirm-reject-release"
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRelease} onOpenChange={(open) => { if (!open) setEditRelease(null); }}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Release Details</DialogTitle>
            <DialogDescription>View and edit release information.</DialogDescription>
          </DialogHeader>
          {editRelease && (
            <div className="space-y-4">
              {editRelease.coverArtUrl && (
                <img
                  src={editRelease.coverArtUrl}
                  alt={editRelease.title}
                  className="w-32 h-32 rounded-lg object-cover"
                  data-testid="img-edit-cover"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    data-testid="input-edit-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Primary Artist</label>
                  <Input
                    value={editForm.primaryArtist}
                    onChange={(e) => setEditForm({ ...editForm, primaryArtist: e.target.value })}
                    data-testid="input-edit-artist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Release Type</label>
                  <Input
                    value={editForm.releaseType}
                    onChange={(e) => setEditForm({ ...editForm, releaseType: e.target.value })}
                    data-testid="input-edit-type"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Genre</label>
                  <Input
                    value={editForm.genre}
                    onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                    data-testid="input-edit-genre"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Release Date</label>
                  <Input
                    type="date"
                    value={editForm.releaseDate}
                    onChange={(e) => setEditForm({ ...editForm, releaseDate: e.target.value })}
                    data-testid="input-edit-date"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <span>{statusPill(editRelease.status)}</span>
                </div>
              </div>

              {editRelease.tracks && editRelease.tracks.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tracks ({editRelease.tracks.length})
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {editRelease.tracks.map((track: any, i: number) => (
                      <div key={track.id || i} className="flex items-center gap-3 text-sm text-gray-700" data-testid={`text-track-${i}`}>
                        <span className="text-gray-400 w-6 text-right">{track.trackNumber || i + 1}.</span>
                        <span className="flex-1">{track.title}</span>
                        {track.isExplicit && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">E</span>
                        )}
                        {track.duration && <span className="text-gray-400">{track.duration}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editRelease.user && (
                <div className="border-t border-gray-100 pt-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Submitted by</label>
                  <p className="text-sm text-gray-600">
                    {editRelease.user.fullName} (@{editRelease.user.username}) — {editRelease.user.email}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRelease(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => editRelease && editMutation.mutate({ id: editRelease.id, data: editForm })}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              data-testid="button-save-release"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
