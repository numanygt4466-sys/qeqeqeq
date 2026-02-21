import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Submissions() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-20 text-center">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Talent Intake</span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6">Submit Music</h1>
          <p className="text-white/40 max-w-xl mx-auto">We are always looking for the next evolution of sound. Please provide high-quality links to your unreleased work.</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 md:p-16"
        >
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Artist Name</label>
                <Input className="bg-transparent border-white/10 rounded-none h-14 focus:border-primary focus:ring-0" placeholder="e.g. VOID CIRCUIT" data-testid="input-artist-name" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                <Input className="bg-transparent border-white/10 rounded-none h-14 focus:border-primary focus:ring-0" type="email" placeholder="contact@artist.com" data-testid="input-email" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Link to Unreleased Tracks (Soundcloud/Dropbox)</label>
              <Input className="bg-transparent border-white/10 rounded-none h-14 focus:border-primary focus:ring-0" placeholder="https://soundcloud.com/private-link" data-testid="input-demo-link" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Short Bio & Vision</label>
              <Textarea className="bg-transparent border-white/10 rounded-none min-h-[150px] focus:border-primary focus:ring-0" placeholder="Tell us about your sound and why you belong in the archive..." data-testid="textarea-bio" />
            </div>

            <div className="pt-6">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-16 text-sm font-bold tracking-[0.3em] uppercase transition-all" data-testid="button-submit-demo">
                Initialize Submission
              </Button>
              <p className="text-[10px] text-center text-white/20 mt-6 tracking-widest uppercase">
                Expect a response within 14 working days. Quality over quantity.
              </p>
            </div>
          </form>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Requirements", content: "3 unreleased tracks minimum. High-quality 320kbps MP3 or WAV." },
            { title: "Exclusivity", content: "Tracks must not be signed elsewhere or public on DSPs." },
            { title: "Review Process", content: "Our A&R team listens to every single submission." }
          ].map((item, i) => (
            <div key={i} className="p-8 border border-white/5 bg-white/2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{item.title}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-tighter">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}