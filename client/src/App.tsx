import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Catalog from "@/pages/dashboard/Catalog";
import Upload from "@/pages/dashboard/Upload";
import Earnings from "@/pages/dashboard/Earnings";
import Payouts from "@/pages/dashboard/Payouts";
import Settings from "@/pages/dashboard/Settings";
import Support from "@/pages/dashboard/Support";
import HelpCenter from "@/pages/dashboard/HelpCenter";
import AdminApplications from "@/pages/admin/Applications";
import AdminReleases from "@/pages/admin/Releases";
import AdminUsers from "@/pages/admin/Users";
import AdminSupport from "@/pages/admin/Support";
import AdminPayouts from "@/pages/admin/Payouts";
import AdminDsps from "@/pages/admin/Dsps";
import AdminSettings from "@/pages/admin/Settings";
import AdminNews from "@/pages/admin/News";
import PendingApproval from "@/pages/PendingApproval";
import SuspendedAccount from "@/pages/SuspendedAccount";

import PublicCatalog from "@/pages/Catalog";
import PublicArtists from "@/pages/Artists";
import PublicSubmissions from "@/pages/Submissions";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import TermsOfService from "@/pages/legal/TermsOfService";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import CookieChoices from "@/pages/legal/CookieChoices";

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen selection:bg-primary/30">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!user.isApproved) {
    return <PendingApproval />;
  }

  if (user.isSuspended) {
    return <SuspendedAccount reason={user.suspensionReason} />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  if (!user.isApproved) return <PendingApproval />;
  if (user.isSuspended) return <SuspendedAccount reason={user.suspensionReason} />;
  if (user.role !== "label_manager") return <Redirect to="/app/dashboard" />;

  return <AppLayout>{children}</AppLayout>;
}

function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user && user.isApproved) return <Redirect to="/app/dashboard" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login"><RedirectIfAuth><Login /></RedirectIfAuth></Route>
      <Route path="/register"><RedirectIfAuth><Register /></RedirectIfAuth></Route>
      <Route path="/forgot-password"><ForgotPassword /></Route>
      <Route path="/terms-of-service"><TermsOfService /></Route>
      <Route path="/privacy-policy"><PrivacyPolicy /></Route>
      <Route path="/cookie-choices"><CookieChoices /></Route>

      <Route path="/app/dashboard"><RequireAuth><Dashboard /></RequireAuth></Route>
      <Route path="/app/catalog"><RequireAuth><Catalog /></RequireAuth></Route>
      <Route path="/app/upload"><RequireAuth><Upload /></RequireAuth></Route>
      <Route path="/app/earnings"><RequireAuth><Earnings /></RequireAuth></Route>
      <Route path="/app/payouts"><RequireAuth><Payouts /></RequireAuth></Route>
      <Route path="/app/settings"><RequireAuth><Settings /></RequireAuth></Route>
      <Route path="/app/support"><RequireAuth><Support /></RequireAuth></Route>
      <Route path="/app/help"><RequireAuth><HelpCenter /></RequireAuth></Route>

      <Route path="/app/admin/applications"><RequireAdmin><AdminApplications /></RequireAdmin></Route>
      <Route path="/app/admin/releases"><RequireAdmin><AdminReleases /></RequireAdmin></Route>
      <Route path="/app/admin/users"><RequireAdmin><AdminUsers /></RequireAdmin></Route>
      <Route path="/app/admin/support"><RequireAdmin><AdminSupport /></RequireAdmin></Route>
      <Route path="/app/admin/payouts"><RequireAdmin><AdminPayouts /></RequireAdmin></Route>
      <Route path="/app/admin/dsps"><RequireAdmin><AdminDsps /></RequireAdmin></Route>
      <Route path="/app/admin/settings"><RequireAdmin><AdminSettings /></RequireAdmin></Route>
      <Route path="/app/admin/news"><RequireAdmin><AdminNews /></RequireAdmin></Route>

      <Route path="/dashboard"><Redirect to="/app/dashboard" /></Route>

      <Route path="/"><PublicLayout><Home /></PublicLayout></Route>
      <Route path="/catalog"><PublicLayout><PublicCatalog /></PublicLayout></Route>
      <Route path="/artists"><PublicLayout><PublicArtists /></PublicLayout></Route>
      <Route path="/submissions"><PublicLayout><PublicSubmissions /></PublicLayout></Route>
      
      <Route><PublicLayout><NotFound /></PublicLayout></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
