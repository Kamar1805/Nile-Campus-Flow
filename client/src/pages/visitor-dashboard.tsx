import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { CalendarIcon, UserCheck, Clock } from "lucide-react";
import { HelpTooltip } from "@/components/help-tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import type { Visitor } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVisitorSchema } from "@shared/schema";
import type { InsertVisitor } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function VisitorDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewPass, setShowNewPass] = useState(false);

  const { data: passes, isLoading } = useQuery<Visitor[]>({
    queryKey: ["/api/my-visitor-passes", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/my-visitor-passes?email=${user?.email}`);
      if (!res.ok) throw new Error("Failed to fetch passes");
      return res.json();
    },
  });

  const form = useForm<InsertVisitor>({
    resolver: zodResolver(insertVisitorSchema.extend({
      validFrom: insertVisitorSchema.shape.validFrom,
      validUntil: insertVisitorSchema.shape.validUntil,
    })),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      purpose: "",
      hostName: "",
      hostContact: "",
      vehiclePlate: "",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      isActive: true,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertVisitor) => {
      return apiRequest("POST", "/api/visitors/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Pre-Registration Successful",
        description: "Your visitor pass has been created. Download your QR code below.",
      });
      form.reset();
      setShowNewPass(true);
      queryClient.invalidateQueries({ queryKey: ["/api/my-visitor-passes"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please check your information and try again.",
      });
    },
  });

  const onSubmit = (data: InsertVisitor) => {
    registerMutation.mutate(data);
  };

  const activePass = passes?.find(p => p.isActive && new Date(p.validUntil) > new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visitor Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Pre-register for campus access and manage your visitor passes
        </p>
      </div>

      {/* Active Pass */}
      {activePass && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Active Pass</h2>
            <HelpTooltip content="Your current active visitor pass with QR code for gate access" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-accent" />
                  Visitor Pass
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{activePass.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="capitalize">{activePass.purpose}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Host:</span>
                    <span>{activePass.hostName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="font-mono text-xs">
                      {new Date(activePass.validUntil).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-accent text-accent-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            {activePass.qrCode && (
              <QRCodeGenerator
                data={activePass.qrCode}
                title="Visitor Access QR Code"
                filename={`visitor-pass-${activePass.fullName}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Pre-Registration Form */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Pre-Register for Campus Access</h2>
          <HelpTooltip content="Fill out this form to request a temporary visitor pass. Your host will be notified." />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Full Name *</FormLabel>
                          <HelpTooltip content="Your complete legal name as it appears on your ID" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            data-testid="input-visitor-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john.doe@example.com"
                            data-testid="input-visitor-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+234 XXX XXX XXXX"
                            data-testid="input-visitor-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehiclePlate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Vehicle Plate (Optional)</FormLabel>
                          <HelpTooltip content="If you're bringing a vehicle, provide the license plate number" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ABC-123-XY"
                            data-testid="input-visitor-vehicle"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Visit *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g., Meeting, Campus tour, Delivery, etc."
                          rows={2}
                          data-testid="input-visitor-purpose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hostName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Host Name *</FormLabel>
                          <HelpTooltip content="Name of the person you're visiting on campus" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Dr. Jane Smith"
                            data-testid="input-visitor-host-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hostContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host Contact *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Email or phone number"
                            data-testid="input-visitor-host-contact"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Your pass will be valid for 24 hours from registration.
                    You'll receive a QR code to present at the gate.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  data-testid="button-submit-visitor-registration"
                >
                  {registerMutation.isPending ? "Submitting..." : "Submit Pre-Registration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Previous Passes */}
      {passes && passes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Previous Passes</h2>
            <HelpTooltip content="History of your visitor passes" />
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {passes.slice(0, 5).map((pass) => (
                  <div
                    key={pass.id}
                    className="p-4 flex items-center justify-between gap-4 hover-elevate"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pass.purpose}</p>
                      <p className="text-xs text-muted-foreground">
                        Host: {pass.hostName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={pass.isActive ? "default" : "secondary"}>
                        {pass.isActive ? "Active" : "Expired"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {new Date(pass.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
