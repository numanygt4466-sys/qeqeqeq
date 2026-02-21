import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  UploadCloud,
  FileAudio,
  Globe2,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";

type TrackData = {
  title: string;
  trackNumber: number;
  isExplicit: boolean;
  audioUrl: string;
  audioFileName: string;
  isrc: string;
  uploading: boolean;
  uploaded: boolean;
};

type DSP = {
  id: number;
  name: string;
  region: string;
  enabled: boolean;
};

export default function Upload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    artwork: true,
    tracks: true,
    distribution: true,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [releaseInfo, setReleaseInfo] = useState({
    title: "",
    version: "",
    primaryArtist: "",
    releaseType: "Single",
    genre: "",
    language: "",
    releaseDate: "",
    upc: "",
    catalogNumber: "",
  });

  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [tracks, setTracks] = useState<TrackData[]>([
    { title: "", trackNumber: 1, isExplicit: false, audioUrl: "", audioFileName: "", isrc: "", uploading: false, uploaded: false },
  ]);

  const [selectedDspIds, setSelectedDspIds] = useState<number[]>([]);
  const [dspSearch, setDspSearch] = useState("");

  const { data: dspList = [] } = useQuery<DSP[]>({
    queryKey: ["/api/dsps"],
  });

  const enabledDsps = dspList.filter((d) => d.enabled);
  const filteredDsps = enabledDsps.filter((d) =>
    d.name.toLowerCase().includes(dspSearch.toLowerCase()) ||
    d.region.toLowerCase().includes(dspSearch.toLowerCase())
  );

  const groupedDsps = filteredDsps.reduce<Record<string, DSP[]>>((acc, dsp) => {
    const region = dsp.region || "Global";
    if (!acc[region]) acc[region] = [];
    acc[region].push(dsp);
    return acc;
  }, {});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!releaseInfo.title.trim()) e.title = "Required";
    if (!releaseInfo.primaryArtist.trim()) e.primaryArtist = "Required";
    if (!releaseInfo.releaseType) e.releaseType = "Required";
    if (!releaseInfo.genre.trim()) e.genre = "Required";
    if (!releaseInfo.language.trim()) e.language = "Required";
    if (!releaseInfo.releaseDate) {
      e.releaseDate = "Required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (releaseInfo.releaseDate < today) e.releaseDate = "Cannot be in the past";
    }
    if (!coverArtUrl) e.cover = "Cover art is required";
    if (tracks.length === 0) e.tracks = "At least 1 track required";
    tracks.forEach((t, i) => {
      if (!t.title.trim()) e[`track_${i}_title`] = "Required";
      if (!t.audioUrl) e[`track_${i}_audio`] = "Audio file required";
    });
    if (selectedDspIds.length === 0) e.dsps = "Select at least 1 platform";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      if (e.title || e.primaryArtist || e.releaseType || e.genre || e.language || e.releaseDate)
        setExpandedSections((p) => ({ ...p, metadata: true }));
      if (e.cover) setExpandedSections((p) => ({ ...p, artwork: true }));
      if (e.tracks || Object.keys(e).some((k) => k.startsWith("track_")))
        setExpandedSections((p) => ({ ...p, tracks: true }));
      if (e.dsps) setExpandedSections((p) => ({ ...p, distribution: true }));
    }
    return Object.keys(e).length === 0;
  };

  const handleCoverUpload = async (file: File) => {
    setCoverUploading(true);
    setErrors((prev) => ({ ...prev, cover: "" }));

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    const dimensionCheck = await new Promise<{ width: number; height: number }>((resolve) => {
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = objectUrl;
    });

    if (dimensionCheck.width < 3000 || dimensionCheck.height < 3000) {
      setCoverUploading(false);
      setErrors((prev) => ({ ...prev, cover: `Image must be at least 3000×3000px. Yours is ${dimensionCheck.width}×${dimensionCheck.height}px.` }));
      toast({ title: "Cover image too small", description: `Minimum 3000×3000px required. Yours: ${dimensionCheck.width}×${dimensionCheck.height}px.`, variant: "destructive" });
      URL.revokeObjectURL(objectUrl);
      return;
    }

    if (dimensionCheck.width !== dimensionCheck.height) {
      setCoverUploading(false);
      setErrors((prev) => ({ ...prev, cover: `Image must be square (1:1). Yours is ${dimensionCheck.width}×${dimensionCheck.height}px.` }));
      toast({ title: "Cover image must be square", description: "Please upload a 1:1 aspect ratio image.", variant: "destructive" });
      URL.revokeObjectURL(objectUrl);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cover", file);
      const res = await fetch("/api/upload/cover", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCoverArtUrl(data.url);
      setCoverFileName(data.fileName);
      setCoverPreview(objectUrl);
      toast({ title: "Cover uploaded successfully" });
    } catch {
      setErrors((prev) => ({ ...prev, cover: "Failed to upload cover image" }));
      toast({ title: "Cover upload failed", variant: "destructive" });
      URL.revokeObjectURL(objectUrl);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleAudioUpload = async (index: number, file: File) => {
    setTracks((prev) => prev.map((t, i) => (i === index ? { ...t, uploading: true } : t)));
    try {
      const formData = new FormData();
      formData.append("audio", file);
      const res = await fetch("/api/upload/audio", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setTracks((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, audioUrl: data.url, audioFileName: data.fileName, uploading: false, uploaded: true } : t
        )
      );
      toast({ title: `Track ${index + 1} audio uploaded` });
    } catch {
      setTracks((prev) => prev.map((t, i) => (i === index ? { ...t, uploading: false } : t)));
      toast({ title: "Audio upload failed", variant: "destructive" });
    }
  };

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      { title: "", trackNumber: prev.length + 1, isExplicit: false, audioUrl: "", audioFileName: "", isrc: "", uploading: false, uploaded: false },
    ]);
  };

  const removeTrack = (i: number) => {
    if (tracks.length > 1) setTracks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateTrack = (i: number, field: keyof TrackData, value: any) => {
    setTracks((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  };

  const toggleDsp = (id: number) => {
    setSelectedDspIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const selectAllDsps = () => setSelectedDspIds(enabledDsps.map((d) => d.id));
  const deselectAllDsps = () => setSelectedDspIds([]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const body = {
        title: releaseInfo.title,
        primaryArtist: releaseInfo.primaryArtist,
        releaseType: releaseInfo.releaseType,
        genre: releaseInfo.genre,
        language: releaseInfo.language,
        releaseDate: releaseInfo.releaseDate,
        coverArtUrl,
        version: releaseInfo.version || undefined,
        upc: releaseInfo.upc || undefined,
        catalogNumber: releaseInfo.catalogNumber || undefined,
        dspIds: selectedDspIds,
        tracks: tracks.map((t, i) => ({
          title: t.title,
          trackNumber: i + 1,
          isExplicit: t.isExplicit,
          audioUrl: t.audioUrl,
          audioFileName: t.audioFileName,
          isrc: t.isrc || undefined,
        })),
      };
      await apiRequest("POST", "/api/releases", body);
      queryClient.invalidateQueries({ queryKey: ["/api/releases"] });
      toast({ title: "Release submitted successfully!" });
      setLocation("/app/catalog");
    } catch (err: any) {
      const message = err?.message?.replace(/^\d+:\s*/, "") || "Failed to submit release";
      toast({ title: "Submission failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <span className="text-red-500 text-xs flex items-center gap-1 mt-1" data-testid={`error-${name}`}>
        <AlertCircle className="w-3 h-3" />
        {errors[name]}
      </span>
    ) : null;

  const SectionHeader = ({ title, icon: Icon, sectionKey, badge }: { title: string; icon: any; sectionKey: string; badge?: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
      data-testid={`toggle-section-${sectionKey}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</span>
        {badge && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
      </div>
      {expandedSections[sectionKey] ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">New Release</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in all sections below, then submit for review.</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-10"
          data-testid="button-submit-release"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {submitting ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader title="Release Information" icon={FileAudio} sectionKey="metadata" />
        {expandedSections.metadata && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title *</label>
                <Input
                  value={releaseInfo.title}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, title: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="Release title"
                  data-testid="input-release-title"
                />
                <FieldError name="title" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version</label>
                <Input
                  value={releaseInfo.version}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, version: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="e.g. Deluxe Edition"
                  data-testid="input-version"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Primary Artist *</label>
                <Input
                  value={releaseInfo.primaryArtist}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, primaryArtist: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="Artist name"
                  data-testid="input-primary-artist"
                />
                <FieldError name="primaryArtist" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Release Type *</label>
                <select
                  value={releaseInfo.releaseType}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, releaseType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  data-testid="select-release-type"
                >
                  <option value="Single">Single</option>
                  <option value="EP">EP</option>
                  <option value="Album">Album</option>
                  <option value="Compilation">Compilation</option>
                </select>
                <FieldError name="releaseType" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Genre *</label>
                <Input
                  value={releaseInfo.genre}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, genre: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="e.g. Electronic, Hip-Hop"
                  data-testid="input-genre"
                />
                <FieldError name="genre" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language *</label>
                <select
                  value={releaseInfo.language}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, language: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  data-testid="select-language"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Russian">Russian</option>
                  <option value="Instrumental">Instrumental</option>
                  <option value="Other">Other</option>
                </select>
                <FieldError name="language" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Release Date *</label>
                <Input
                  type="date"
                  value={releaseInfo.releaseDate}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, releaseDate: e.target.value }))}
                  min={todayStr}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  data-testid="input-release-date"
                />
                <FieldError name="releaseDate" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">UPC</label>
                <Input
                  value={releaseInfo.upc}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, upc: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="Optional — auto-generated if blank"
                  data-testid="input-upc"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog Number</label>
                <Input
                  value={releaseInfo.catalogNumber}
                  onChange={(e) => setReleaseInfo((p) => ({ ...p, catalogNumber: e.target.value }))}
                  className="h-10 text-sm text-gray-900 bg-white border-gray-300"
                  placeholder="Optional"
                  data-testid="input-catalog-number"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader title="Artwork" icon={ImageIcon} sectionKey="artwork" badge={coverArtUrl ? "Uploaded" : undefined} />
        {expandedSections.artwork && (
          <div className="p-5">
            <div className="flex gap-6 items-start">
              <div className="shrink-0">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm" data-testid="img-cover-preview" />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                    {coverUploading ? (
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-400">{coverUploading ? "Uploading..." : "No artwork"}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Cover Art</p>
                  <p className="text-xs text-gray-500 mt-1">JPG or PNG, minimum 3000 × 3000 px, square format. <span className="text-red-500 font-medium">Required.</span></p>
                </div>
                {coverFileName && (
                  <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">{coverFileName}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  data-testid="button-upload-cover"
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  {coverPreview ? "Replace" : "Upload Cover Art"}
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverUpload(file);
                  }}
                  data-testid="input-cover-file"
                />
                <FieldError name="cover" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader title="Tracks" icon={FileAudio} sectionKey="tracks" badge={`${tracks.length} track${tracks.length !== 1 ? "s" : ""}`} />
        {expandedSections.tracks && (
          <div className="p-5 space-y-4">
            {errors.tracks && (
              <div className="text-red-500 text-sm flex items-center gap-2" data-testid="error-tracks">
                <AlertCircle className="w-4 h-4" /> {errors.tracks}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-tracks">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ISRC</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Audio</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Explicit</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0" data-testid={`track-row-${i}`}>
                      <td className="py-3 px-3 text-gray-400 font-medium">{i + 1}</td>
                      <td className="py-3 px-3">
                        <Input
                          value={track.title}
                          onChange={(e) => updateTrack(i, "title", e.target.value)}
                          className="h-9 text-sm text-gray-900 bg-white border-gray-300"
                          placeholder="Track title"
                          data-testid={`input-track-title-${i}`}
                        />
                        <FieldError name={`track_${i}_title`} />
                      </td>
                      <td className="py-3 px-3">
                        <Input
                          value={track.isrc}
                          onChange={(e) => updateTrack(i, "isrc", e.target.value)}
                          className="h-9 text-sm text-gray-900 bg-white border-gray-300"
                          placeholder="Optional"
                          data-testid={`input-track-isrc-${i}`}
                        />
                      </td>
                      <td className="py-3 px-3">
                        {track.uploaded ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium" data-testid={`text-track-audio-status-${i}`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">{track.audioFileName}</span>
                          </div>
                        ) : track.uploading ? (
                          <div className="flex items-center gap-1.5 text-indigo-600 text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </div>
                        ) : (
                          <div>
                            <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                              <UploadCloud className="w-3.5 h-3.5" />
                              Upload WAV
                              <input
                                type="file"
                                accept=".wav,audio/wav"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAudioUpload(i, file);
                                }}
                                data-testid={`input-track-audio-${i}`}
                              />
                            </label>
                            <FieldError name={`track_${i}_audio`} />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={track.isExplicit}
                          onChange={(e) => updateTrack(i, "isExplicit", e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          data-testid={`checkbox-explicit-${i}`}
                        />
                      </td>
                      <td className="py-3 px-3">
                        {tracks.length > 1 && (
                          <button
                            onClick={() => removeTrack(i)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            data-testid={`button-remove-track-${i}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addTrack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              data-testid="button-add-track"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Track
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader
          title="Distribution"
          icon={Globe2}
          sectionKey="distribution"
          badge={selectedDspIds.length > 0 ? `${selectedDspIds.length} selected` : undefined}
        />
        {expandedSections.distribution && (
          <div className="p-5 space-y-4">
            {errors.dsps && (
              <div className="text-red-500 text-sm flex items-center gap-2" data-testid="error-dsps">
                <AlertCircle className="w-4 h-4" /> {errors.dsps}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={dspSearch}
                  onChange={(e) => setDspSearch(e.target.value)}
                  placeholder="Search platforms..."
                  className="pl-9 h-9 text-sm text-gray-900 bg-white border-gray-300"
                  data-testid="input-dsp-search"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllDsps}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                data-testid="button-select-all-dsps"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={deselectAllDsps}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                data-testid="button-deselect-all-dsps"
              >
                Deselect All
              </Button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {Object.entries(groupedDsps)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([region, dsps]) => (
                  <div key={region}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {region.replace(/_/g, " ")}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {dsps.map((dsp) => (
                        <label
                          key={dsp.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-colors ${
                            selectedDspIds.includes(dsp.id)
                              ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          }`}
                          data-testid={`dsp-option-${dsp.id}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDspIds.includes(dsp.id)}
                            onChange={() => toggleDsp(dsp.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span className="truncate text-xs">{dsp.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pb-8">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
          data-testid="button-submit-release-bottom"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {submitting ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}
