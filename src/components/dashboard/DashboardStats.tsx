import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { DashboardStats as IDashboardStats } from "./types";

interface DashboardStatsProps {
  stats: IDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: "Total Medicines",
      value: stats.totalMedicines,
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      trend: "up"
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers,
      change: "+8%",
      icon: Users,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Today's Sales",
      value: stats.todaysSales,
      change: "+15%",
      icon: ShoppingCart,
      color: "text-purple-600",
      trend: "up",
      prefix: "$"
    },
    {
      title: "Monthly Revenue",
      value: stats.monthlyRevenue,
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
      trend: "up",
      prefix: "$"
    },
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
                      value={stat.value}
                      prefix={stat.prefix}
                      duration={1200}
                    />
                  </p>
                  <Badge variant="secondary" className="mt-1 animate-pulse">
                    <TrendingUp size={12} className="mr-1" />
                    {stat.change}
                  </Badge>
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