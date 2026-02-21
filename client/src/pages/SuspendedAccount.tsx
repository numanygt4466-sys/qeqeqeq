import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuspendedAccount({ reason }: { reason: string | null }) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-suspended-title">
          Account Suspended
        </h1>
        <p className="text-gray-500 mb-6" data-testid="text-suspended-subtitle">
          Your account has been suspended and you cannot perform any actions at this time.
        </p>
        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left" data-testid="text-suspension-reason">
            <p className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-1">Reason</p>
            <p className="text-sm text-red-700">{reason}</p>
          </div>
        )}
        <p className="text-xs text-gray-400 mb-6">
          If you believe this is an error, please contact support for assistance.
        </p>
        <Button
          variant="outline"
          onClick={() => logout()}
          className="w-full"
          data-testid="button-logout-suspended"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
