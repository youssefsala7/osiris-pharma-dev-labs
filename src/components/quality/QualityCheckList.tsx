import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Calendar, FileText } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { QualityCheck } from "./types";

interface QualityCheckListProps {
  checks: QualityCheck[];
  onView: (check: QualityCheck) => void;
  onEdit: (check: QualityCheck) => void;
  onDelete: (checkId: string) => void;
  isLoading: boolean;
  delay?: number;
}

export const QualityCheckList = ({
  checks,
  onView,
  onEdit,
  onDelete,
  isLoading,
  delay = 0
}: QualityCheckListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "default";
      case "failed": return "destructive";
      case "requires-attention": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "requires-attention": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "pending": return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
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
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle>Quality Checks ({checks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check) => (
              <div key={check.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">
                          {check.medicineName || formatCheckType(check.type)}
                        </h3>
                        <Badge variant={getStatusColor(check.status) as any}>
                          {check.status.replace("-", " ")}
                        </Badge>
                        <Badge variant={getPriorityColor(check.priority) as any}>
                          {check.priority}
                        </Badge>
                      </div>
                      
                      {check.batchNumber && (
                        <p className="text-sm text-gray-600 mb-2">
                          Batch: {check.batchNumber}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-700 mb-2">{check.findings}</p>
                      
                      {check.corrective_actions && (
                        <div className="bg-blue-50 p-2 rounded text-sm mb-2">
                          <span className="font-medium">Actions:</span> {check.corrective_actions}
                        </div>
                      )}

                      {check.cost_impact && check.cost_impact > 0 && (
                        <div className="text-sm text-red-600 mb-2">
                          <span className="font-medium">Cost Impact:</span> ${check.cost_impact.toFixed(2)}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>Inspector: {check.inspector}</span>
                        <span>Date: {check.checkDate}</span>
                        {check.next_check_date && (
                          <span>Next Check: {check.next_check_date}</span>
                        )}
                      </div>

                      {check.compliance_standards.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {check.compliance_standards.map((standard, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onView(check)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(check)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(check.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};