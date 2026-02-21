import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Lock } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [labelName, setLabelName] = useState(user?.labelName || "");
  const [country, setCountry] = useState(user?.country || "");
  const [timezone, setTimezone] = useState(user?.timezone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and account preferences</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-full-name"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-email"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Label Name</Label>
            <Input
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-label-name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 border-gray-200 rounded-md"
                data-testid="input-country"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Timezone</Label>
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 border-gray-200 rounded-md"
                data-testid="input-timezone"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              data-testid="button-save-profile"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" /> Change Password
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-current-password"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-new-password"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 border-gray-200 rounded-md"
              data-testid="input-confirm-password"
            />
          </div>
          <div className="pt-2">
            <button
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-4 py-2 text-sm font-medium inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              data-testid="button-change-password"
            >
              <Lock className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
