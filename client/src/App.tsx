import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Releases from "@/pages/Releases";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Dummy placeholder for Artists/About for now
const Artists = () => <div className="container mx-auto px-4 py-32 text-center font-mono">ARTISTS ROSTER [UNDER CONSTRUCTION]</div>;
const About = () => <div className="container mx-auto px-4 py-32 text-center font-mono">MANIFESTO [UNDER CONSTRUCTION]</div>;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/releases" component={Releases} />
      <Route path="/artists" component={Artists} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen selection:bg-foreground selection:text-background">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;