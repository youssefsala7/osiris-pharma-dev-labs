import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { ReactNode } from "react";

interface AlertItem {
  id?: string;
  title: string;
  subtitle?: string;
  status?: string;
  severity?: "critical" | "warning" | "info" | "high" | "medium" | "low";
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface AlertCardProps {
  title: string;
  icon: ReactNode;
  items: AlertItem[];
  delay?: number;
  onItemClick?: (item: AlertItem) => void;
}

export const AlertCard = ({ title, icon, items, delay = 0, onItemClick }: AlertCardProps) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "bg-red-50 border-red-200";
      case "warning":
      case "medium":
        return "bg-orange-50 border-orange-200";
      case "info":
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getBadgeVariant = (severity?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case "critical":
      case "high":
        return "destructive";
      case "warning":
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <FadeIn delay={delay}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            {icon}
            {title}
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {items.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={item.id || index} 
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer hover:opacity-80 ${getSeverityColor(item.severity)}`}
                onClick={() => onItemClick?.(item)}
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-600">{item.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {item.status && (
                    <Badge variant={item.badgeVariant || getBadgeVariant(item.severity)}>
                      {item.status}
                    </Badge>
                  )}
                  {item.badge && (
                    <Badge variant={getBadgeVariant(item.severity)}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};