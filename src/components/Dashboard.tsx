import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Medicines",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Customers",
      value: "856",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Today's Sales",
      value: "$2,847",
      change: "+15%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
    },
  ];

  const lowStockItems = [
    { name: "Paracetamol 500mg", stock: 15, minStock: 50 },
    { name: "Amoxicillin 250mg", stock: 8, minStock: 30 },
    { name: "Ibuprofen 400mg", stock: 22, minStock: 40 },
    { name: "Aspirin 75mg", stock: 12, minStock: 25 },
  ];

  const recentSales = [
    { id: "INV-001", customer: "John Doe", amount: "$45.50", time: "2 min ago" },
    { id: "INV-002", customer: "Jane Smith", amount: "$78.20", time: "15 min ago" },
    { id: "INV-003", customer: "Mike Johnson", amount: "$32.10", time: "1 hour ago" },
    { id: "INV-004", customer: "Sarah Wilson", amount: "$156.75", time: "2 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your pharmacy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <Badge variant="secondary" className="mt-1">
                      <TrendingUp size={12} className="mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Min stock: {item.minStock}</p>
                  </div>
                  <Badge variant="destructive">{item.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sale.id}</p>
                    <p className="text-sm text-gray-600">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{sale.amount}</p>
                    <p className="text-sm text-gray-600">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};