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
import { Plus, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { format } from "date-fns";

type NewsPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  status: string;
  authorId: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { id: number; fullName: string };
};

export default function AdminNews() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<NewsPost | null>(null);
  const [deletePost, setDeletePost] = useState<NewsPost | null>(null);
  const [previewPost, setPreviewPost] = useState<NewsPost | null>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", status: "draft" });

  const { data: posts = [], isLoading } = useQuery<NewsPost[]>({
    queryKey: ["/api/admin/news"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      await apiRequest("POST", "/api/admin/news", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      resetForm();
      toast({ title: "Post created successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof form }) => {
      await apiRequest("PUT", `/api/admin/news/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      resetForm();
      toast({ title: "Post updated successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setDeletePost(null);
      toast({ title: "Post deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditPost(null);
    setForm({ title: "", content: "", excerpt: "", status: "draft" });
  };

  const openEdit = (post: NewsPost) => {
    setEditPost(post);
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      status: post.status,
    });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditPost(null);
    setForm({ title: "", content: "", excerpt: "", status: "draft" });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (editPost) {
      updateMutation.mutate({ id: editPost.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const statusBadge = (status: string) => {
    if (status === "published") {
      return <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" data-testid="badge-published">Published</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200" data-testid="badge-draft">Draft</span>;
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-news-title">News Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage news posts for your platform</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-black hover:bg-gray-800 text-white rounded-md"
          data-testid="button-create-post"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Post
        </Button>
      </header>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-md">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No news posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm" data-testid="table-news-posts">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-news-${post.id}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 truncate max-w-[280px]" data-testid={`text-news-title-${post.id}`}>{post.title}</div>
                    {post.excerpt && (
                      <div className="text-gray-400 text-xs mt-0.5 truncate max-w-[280px]">{post.excerpt}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {post.author?.fullName || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {statusBadge(post.status)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "MMM d, yyyy")
                      : format(new Date(post.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewPost(post)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                        data-testid={`button-preview-${post.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(post)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        data-testid={`button-edit-${post.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletePost(post)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        data-testid={`button-delete-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="w-[95vw] max-w-2xl bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editPost ? "Update the details of this news post." : "Fill in the details to create a new news post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter post title..."
                className="rounded-md"
                data-testid="input-post-title"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief summary (optional)..."
                className="rounded-md"
                data-testid="input-post-excerpt"
              />
              <p className="text-xs text-gray-400">A short summary shown in post listings</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your post content..."
                rows={10}
                className="rounded-md resize-none"
                data-testid="input-post-content"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="w-48 rounded-md" data-testid="select-post-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-md" data-testid="button-cancel-post">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || !form.title || !form.content}
              className="bg-black hover:bg-gray-800 text-white rounded-md"
              data-testid="button-save-post"
            >
              {isPending ? "Saving..." : editPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletePost} onOpenChange={(open) => { if (!open) setDeletePost(null); }}>
        <DialogContent className="max-w-md bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Delete Post</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to delete "{deletePost?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletePost(null)} className="rounded-md" data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletePost && deleteMutation.mutate(deletePost.id)}
              disabled={deleteMutation.isPending}
              className="rounded-md"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewPost} onOpenChange={(open) => { if (!open) setPreviewPost(null); }}>
        <DialogContent className="w-[95vw] max-w-2xl bg-white rounded-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900" data-testid="text-preview-title">
              {previewPost?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {previewPost?.author?.fullName && `By ${previewPost.author.fullName}`}
              {previewPost?.publishedAt && ` · ${format(new Date(previewPost.publishedAt), "MMMM d, yyyy")}`}
              {!previewPost?.publishedAt && previewPost?.createdAt && ` · ${format(new Date(previewPost.createdAt), "MMMM d, yyyy")}`}
              {" · "}
              {previewPost?.status === "published" ? "Published" : "Draft"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {previewPost?.excerpt && (
              <p className="text-gray-600 italic mb-4 pb-4 border-b border-gray-200">{previewPost.excerpt}</p>
            )}
            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap" data-testid="text-preview-content">
              {previewPost?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
