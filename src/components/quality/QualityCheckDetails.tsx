import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QualityCheck } from "./types";

interface QualityCheckDetailsProps {
  check: QualityCheck;
}

export const QualityCheckDetails = ({ check }: QualityCheckDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "default";
      case "failed": return "destructive";
      case "requires-attention": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const formatCheckType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {/* Header Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Check ID</Label>
          <p className="font-medium text-lg">{check.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Type</Label>
          <p className="font-medium">{formatCheckType(check.type)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Status</Label>
          <div className="mt-1">
            <Badge variant={getStatusColor(check.status) as any}>
              {check.status.replace("-", " ")}
            </Badge>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Priority</Label>
          <div className="mt-1">
            <Badge variant={getPriorityColor(check.priority) as any}>
              {check.priority}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Medicine Information */}
      {(check.medicineName || check.batchNumber) && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {check.medicineName && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Medicine</Label>
                <p className="font-medium">{check.medicineName}</p>
              </div>
            )}
            {check.batchNumber && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Batch Number</Label>
                <p className="font-mono text-sm">{check.batchNumber}</p>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Check Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Inspector</Label>
          <p className="font-medium">{check.inspector}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Check Date</Label>
          <p className="font-medium">{check.checkDate}</p>
        </div>
      </div>

      {check.next_check_date && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Next Check Date</Label>
          <p className="font-medium">{check.next_check_date}</p>
        </div>
      )}

      <Separator />

      {/* Findings */}
      <div>
        <Label className="text-sm font-medium text-gray-600">Findings</Label>
        <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{check.findings}</p>
      </div>

      {/* Corrective Actions */}
      {check.corrective_actions && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Corrective Actions</Label>
          <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1">{check.corrective_actions}</p>
        </div>
      )}

      {/* Cost Impact */}
      {check.cost_impact && check.cost_impact > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Cost Impact</Label>
          <p className="text-lg font-bold text-red-600">${check.cost_impact.toFixed(2)}</p>
        </div>
      )}

      <Separator />

      {/* Compliance Standards */}
      {check.compliance_standards.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Compliance Standards</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {check.compliance_standards.map((standard, index) => (
              <Badge key={index} variant="outline">
                {standard}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};