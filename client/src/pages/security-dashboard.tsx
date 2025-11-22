import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GateStatusCard } from "@/components/gate-status-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Shield, AlertCircle } from "lucide-react";
import { HelpTooltip } from "@/components/help-tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import type { GateWithOfficer } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function SecurityDashboard() {
  const [scanInput, setScanInput] = useState("");
  const [overrideGateId, setOverrideGateId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: gates, isLoading: gatesLoading } = useQuery<GateWithOfficer[]>({
    queryKey: ["/api/gates"],
  });

  const scanMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("POST", "/api/access/scan", { code });
    },
    onSuccess: (data) => {
      toast({
        title: "Access Granted",
        description: `Vehicle ${data.licensePlate} authorized for entry`,
      });
      setScanInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/access-logs/recent"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid or expired QR code",
      });
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async ({ gateId, action, reason }: { gateId: string; action: string; reason: string }) => {
      return apiRequest("POST", "/api/gates/override", { gateId, action, reason });
    },
    onSuccess: () => {
      toast({
        title: "Manual Override Successful",
        description: "Gate operation logged",
      });
      setOverrideGateId(null);
      setOverrideReason("");
      queryClient.invalidateQueries({ queryKey: ["/api/gates"] });
    },
  });

  const handleScan = () => {
    if (scanInput.trim()) {
      scanMutation.mutate(scanInput);
    }
  };

  const handleManualOverride = (gateId: string, action: "open" | "close") => {
    setOverrideGateId(gateId);
  };

  const submitOverride = () => {
    if (overrideGateId && overrideReason.trim()) {
      const gate = gates?.find(g => g.id === overrideGateId);
      const action = gate?.isOpen ? "close" : "open";
      overrideMutation.mutate({
        gateId: overrideGateId,
        action,
        reason: overrideReason,
        userId: user?.id,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor gates and process vehicle access
        </p>
      </div>

      {/* QR Code Scanner */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Quick Access Scanner</CardTitle>
            <HelpTooltip content="Enter QR code or RFID tag to validate vehicle access. Successful scans will automatically open the gate." />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scan-input">QR Code / RFID Tag</Label>
            <div className="flex gap-2">
              <Input
                id="scan-input"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan or enter code..."
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                data-testid="input-scan-code"
              />
              <Button
                onClick={handleScan}
                disabled={scanMutation.isPending || !scanInput.trim()}
                data-testid="button-scan"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {scanMutation.isPending ? "Processing..." : "Scan"}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Quick Tip:</p>
              <p>Use a barcode scanner or type the code manually. Valid codes will grant immediate access.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gates Status with Controls */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Gate Controls</h2>
          <HelpTooltip content="Monitor and manually control gates. Use manual override only when necessary." />
        </div>
        {gatesLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading gates...</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {gates?.map((gate) => (
              <GateStatusCard
                key={gate.id}
                gate={gate}
                showControls={true}
                onManualOverride={handleManualOverride}
              />
            )) || (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No gates assigned
              </p>
            )}
          </div>
        )}
      </div>

      {/* Manual Override Dialog */}
      <Dialog open={!!overrideGateId} onOpenChange={(open) => !open && setOverrideGateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Gate Override</DialogTitle>
            <DialogDescription>
              Provide a reason for this manual override. This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-destructive/10 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <p className="text-sm">
                Manual overrides should only be used in emergencies or special circumstances.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="override-reason">Reason for Override *</Label>
              <Textarea
                id="override-reason"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Enter reason (e.g., Emergency vehicle, VIP visitor, System malfunction...)"
                rows={3}
                data-testid="input-override-reason"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOverrideGateId(null)}>
                Cancel
              </Button>
              <Button
                onClick={submitOverride}
                disabled={!overrideReason.trim() || overrideMutation.isPending}
                data-testid="button-confirm-override"
              >
                {overrideMutation.isPending ? "Processing..." : "Confirm Override"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
