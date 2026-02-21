import { Globe, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function PendingApproval() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-0 mb-12">
        <Globe className="w-8 h-8 text-white mb-2" />
        <span className="font-black text-2xl tracking-[0.3em] uppercase leading-none text-white">RAW ARCHIVES</span>
      </div>

      <div className="w-full max-w-md bg-[#050505] border border-white/10 p-8 md:p-12 text-center">
        <Clock className="w-12 h-12 text-white/20 mx-auto mb-6" />
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-4" data-testid="text-pending-title">Application Pending</h1>
        <p className="text-sm text-white/40 uppercase tracking-widest mb-2">
          Your application is under review.
        </p>
        <p className="text-xs text-white/30 mb-8">
          An administrator will review your application shortly. You will receive access once approved.
        </p>
        {user && (
          <div className="border border-white/10 p-4 mb-8 text-left">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Logged in as</div>
            <div className="text-sm font-bold" data-testid="text-pending-username">{user.username}</div>
            <div className="text-xs text-white/40">{user.email}</div>
          </div>
        )}
        <Button 
          onClick={() => logout()}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-xs font-black tracking-[0.3em] uppercase"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
