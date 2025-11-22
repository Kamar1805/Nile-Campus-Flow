import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GateStatusCard } from "@/components/gate-status-card";
import { Activity, Car, DoorOpen, Users, TrendingUp } from "lucide-react";
import { HelpTooltip } from "@/components/help-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { GateWithOfficer, AccessLogWithDetails } from "@shared/schema";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    totalVehicles: number;
    activeGates: number;
    todayAccess: number;
  }>({ queryKey: ["/api/stats"] });

  const { data: gates, isLoading: gatesLoading } = useQuery<GateWithOfficer[]>({
    queryKey: ["/api/gates"],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<AccessLogWithDetails[]>({
    queryKey: ["/api/access-logs/recent"],
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      authorized: "bg-accent text-accent-foreground",
      denied: "bg-destructive text-destructive-foreground",
      manual_override: "bg-secondary text-secondary-foreground",
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage all campus traffic operations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="Total registered users in the system including students, staff, and visitors" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="stat-total-users">
                  {stats?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered users
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="Total number of registered vehicles with active access credentials" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="stat-total-vehicles">
                  {stats?.totalVehicles || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active vehicles
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Gates</CardTitle>
            <div className="flex items-center gap-1">
              <DoorOpen className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="Number of gates currently online and operational" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="stat-active-gates">
                  {stats?.activeGates || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gates online
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Access</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="Total number of entry/exit events logged today" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="stat-today-access">
                  {stats?.todayAccess || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Entry/exit events
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gates Status */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Gate Status</h2>
          <HelpTooltip content="Real-time status of all campus gates. Click on a gate card to view details and control access." />
        </div>
        {gatesLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {gates?.map((gate) => (
              <GateStatusCard key={gate.id} gate={gate} showControls={false} />
            )) || (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No gates configured
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <HelpTooltip content="Latest entry and exit events across all gates" />
        </div>
        <Card>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {recentActivity?.length ? (
                  recentActivity.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="p-4 flex items-center justify-between gap-4 hover-elevate"
                      data-testid={`activity-${log.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {log.user.fullName} - {log.vehicle.licensePlate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.gate.name} • {log.action.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}
                        >
                          {log.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
