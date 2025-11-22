import { AccessLogsTable } from "@/components/access-logs-table";
import { HelpTooltip } from "@/components/help-tooltip";

export default function AccessLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Access Logs</h1>
        <HelpTooltip content="Complete audit trail of all entry and exit events across campus gates" />
      </div>
      <AccessLogsTable />
    </div>
  );
}
