import { useQuery } from "@tanstack/react-query";
import { DollarSign, Loader2 } from "lucide-react";

export default function Earnings() {
  const { data: balanceData, isLoading: balanceLoading } = useQuery<{ balance: number }>({
    queryKey: ["/api/balance"],
  });

  const { data: earnings = [], isLoading: earningsLoading } = useQuery<any[]>({
    queryKey: ["/api/earnings"],
  });

  const balance = balanceData?.balance ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your revenue and payouts</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Available Balance</p>
            {balanceLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-gray-900" data-testid="text-balance">${Number(balance).toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Earnings History</h2>
        </div>

        {earningsLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : earnings.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No earnings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3 text-left hidden sm:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left">Description</th>
                  <th className="px-4 sm:px-6 py-3 text-left hidden md:table-cell">Release</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning: any) => (
                  <tr key={earning.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-testid={`row-earning-${earning.id}`}>
                    <td className="px-4 sm:px-6 py-3 text-gray-600 hidden sm:table-cell">
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-gray-900 font-medium">
                      {earning.description || "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-gray-600 hidden md:table-cell">
                      {earning.releaseId ? `#${earning.releaseId}` : "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-medium text-gray-900">
                      ${Number(earning.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
