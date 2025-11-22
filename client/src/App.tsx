import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationPanel } from "@/components/notification-panel";

// Pages
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin-dashboard";
import SecurityDashboard from "@/pages/security-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import VisitorDashboard from "@/pages/visitor-dashboard";
import ReportsDashboard from "@/pages/reports-dashboard";
import AccessLogsPage from "@/pages/access-logs-page";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

function DashboardLayout() {
  const { user } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationPanel />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <Switch>
                {user?.role === "admin" && (
                  <>
                    <Route path="/dashboard" component={AdminDashboard} />
                    <Route path="/reports" component={ReportsDashboard} />
                    <Route path="/logs" component={AccessLogsPage} />
                  </>
                )}
                {user?.role === "security_officer" && (
                  <>
                    <Route path="/dashboard" component={SecurityDashboard} />
                    <Route path="/gates" component={SecurityDashboard} />
                    <Route path="/scan" component={SecurityDashboard} />
                    <Route path="/logs" component={AccessLogsPage} />
                  </>
                )}
                {user?.role === "student_staff" && (
                  <>
                    <Route path="/dashboard" component={StudentDashboard} />
                    <Route path="/vehicles" component={StudentDashboard} />
                    <Route path="/history" component={StudentDashboard} />
                    <Route path="/qr-code" component={StudentDashboard} />
                  </>
                )}
                {user?.role === "visitor" && (
                  <>
                    <Route path="/dashboard" component={VisitorDashboard} />
                    <Route path="/register" component={VisitorDashboard} />
                    <Route path="/passes" component={VisitorDashboard} />
                  </>
                )}
                <Route path="/" component={() => <Redirect to="/dashboard" />} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading CampusFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={user ? () => <Redirect to="/dashboard" /> : LoginPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/gates" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/vehicles" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/users" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/logs" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/reports" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/scan" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/history" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/qr-code" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/register" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route path="/passes" component={() => <ProtectedRoute component={DashboardLayout} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
