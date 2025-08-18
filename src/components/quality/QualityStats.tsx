import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Calendar } from "lucide-react";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { QualityStats as IQualityStats } from "./types";

interface QualityStatsProps {
  stats: IQualityStats;
}

export const QualityStats = ({ stats }: QualityStatsProps) => {
  const statItems = [
    {
      title: "Total Checks",
      value: stats.totalChecks,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Passed",
      value: stats.passedChecks,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Failed",
      value: stats.failedChecks,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      title: "Pending",
      value: stats.pendingChecks,
      icon: Calendar,
      color: "text-yellow-600"
    }
  ];

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={stat.value} />
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </StaggerContainer>
  );
};