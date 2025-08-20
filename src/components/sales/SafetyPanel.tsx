import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export type InteractionSeverity = "Contraindicated" | "Major" | "Moderate" | "Minor";

export type InteractionFinding = {
  id: string;
  pair: string;
  severity: InteractionSeverity;
  message: string;
  counseled?: boolean;
};

interface SafetyPanelProps {
  findings: InteractionFinding[];
  onToggleCounseled: (id: string) => void;
  hasCritical: boolean;
  overridden: boolean;
  onOverride: () => void;
}

const severityClass = (s: InteractionSeverity): string => {
  if (s === "Contraindicated" || s === "Major") return "status-major";
  if (s === "Moderate") return "status-moderate";
  return "status-neutral";
};

export const SafetyPanel = ({
  findings,
  onToggleCounseled,
  hasCritical,
  overridden,
  onOverride,
}: SafetyPanelProps) => {
  if (findings.length === 0) {
    return (
      <div className="p-3 border rounded-lg bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-[#10B981] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">No interactions detected</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 border rounded-lg ${hasCritical && !overridden ? "bg-red-50 border-red-200 critical-pulse" : "bg-orange-50 border-orange-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {hasCritical && !overridden ? (
            <>
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Critical interaction detected</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Review interactions</span>
            </>
          )}
        </div>
        {hasCritical && !overridden && (
          <Button size="sm" variant="outline" className="text-red-600" onClick={onOverride}>
            Override (record)
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {findings.map((f) => (
          <div key={f.id} className="flex items-start justify-between rounded-md bg-white p-2 border">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge className={severityClass(f.severity) + " capitalize"}>{f.severity}</Badge>
                <span className="font-medium text-sm truncate">{f.pair}</span>
              </div>
              <div className="text-xs opacity-90 mt-1">{f.message}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleCounseled(f.id)}
              className={f.counseled ? "border-green-600 text-green-700" : ""}
            >
              {f.counseled ? "Counseled" : "Mark counseled"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};