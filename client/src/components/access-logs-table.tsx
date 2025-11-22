import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import { HelpTooltip } from "./help-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccessLogWithDetails } from "@shared/schema";

export function AccessLogsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: logs, isLoading } = useQuery<AccessLogWithDetails[]>({
    queryKey: ["/api/access-logs"],
  });

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gate.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      authorized: "bg-accent text-accent-foreground",
      denied: "bg-destructive text-destructive-foreground",
      manual_override: "bg-secondary text-secondary-foreground",
    };
    return styles[status as keyof typeof styles] || "bg-muted text-muted-foreground";
  };

  const exportToCSV = () => {
    if (!filteredLogs) return;

    const headers = ["Timestamp", "User", "Vehicle", "Gate", "Action", "Status", "Method"];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.user.fullName,
      log.vehicle.licensePlate,
      log.gate.name,
      log.action,
      log.status,
      log.authMethod,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `access-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Access Logs</CardTitle>
            <HelpTooltip content="Complete history of all entry and exit events. Use filters to narrow down results." />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
                data-testid="input-search-logs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="manual_override">Manual Override</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={exportToCSV} data-testid="button-export-logs">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Gate</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs && filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} data-testid={`log-row-${log.id}`}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.user.fullName}</TableCell>
                    <TableCell className="font-mono">{log.vehicle.licensePlate}</TableCell>
                    <TableCell>{log.gate.name}</TableCell>
                    <TableCell className="capitalize">{log.action}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.authMethod.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No access logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
