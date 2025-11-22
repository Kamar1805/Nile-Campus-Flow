import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { Car, Activity, Clock, CheckCircle } from "lucide-react";
import { HelpTooltip } from "@/components/help-tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { Vehicle, AccessLogWithDetails } from "@shared/schema";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/my-vehicles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/my-vehicles?userId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });

  const { data: accessHistory, isLoading: historyLoading } = useQuery<AccessLogWithDetails[]>({
    queryKey: ["/api/my-access-history", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/my-access-history?userId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch access history");
      return res.json();
    },
  });

  const { data: stats } = useQuery<{
    totalAccess: number;
    lastAccess: string | null;
  }>({
    queryKey: ["/api/my-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/my-stats?userId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
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
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your vehicles and view access history
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access Events</CardTitle>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="Total number of times you've accessed campus gates" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-total-access">
              {stats?.totalAccess || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Entry and exit events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Access</CardTitle>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <HelpTooltip content="The last time you used a campus gate" />
            </div>
          </CardHeader>
          <CardContent>
            {stats?.lastAccess ? (
              <>
                <div className="text-lg font-bold" data-testid="stat-last-access">
                  {new Date(stats.lastAccess).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {new Date(stats.lastAccess).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No access yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Vehicles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">My Vehicles</h2>
          <HelpTooltip content="Your registered vehicles with QR codes for gate access" />
        </div>
        {vehiclesLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">License Plate:</span>
                        <span className="font-mono font-bold">{vehicle.licensePlate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="capitalize">{vehicle.color}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">RFID Tag:</span>
                        <span className="font-mono text-xs">{vehicle.rfidTag}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                          {vehicle.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            "Inactive"
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {vehicle.qrCode && (
                  <QRCodeGenerator
                    data={vehicle.qrCode}
                    title="Vehicle QR Code"
                    filename={`vehicle-${vehicle.licensePlate}`}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No vehicles registered</p>
              <p className="text-sm text-muted-foreground mt-2">
                Contact the admin to register your vehicle
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Access History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Recent Access History</h2>
          <HelpTooltip content="Your recent entry and exit events at campus gates" />
        </div>
        <Card>
          <CardContent className="p-0">
            {historyLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {accessHistory?.length ? (
                  accessHistory.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="p-4 flex items-center justify-between gap-4 hover-elevate"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {log.vehicle.licensePlate} - {log.gate.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.action.toUpperCase()} • {log.authMethod.replace('_', ' ')}
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
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No access history yet
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
