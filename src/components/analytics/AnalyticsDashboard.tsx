import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { FadeIn } from "@/components/ui/fade-in";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    target: number;
  };
  customers: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  inventory: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    turnoverRate: number;
  };
  sales: {
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    topProducts: Array<{
      name: string;
      sales: number;
      growth: number;
    }>;
  };
  performance: {
    goals: Array<{
      name: string;
      current: number;
      target: number;
      status: "on-track" | "behind" | "exceeded";
    }>;
  };
}

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  
  const analyticsData: AnalyticsData = {
    revenue: {
      current: 125430,
      previous: 108250,
      growth: 15.9,
      target: 150000
    },
    customers: {
      total: 2847,
      active: 1923,
      new: 234,
      retention: 78.5
    },
    inventory: {
      totalItems: 1247,
      lowStock: 23,
      outOfStock: 5,
      turnoverRate: 4.2
    },
    sales: {
      totalOrders: 3456,
      averageOrderValue: 36.28,
      conversionRate: 12.4,
      topProducts: [
        { name: "Paracetamol 500mg", sales: 1250, growth: 8.5 },
        { name: "Amoxicillin 250mg", sales: 890, growth: -2.1 },
        { name: "Ibuprofen 400mg", sales: 756, growth: 15.3 },
        { name: "Vitamin D3", sales: 623, growth: 22.7 },
      ]
    },
    performance: {
      goals: [
        { name: "Monthly Revenue", current: 125430, target: 150000, status: "on-track" },
        { name: "New Customers", current: 234, target: 200, status: "exceeded" },
        { name: "Inventory Turnover", current: 4.2, target: 5.0, status: "behind" },
        { name: "Customer Retention", current: 78.5, target: 80.0, status: "behind" },
      ]
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "exceeded": return "text-green-600";
      case "on-track": return "text-blue-600";
      case "behind": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case "exceeded": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "on-track": return <Target className="h-4 w-4 text-blue-600" />;
      case "behind": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive business intelligence and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Key Metrics */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={analyticsData.revenue.current} prefix="$" />
                  </p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(analyticsData.revenue.growth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.revenue.growth)}`}>
                      {analyticsData.revenue.growth > 0 ? '+' : ''}{analyticsData.revenue.growth}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={analyticsData.revenue.current}
                  max={analyticsData.revenue.target}
                  color="green"
                  showLabel
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={analyticsData.customers.active} />
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs">
                      +{analyticsData.customers.new} new
                    </Badge>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={analyticsData.customers.retention}
                  max={100}
                  color="blue"
                  showLabel
                />
                <p className="text-xs text-gray-600 mt-1">Retention Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={analyticsData.inventory.totalItems} />
                  </p>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">
                      {analyticsData.inventory.lowStock} low stock
                    </span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={analyticsData.inventory.turnoverRate}
                  max={10}
                  color="purple"
                  showLabel
                />
                <p className="text-xs text-gray-600 mt-1">Turnover Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={analyticsData.sales.totalOrders} />
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600">
                      ${analyticsData.sales.averageOrderValue} avg
                    </span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={analyticsData.sales.conversionRate}
                  max={20}
                  color="yellow"
                  showLabel
                />
                <p className="text-xs text-gray-600 mt-1">Conversion Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Performance Goals */}
      <FadeIn delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Performance Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsData.performance.goals.map((goal, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getGoalStatusIcon(goal.status)}
                      <span className="font-medium ml-2">{goal.name}</span>
                    </div>
                    <Badge 
                      variant={goal.status === "exceeded" ? "default" : goal.status === "on-track" ? "secondary" : "destructive"}
                    >
                      {goal.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <ProgressBar
                    value={goal.current}
                    max={goal.target}
                    color={goal.status === "exceeded" ? "green" : goal.status === "on-track" ? "blue" : "red"}
                    showLabel
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current: {goal.current.toLocaleString()}</span>
                    <span>Target: {goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Top Products */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.sales.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getGrowthIcon(product.growth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(product.growth)}`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};