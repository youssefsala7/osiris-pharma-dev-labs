import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertTriangle, Filter } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { InventoryStats as IInventoryStats } from "./types";

interface InventoryStatsProps {
  stats: IInventoryStats;
}

export const InventoryStats = ({ stats }: InventoryStatsProps) => {
  const statItems = [
    {
      title: "Total Medicines",
      value: stats.totalMedicines.toString(),
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Total Value",
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: () => <div className="text-green-600 text-xl sm:text-2xl font-bold">$</div>,
      color: "text-green-600"
    },
    {
      title: "Categories",
      value: stats.categoriesCount.toString(),
      icon: Filter,
      color: "text-purple-600"
    }
  ];

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-xl sm:text-2xl font-bold ${
                    stat.title === "Low Stock Items" ? "text-red-600" : 
                    stat.title === "Total Value" ? "text-green-600" :
                    stat.title === "Categories" ? "text-purple-600" : "text-gray-900"
                  }`}>
                    {stat.value}
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