import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
    enabled: step === 4,
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

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!releaseInfo.title.trim()) e.title = "Release title is required";
    if (!releaseInfo.primaryArtist.trim()) e.primaryArtist = "Primary artist is required";
    if (!releaseInfo.releaseType) e.releaseType = "Release type is required";
    if (!releaseInfo.genre.trim()) e.genre = "Genre is required";
    if (!releaseInfo.language.trim()) e.language = "Language is required";
    if (!releaseInfo.releaseDate) e.releaseDate = "Release date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!coverArtUrl) e.cover = "Cover art is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    if (tracks.length === 0) {
      e.tracks = "At least 1 track is required";
      setErrors(e);
      return false;
    }
    tracks.forEach((t, i) => {
      if (!t.title.trim()) e[`track_${i}_title`] = "Track title required";
      if (!t.audioUrl) e[`track_${i}_audio`] = "Audio file required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = (): boolean => {
    const e: Record<string, string> = {};
    if (selectedDspIds.length === 0) e.dsps = "Select at least 1 platform";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
  };

  const handleCoverUpload = async (file: File) => {
    setCoverUploading(true);
    setErrors((prev) => ({ ...prev, cover: "" }));
    try {
      const formData = new FormData();
      formData.append("cover", file);
      const res = await fetch("/api/upload/cover", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCoverArtUrl(data.url);
      setCoverFileName(data.fileName);
      setCoverPreview(URL.createObjectURL(file));
      toast({ title: "Cover uploaded successfully" });
    } catch {
      setErrors((prev) => ({ ...prev, cover: "Failed to upload cover image" }));
      toast({ title: "Cover upload failed", variant: "destructive" });
    } finally {
      setCoverUploading(false);
    }
  };

  const handleAudioUpload = async (index: number, file: File) => {
    setTracks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, uploading: true } : t))
    );
    try {
      const formData = new FormData();
      formData.append("audio", file);
      const res = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setTracks((prev) =>
        prev.map((t, i) =>
          i === index
            ? { ...t, audioUrl: data.url, audioFileName: data.fileName, uploading: false, uploaded: true }
            : t
        )
      );
      toast({ title: `Track ${index + 1} audio uploaded` });
    } catch {
      setTracks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, uploading: false } : t))
      );
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
    setSelectedDspIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const selectAllDsps = () => {
    setSelectedDspIds(enabledDsps.map((d) => d.id));
  };

  const deselectAllDsps = () => {
    setSelectedDspIds([]);
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
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

  const steps = [
    { num: 1, title: "Release Info", icon: FileAudio },
    { num: 2, title: "Cover Art", icon: ImageIcon },
    { num: 3, title: "Tracks", icon: UploadCloud },
    { num: 4, title: "Distribution", icon: Globe2 },
  ];

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <span className="text-red-500 text-xs flex items-center gap-1 mt-1" data-testid={`error-${name}`}>
        <AlertCircle className="w-3 h-3" />
        {errors[name]}
      </span>
    ) : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-indigo-600 font-bold tracking-wide uppercase text-xs">Release Wizard</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">New Release</h1>
        <p className="text-sm text-gray-400">Step {step} of 4</p>
      </header>

      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-indigo-600 z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-white px-3" data-testid={`step-indicator-${s.num}`}>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                step > s.num
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : step === s.num
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider absolute -bottom-6 w-28 text-center ${
                step >= s.num ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="bg-white border-gray-200 shadow-sm mt-12">
        <CardHeader className="border-b border-gray-100 pb-6">
          <CardTitle className="text-xl font-bold text-gray-900">{steps[step - 1].title}</CardTitle>
          <CardDescription className="text-sm text-gray-400">
            {step === 1 && "Basic metadata and crediting information"}
            {step === 2 && "Upload your release cover art (JPG or PNG)"}
            {step === 3 && "Add your tracks and upload audio files"}
            {step === 4 && "Select distribution platforms"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Release Title *</label>
                  <Input
                    value={releaseInfo.title}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, title: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="e.g. Concrete Pulse"
                    data-testid="input-release-title"
                  />
                  <FieldError name="title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Version</label>
                  <Input
                    value={releaseInfo.version}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, version: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="e.g. Deluxe Edition"
                    data-testid="input-version"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Primary Artist *</label>
                  <Input
                    value={releaseInfo.primaryArtist}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, primaryArtist: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="Artist name"
                    data-testid="input-primary-artist"
                  />
                  <FieldError name="primaryArtist" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Release Type *</label>
                  <select
                    value={releaseInfo.releaseType}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, releaseType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-md h-11 px-3 text-sm text-gray-900 bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    data-testid="select-release-type"
                  >
                    <option value="Single">Single</option>
                    <option value="EP">EP</option>
                    <option value="Album">Album</option>
                    <option value="Compilation">Compilation</option>
                  </select>
                  <FieldError name="releaseType" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Genre *</label>
                  <Input
                    value={releaseInfo.genre}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, genre: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="e.g. Electronic, Hip-Hop, Pop"
                    data-testid="input-genre"
                  />
                  <FieldError name="genre" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Language *</label>
                  <select
                    value={releaseInfo.language}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, language: e.target.value }))}
                    className="w-full border border-gray-200 rounded-md h-11 px-3 text-sm text-gray-900 bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Release Date *</label>
                  <Input
                    type="date"
                    value={releaseInfo.releaseDate}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, releaseDate: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    data-testid="input-release-date"
                  />
                  <FieldError name="releaseDate" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">UPC</label>
                  <Input
                    value={releaseInfo.upc}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, upc: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="Optional"
                    data-testid="input-upc"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Catalog Number</label>
                  <Input
                    value={releaseInfo.catalogNumber}
                    onChange={(e) => setReleaseInfo((p) => ({ ...p, catalogNumber: e.target.value }))}
                    className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="Optional"
                    data-testid="input-catalog-number"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  coverArtUrl ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-indigo-400 bg-gray-50"
                }`}
              >
                {coverPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={coverPreview}
                      alt="Cover art preview"
                      className="w-64 h-64 object-cover rounded-lg shadow-md"
                      data-testid="img-cover-preview"
                    />
                    <p className="text-sm text-gray-600">{coverFileName}</p>
                    <Button
                      variant="outline"
                      onClick={() => coverInputRef.current?.click()}
                      className="border-gray-200 text-gray-600 hover:bg-gray-100"
                      data-testid="button-replace-cover"
                    >
                      Replace Cover
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {coverUploading ? (
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {coverUploading ? "Uploading..." : "Upload Cover Art"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG or PNG, recommended 3000x3000px</p>
                    </div>
                    {!coverUploading && (
                      <Button
                        onClick={() => coverInputRef.current?.click()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        data-testid="button-upload-cover"
                      >
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    )}
                  </div>
                )}
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
              </div>
              <FieldError name="cover" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {errors.tracks && (
                <div className="text-red-500 text-sm flex items-center gap-2" data-testid="error-tracks">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tracks}
                </div>
              )}
              {tracks.map((track, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white"
                  data-testid={`track-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Track {i + 1}</span>
                    {tracks.length > 1 && (
                      <button
                        onClick={() => removeTrack(i)}
                        className="text-red-400 hover:text-red-600 p-1"
                        data-testid={`button-remove-track-${i}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Track Title *</label>
                      <Input
                        value={track.title}
                        onChange={(e) => updateTrack(i, "title", e.target.value)}
                        className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                        placeholder="Track title"
                        data-testid={`input-track-title-${i}`}
                      />
                      <FieldError name={`track_${i}_title`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Audio File *</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          id={`audio-upload-${i}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAudioUpload(i, file);
                          }}
                          data-testid={`input-track-audio-file-${i}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`audio-upload-${i}`)?.click()}
                          disabled={track.uploading}
                          className="border-gray-200 text-gray-600 hover:bg-gray-100 h-11 flex-shrink-0"
                          data-testid={`button-upload-audio-${i}`}
                        >
                          {track.uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <UploadCloud className="w-4 h-4 mr-2" />
                          )}
                          {track.uploading ? "Uploading..." : "Upload"}
                        </Button>
                        {track.uploaded && (
                          <div className="flex items-center gap-1 text-sm text-green-600" data-testid={`text-track-audio-status-${i}`}>
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="truncate max-w-[180px]">{track.audioFileName}</span>
                          </div>
                        )}
                      </div>
                      <FieldError name={`track_${i}_audio`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">ISRC</label>
                      <Input
                        value={track.isrc}
                        onChange={(e) => updateTrack(i, "isrc", e.target.value)}
                        className="border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                        placeholder="Optional"
                        data-testid={`input-track-isrc-${i}`}
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={track.isExplicit}
                          onChange={(e) => updateTrack(i, "isExplicit", e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          data-testid={`checkbox-explicit-${i}`}
                        />
                        <span className="text-sm font-medium text-gray-600">Explicit Content</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={addTrack}
                variant="outline"
                className="w-full border-gray-200 border-dashed hover:bg-gray-50 text-gray-600 h-12"
                data-testid="button-add-track"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Track
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={dspSearch}
                    onChange={(e) => setDspSearch(e.target.value)}
                    className="pl-9 border-gray-200 h-11 focus:border-indigo-600 focus:ring-indigo-600"
                    placeholder="Search platforms..."
                    data-testid="input-dsp-search"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={selectAllDsps}
                    className="border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
                    data-testid="button-select-all-dsps"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={deselectAllDsps}
                    className="border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
                    data-testid="button-deselect-all-dsps"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              {errors.dsps && (
                <div className="text-red-500 text-sm flex items-center gap-2" data-testid="error-dsps">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dsps}
                </div>
              )}

              {Object.entries(groupedDsps).map(([region, regionDsps]) => (
                <div key={region} className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{region}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {regionDsps.map((dsp) => (
                      <label
                        key={dsp.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDspIds.includes(dsp.id)
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                        data-testid={`dsp-option-${dsp.id}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDspIds.includes(dsp.id)}
                          onChange={() => toggleDsp(dsp.id)}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          data-testid={`checkbox-dsp-${dsp.id}`}
                        />
                        <span className="text-sm font-medium">{dsp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-400" data-testid="text-dsp-count">
                {selectedDspIds.length} platform{selectedDspIds.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-gray-200 text-gray-600 hover:bg-gray-100 h-11 px-6"
              data-testid="button-back"
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6"
                data-testid="button-next"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6"
                data-testid="button-submit-release"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Release"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
