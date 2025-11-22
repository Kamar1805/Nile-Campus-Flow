import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoorOpen, DoorClosed, Wifi, WifiOff, AlertCircle } from "lucide-react";
import type { GateWithOfficer } from "@shared/schema";
import { HelpTooltip } from "./help-tooltip";

interface GateStatusCardProps {
  gate: GateWithOfficer;
  onManualOverride?: (gateId: string, action: "open" | "close") => void;
  showControls?: boolean;
}

export function GateStatusCard({ gate, onManualOverride, showControls = false }: GateStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-accent text-accent-foreground";
      case "offline":
        return "bg-destructive text-destructive-foreground";
      case "maintenance":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="w-4 h-4" />;
      case "offline":
        return <WifiOff className="w-4 h-4" />;
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-gate-${gate.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{gate.name}</CardTitle>
        <Badge className={getStatusColor(gate.status)} data-testid={`status-gate-${gate.id}`}>
          {getStatusIcon(gate.status)}
          <span className="ml-1 capitalize">{gate.status}</span>
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{gate.location}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gate Status:</span>
            <div className="flex items-center gap-2">
              {gate.isOpen ? (
                <DoorOpen className="w-4 h-4 text-accent" />
              ) : (
                <DoorClosed className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="font-medium">{gate.isOpen ? "Open" : "Closed"}</span>
            </div>
          </div>
          {gate.lastActivity && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Activity:</span>
              <span className="font-mono text-xs">
                {new Date(gate.lastActivity).toLocaleTimeString()}
              </span>
            </div>
          )}
          {gate.officer && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Officer:</span>
              <span className="font-medium">{gate.officer.fullName}</span>
            </div>
          )}
        </div>

        {showControls && gate.status === "online" && (
          <div className="flex gap-2 pt-2 border-t">
            <div className="flex items-center gap-1 flex-1">
              <Button
                variant={gate.isOpen ? "secondary" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => onManualOverride?.(gate.id, "open")}
                data-testid={`button-open-gate-${gate.id}`}
              >
                <DoorOpen className="w-4 h-4 mr-1" />
                Open
              </Button>
              <HelpTooltip content="Manually open this gate. This action will be logged." />
            </div>
            <div className="flex items-center gap-1 flex-1">
              <Button
                variant={!gate.isOpen ? "secondary" : "destructive"}
                size="sm"
                className="flex-1"
                onClick={() => onManualOverride?.(gate.id, "close")}
                data-testid={`button-close-gate-${gate.id}`}
              >
                <DoorClosed className="w-4 h-4 mr-1" />
                Close
              </Button>
              <HelpTooltip content="Manually close this gate. This action will be logged." />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
