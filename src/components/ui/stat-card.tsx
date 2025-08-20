import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  className?: string;
  isAnimated?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  prefix = "",
  suffix = "",
  className,
  isAnimated = true
}: StatCardProps) => {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 hover:scale-105", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {isAnimated ? (
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              ) : (
                `${prefix}${value.toLocaleString()}${suffix}`
              )}
            </p>
            {trend && (
              <div className="flex items-center mt-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};