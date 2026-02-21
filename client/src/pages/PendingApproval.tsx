import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function PendingApproval() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-1 mb-10">
        <span className="font-bold text-xl tracking-widest uppercase text-gray-900">RAW ARCHIVES</span>
        <span className="text-xs text-gray-400 tracking-wider">Music Distribution</span>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-5">
          <Clock className="w-7 h-7 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-pending-title">Application Pending</h1>
        <p className="text-sm text-gray-600 mb-1">
          Your application is under review.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          An administrator will review your application shortly. You will receive access once approved.
        </p>
        {user && (
          <div className="border border-gray-200 rounded-md p-4 mb-6 text-left">
            <div className="text-xs text-gray-400 mb-1">Logged in as</div>
            <div className="text-sm font-medium text-gray-900" data-testid="text-pending-username">{user.username}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-md h-10 text-sm font-medium inline-flex items-center justify-center gap-2"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
