import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, DollarSign } from "lucide-react";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { CustomerStats as ICustomerStats } from "./types";

interface CustomerStatsProps {
  stats: ICustomerStats;
}

export const CustomerStats = ({ stats }: CustomerStatsProps) => {
  const statItems = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers.toString(),
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "New This Month",
      value: stats.newCustomers.toString(),
      icon: UserPlus,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600"
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
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