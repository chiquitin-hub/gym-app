import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Routines from "@/pages/routines";
import Booking from "@/pages/booking";
import Profile from "@/pages/profile";
import { AuthProvider } from "./context/AuthContext";
import { BottomNav } from "./components/bottom-nav";
import { AppHeader } from "./components/app-header";
import { useAuth } from "./hooks/use-auth";

// Protected route component that redirects to auth page if not authenticated
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/auth";
    return null;
  }
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <main className="flex-1 overflow-y-auto bg-neutral-100">
        <Component />
      </main>
      <BottomNav />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/routines" component={() => <ProtectedRoute component={Routines} />} />
      <Route path="/booking" component={() => <ProtectedRoute component={Booking} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
