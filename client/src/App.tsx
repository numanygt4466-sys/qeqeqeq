import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Protected App Pages
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Catalog from "@/pages/dashboard/Catalog";
import Upload from "@/pages/dashboard/Upload";
import Earnings from "@/pages/dashboard/Earnings";
import Payouts from "@/pages/dashboard/Payouts";
import Artists from "@/pages/dashboard/Artists";
import Users from "@/pages/dashboard/Users";
import Settings from "@/pages/dashboard/Settings";
import Support from "@/pages/dashboard/Support";

import PublicCatalog from "@/pages/Catalog";
import PublicArtists from "@/pages/Artists";
import PublicSubmissions from "@/pages/Submissions";

// Wrapper for public marketing site
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen selection:bg-primary/30">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Wrapper for protected dashboard
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  // Simple mock auth check for UI purposes
  const isAuthenticated = true; // Set to false to test redirect
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
};

function Router() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Protected App Routes */}
      <Route path="/app/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/app/catalog"><ProtectedRoute component={Catalog} /></Route>
      <Route path="/app/upload"><ProtectedRoute component={Upload} /></Route>
      <Route path="/app/earnings"><ProtectedRoute component={Earnings} /></Route>
      <Route path="/app/payouts"><ProtectedRoute component={Payouts} /></Route>
      <Route path="/app/artists"><ProtectedRoute component={Artists} /></Route>
      <Route path="/app/users"><ProtectedRoute component={Users} /></Route>
      <Route path="/app/settings"><ProtectedRoute component={Settings} /></Route>
      <Route path="/app/support"><ProtectedRoute component={Support} /></Route>

      {/* Redirect old dashboard path to new structure */}
      <Route path="/dashboard"><Redirect to="/app/dashboard" /></Route>

      {/* Public Routes */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/catalog">
        <PublicLayout><PublicCatalog /></PublicLayout>
      </Route>
      <Route path="/artists">
        <PublicLayout><PublicArtists /></PublicLayout>
      </Route>
      <Route path="/submissions">
        <PublicLayout><PublicSubmissions /></PublicLayout>
      </Route>
      
      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;