import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SalesStats as ISalesStats } from "./types";

interface SalesStatsProps {
  stats: ISalesStats;
}

export const SalesStats = ({ stats }: SalesStatsProps) => {
  const statItems = [
    {
      title: "Today's Sales",
      value: stats.todaysSales,
      icon: ShoppingCart,
      color: "text-blue-600",
      suffix: " sales"
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: TrendingUp,
      color: "text-green-600",
      suffix: " transactions"
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: DollarSign,
      color: "text-purple-600",
      prefix: "$",
      decimals: true
    },
    {
      title: "Average Sale",
      value: stats.averageSale,
      icon: Calendar,
      color: "text-orange-600",
      prefix: "$",
      decimals: true
    }
  ];

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    <AnimatedCounter
                      value={stat.decimals ? Math.round(stat.value * 100) / 100 : stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1200}
                    />
                  </p>
                </div>
                <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </StaggerContainer>
  );
};