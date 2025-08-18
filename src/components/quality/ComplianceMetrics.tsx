import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { ComplianceMetric } from "./types";

interface ComplianceMetricsProps {
  metrics: ComplianceMetric[];
  delay?: number;
}

export const ComplianceMetrics = ({ metrics, delay = 0 }: ComplianceMetricsProps) => {
  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant": return "text-green-600";
      case "non-compliant": return "text-red-600";
      case "needs-improvement": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getBadgeVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case "compliant": return "default";
      case "non-compliant": return "destructive";
      case "needs-improvement": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance Standards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{metric.standard}</h3>
                  <Badge variant={getBadgeVariant(metric.status)}>
                    {metric.status.replace("-", " ")}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Score</span>
                    <span className={getComplianceColor(metric.status)}>
                      {metric.current_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.current_score >= metric.target_score ? 'bg-green-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${metric.current_score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Target: {metric.target_score}%</span>
                    <span>Last Audit: {metric.last_audit}</span>
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