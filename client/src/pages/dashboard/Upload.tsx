import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, UploadCloud, FileAudio, Globe2 } from "lucide-react";

export default function Upload() {
  const [step, setStep] = useState(1);

  const steps = [
    { num: 1, title: "Release Info", icon: FileAudio },
    { num: 2, title: "Audio & Assets", icon: UploadCloud },
    { num: 3, title: "Distribution", icon: Globe2 },
    { num: 4, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">Release Wizard</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">New Release</h1>
      </header>

      {/* Progress Bar */}
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
            {step === 2 && "High quality WAV masters and cover art"}
            {step === 3 && "DSP selection and territorial rights"}
            {step === 4 && "Final review before submission"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Release Title</label>
                  <Input className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="e.g. Concrete Pulse" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Version (Optional)</label>
                  <Input className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="e.g. Original Mix, Remastered" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Primary Artist</label>
                  <Input className="bg-transparent border-white/10 rounded-none h-12 focus:border-white focus:ring-0" placeholder="Search or add new..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Release Type</label>
                  <select className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none">
                    <option value="single" className="bg-black">Single (1-3 tracks)</option>
                    <option value="ep" className="bg-black">EP (4-6 tracks)</option>
                    <option value="album" className="bg-black">Album (7+ tracks)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Primary Genre</label>
                  <select className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none">
                    <option value="electronic" className="bg-black">Electronic</option>
                    <option value="techno" className="bg-black">Techno</option>
                    <option value="ambient" className="bg-black">Ambient</option>
                    <option value="experimental" className="bg-black">Experimental</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Language</label>
                  <select className="w-full bg-transparent border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none">
                    <option value="none" className="bg-black">Instrumental / No Linguistics</option>
                    <option value="en" className="bg-black">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step > 1 && (
            <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
              <UploadCloud className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Step {step} Simulation</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest">UI placeholder for step {step} configuration.</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
            <Button 
              variant="outline" 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="rounded-none border-white/10 hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12 px-8"
            >
              Back
            </Button>
            <Button 
              onClick={() => setStep(s => Math.min(steps.length, s + 1))}
              className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-black h-12 px-8"
            >
              {step === steps.length ? "Submit Release" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}