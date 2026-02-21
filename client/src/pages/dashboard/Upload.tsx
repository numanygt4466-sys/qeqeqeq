import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UploadCloud, FileAudio, Globe2, Plus, Trash2, AlertCircle } from "lucide-react";

type TrackData = { title: string; trackNumber: number; isExplicit: boolean; audioFileName: string; duration: string; };

export default function Upload() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [releaseInfo, setReleaseInfo] = useState({
    title: "", version: "", primaryArtist: "", releaseType: "single",
    genre: "", language: "", releaseDate: "",
  });
  const [tracks, setTracks] = useState<TrackData[]>([
    { title: "", trackNumber: 1, isExplicit: false, audioFileName: "", duration: "" },
  ]);
  const [dsps, setDsps] = useState<string[]>([]);

  const allDsps = ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Tidal", "Deezer", "SoundCloud", "Pandora"];

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/releases", {
        ...releaseInfo,
        dsps,
        tracks: tracks.map((t, i) => ({ ...t, trackNumber: i + 1 })),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/releases"] });
      setLocation("/app/catalog");
    },
  });

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
    if (tracks.length === 0) { e.tracks = "At least 1 track is required"; setErrors(e); return false; }
    tracks.forEach((t, i) => {
      if (!t.title.trim()) e[`track_${i}_title`] = "Track title required";
      if (!t.audioFileName.trim()) e[`track_${i}_audio`] = "Audio file required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    if (dsps.length === 0) e.dsps = "Select at least 1 platform";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const addTrack = () => {
    setTracks(prev => [...prev, { title: "", trackNumber: prev.length + 1, isExplicit: false, audioFileName: "", duration: "" }]);
  };

  const removeTrack = (i: number) => {
    if (tracks.length > 1) setTracks(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateTrack = (i: number, field: keyof TrackData, value: any) => {
    setTracks(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const toggleDsp = (name: string) => {
    setDsps(prev => prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]);
  };

  const steps = [
    { num: 1, title: "Release Info", icon: FileAudio },
    { num: 2, title: "Tracks", icon: UploadCloud },
    { num: 3, title: "Distribution", icon: Globe2 },
    { num: 4, title: "Review", icon: CheckCircle2 },
  ];

  const FieldError = ({ name }: { name: string }) => 
    errors[name] ? <span className="text-red-400 text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors[name]}</span> : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">Release Wizard</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">New Release</h1>
      </header>

      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-primary z-0 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-black px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.num ? 'border-primary bg-primary text-black' : 'border-white/20 bg-black text-white/40'}`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest absolute -bottom-6 w-32 text-center ${step >= s.num ? 'text-white' : 'text-white/40'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="bg-black border-white/10 rounded-none mt-12">
        <CardHeader className="border-b border-white/5 pb-6">
          <CardTitle className="text-xl font-black tracking-tighter uppercase">{steps[step-1].title}</CardTitle>
          <CardDescription className="text-xs text-white/40 uppercase tracking-widest">
            {step === 1 && "Basic metadata and crediting information"}
            {step === 2 && "Add your tracks and audio files"}
            {step === 3 && "Select distribution platforms"}
            {step === 4 && "Final review before submission"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Release Title *</label>
                  <Input value={releaseInfo.title} onChange={e => setReleaseInfo(p => ({...p, title: e.target.value}))} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="e.g. Concrete Pulse" data-testid="input-release-title" />
                  <FieldError name="title" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Version</label>
                  <Input value={releaseInfo.version} onChange={e => setReleaseInfo(p => ({...p, version: e.target.value}))} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="e.g. Original Mix" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Primary Artist *</label>
                  <Input value={releaseInfo.primaryArtist} onChange={e => setReleaseInfo(p => ({...p, primaryArtist: e.target.value}))} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="Artist name" data-testid="input-primary-artist" />
                  <FieldError name="primaryArtist" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Release Type *</label>
                  <select value={releaseInfo.releaseType} onChange={e => setReleaseInfo(p => ({...p, releaseType: e.target.value}))} className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none" data-testid="select-release-type">
                    <option value="single" className="bg-black">Single</option>
                    <option value="ep" className="bg-black">EP</option>
                    <option value="album" className="bg-black">Album</option>
                  </select>
                  <FieldError name="releaseType" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Genre *</label>
                  <select value={releaseInfo.genre} onChange={e => setReleaseInfo(p => ({...p, genre: e.target.value}))} className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none" data-testid="select-genre">
                    <option value="" className="bg-black">Select Genre</option>
                    <option value="electronic" className="bg-black">Electronic</option>
                    <option value="techno" className="bg-black">Techno</option>
                    <option value="ambient" className="bg-black">Ambient</option>
                    <option value="experimental" className="bg-black">Experimental</option>
                    <option value="hip-hop" className="bg-black">Hip-Hop</option>
                    <option value="pop" className="bg-black">Pop</option>
                    <option value="rock" className="bg-black">Rock</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                  <FieldError name="genre" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Language *</label>
                  <select value={releaseInfo.language} onChange={e => setReleaseInfo(p => ({...p, language: e.target.value}))} className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none" data-testid="select-language">
                    <option value="" className="bg-black">Select Language</option>
                    <option value="instrumental" className="bg-black">Instrumental</option>
                    <option value="en" className="bg-black">English</option>
                    <option value="tr" className="bg-black">Turkish</option>
                    <option value="de" className="bg-black">German</option>
                    <option value="ja" className="bg-black">Japanese</option>
                  </select>
                  <FieldError name="language" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Release Date *</label>
                <Input type="date" value={releaseInfo.releaseDate} onChange={e => setReleaseInfo(p => ({...p, releaseDate: e.target.value}))} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" data-testid="input-release-date" />
                <FieldError name="releaseDate" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {errors.tracks && <div className="text-red-400 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" />{errors.tracks}</div>}
              {tracks.map((track, i) => (
                <div key={i} className="border border-white/10 p-6 space-y-4" data-testid={`track-${i}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Track {i + 1}</span>
                    {tracks.length > 1 && (
                      <button onClick={() => removeTrack(i)} className="text-red-400 hover:text-red-300 p-1" data-testid={`button-remove-track-${i}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Track Title *</label>
                      <Input value={track.title} onChange={e => updateTrack(i, "title", e.target.value)} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="Track title" data-testid={`input-track-title-${i}`} />
                      <FieldError name={`track_${i}_title`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Audio File *</label>
                      <Input value={track.audioFileName} onChange={e => updateTrack(i, "audioFileName", e.target.value)} className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="e.g. track01.wav" data-testid={`input-track-audio-${i}`} />
                      <FieldError name={`track_${i}_audio`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={track.isExplicit} onChange={e => updateTrack(i, "isExplicit", e.target.checked)} className="w-4 h-4 bg-black border-white/20" data-testid={`checkbox-explicit-${i}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Explicit Content</span>
                    </label>
                  </div>
                </div>
              ))}
              <Button onClick={addTrack} variant="outline" className="w-full rounded-none border-white/10 border-dashed hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-add-track">
                <Plus className="w-4 h-4 mr-2" /> Add Track
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-xs text-white/40 uppercase tracking-widest">Select platforms for distribution *</p>
              {errors.dsps && <div className="text-red-400 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" />{errors.dsps}</div>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allDsps.map(name => (
                  <button
                    key={name}
                    onClick={() => toggleDsp(name)}
                    className={`p-4 border text-sm font-bold uppercase tracking-widest transition-all ${dsps.includes(name) ? 'border-white bg-white text-black' : 'border-white/10 text-white/60 hover:border-white/30'}`}
                    data-testid={`button-dsp-${name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">
                {dsps.length} platform{dsps.length !== 1 ? 's' : ''} selected
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Title</span>
                  <span className="font-bold uppercase" data-testid="text-review-title">{releaseInfo.title}</span>
                </div>
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Artist</span>
                  <span className="font-bold uppercase">{releaseInfo.primaryArtist}</span>
                </div>
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Type</span>
                  <span className="font-bold uppercase">{releaseInfo.releaseType}</span>
                </div>
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Genre</span>
                  <span className="font-bold uppercase">{releaseInfo.genre}</span>
                </div>
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Release Date</span>
                  <span className="font-bold">{releaseInfo.releaseDate}</span>
                </div>
                <div className="border border-white/10 p-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Tracks</span>
                  <span className="font-bold">{tracks.length}</span>
                </div>
              </div>
              <div className="border border-white/10 p-4">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Distribution Platforms</span>
                <div className="flex flex-wrap gap-2">
                  {dsps.map(d => (
                    <span key={d} className="px-2 py-1 border border-white/20 text-[10px] font-bold uppercase tracking-widest">{d}</span>
                  ))}
                </div>
              </div>
              <div className="border border-white/10 p-4">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Track List</span>
                {tracks.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm">{i + 1}. {t.title} {t.isExplicit && <span className="text-[9px] text-red-400 ml-1">[E]</span>}</span>
                    <span className="text-[10px] text-white/40 font-mono">{t.audioFileName}</span>
                  </div>
                ))}
              </div>
              {submitMutation.error && (
                <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs uppercase tracking-widest" data-testid="text-submit-error">
                  {(submitMutation.error as Error).message?.replace(/^\d+:\s*/, "")}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
            <Button 
              variant="outline" 
              onClick={() => { setStep(s => Math.max(1, s - 1)); setErrors({}); }}
              disabled={step === 1}
              className="rounded-none border-white/10 hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12 px-8"
              data-testid="button-back"
            >
              Back
            </Button>
            {step < 4 ? (
              <Button 
                onClick={handleNext}
                className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-black h-12 px-8"
                data-testid="button-next"
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-black h-12 px-8"
                data-testid="button-submit-release"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Release"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
