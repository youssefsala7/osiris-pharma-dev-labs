import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import { useState } from "react";

export const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const salesData = {
    daily: { revenue: 2847, transactions: 45, avgSale: 63.27 },
    weekly: { revenue: 18420, transactions: 287, avgSale: 64.15 },
    monthly: { revenue: 78650, transactions: 1234, avgSale: 63.75 },
    yearly: { revenue: 945800, transactions: 14808, avgSale: 63.85 }
  };

  const topSellingMedicines = [
    { name: "Paracetamol 500mg", sales: 245, revenue: 612.50 },
    { name: "Amoxicillin 250mg", sales: 156, revenue: 1365.00 },
    { name: "Ibuprofen 400mg", sales: 134, revenue: 435.50 },
    { name: "Aspirin 75mg", sales: 98, revenue: 294.00 },
    { name: "Vitamin D3", sales: 87, revenue: 521.00 },
  ];

  const lowStockItems = [
    { name: "Paracetamol 500mg", current: 15, minimum: 50, status: "Critical" },
    { name: "Amoxicillin 250mg", current: 8, minimum: 30, status: "Critical" },
    { name: "Ibuprofen 400mg", current: 22, minimum: 40, status: "Low" },
    { name: "Aspirin 75mg", current: 12, minimum: 25, status: "Critical" },
  ];

  const customerInsights = {
    totalCustomers: 856,
    activeCustomers: 734,
    newCustomers: 45,
    returningCustomers: 689,
    averageSpend: 89.45
  };

  const currentData = salesData[selectedPeriod as keyof typeof salesData];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your pharmacy operations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue ({selectedPeriod})</p>
                <p className="text-2xl font-bold text-gray-900">${currentData.revenue.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +12.5%
                </Badge>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.transactions.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +8.3%
                </Badge>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Sale</p>
                <p className="text-2xl font-bold text-gray-900">${currentData.avgSale.toFixed(2)}</p>
                <Badge variant="secondary" className="mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +3.7%
                </Badge>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerInsights.activeCustomers}</p>
                <Badge variant="secondary" className="mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +5.2%
                </Badge>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Medicines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Selling Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingMedicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${medicine.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-red-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Current: {item.current} | Min: {item.minimum}</p>
                  </div>
                  <Badge variant={item.status === "Critical" ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Customer Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{customerInsights.totalCustomers}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{customerInsights.activeCustomers}</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{customerInsights.newCustomers}</p>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{customerInsights.returningCustomers}</p>
              <p className="text-sm text-gray-600">Returning Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">${customerInsights.averageSpend}</p>
              <p className="text-sm text-gray-600">Average Spend</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Monthly Sales Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Package className="h-6 w-6 mb-2" />
              <span>Inventory Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Customer Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};