import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  className?: string;
  animated?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  prefix = "",
  suffix = "",
  className,
  animated = true
}) => {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 hover:scale-105", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {animated && typeof value === 'number' ? (
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              ) : (
                `${prefix}${value}${suffix}`
              )}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};