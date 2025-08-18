import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { ProgressBar } from "./progress-bar";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<any>;
  color?: string;
  prefix?: string;
  suffix?: string;
  showProgress?: boolean;
  progressMax?: number;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = "text-blue-600",
  prefix = "",
  suffix = "",
  showProgress = false,
  progressMax = 100,
  className = "",
  trend
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up" || (change && change > 0)) return TrendingUp;
    if (trend === "down" || (change && change < 0)) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === "up" || (change && change > 0)) return "text-green-600";
    if (trend === "down" || (change && change < 0)) return "text-red-600";
    return "text-gray-600";
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 hover:scale-105", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                duration={1200}
              />
            </p>
            
            {(change !== undefined || changeLabel) && (
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="flex items-center">
                  <TrendIcon size={12} className={cn("mr-1", getTrendColor())} />
                  {changeLabel || `${change > 0 ? '+' : ''}${change}%`}
                </Badge>
              </div>
            )}
          </div>
          
          {Icon && (
            <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", color)} />
          )}
        </div>
        
        {showProgress && (
          <ProgressBar
            value={value}
            max={progressMax}
            showLabel={true}
            animated={true}
          />
        )}
      </CardContent>
    </Card>
  );
};