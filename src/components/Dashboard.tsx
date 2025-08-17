import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  FileText,
  Truck,
  Calendar,
  Plus,
  Shield,
  CreditCard,
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

  const pendingOrders = [
    { id: "PO-001", supplier: "PharmaCorp Ltd", amount: "$1,971.00", status: "Confirmed" },
    { id: "PO-002", supplier: "MediSupply Inc", amount: "$1,620.00", status: "Sent" },
    { id: "PO-003", supplier: "VitaHealth Distributors", amount: "$1,296.00", status: "Delivered" },
  ];

  const expiringMedicines = [
    { name: "Vitamin C 500mg", expiryDate: "2024-02-28", daysLeft: 13 },
    { name: "Cough Syrup", expiryDate: "2024-03-15", daysLeft: 28 },
    { name: "Eye Drops", expiryDate: "2024-03-20", daysLeft: 33 },
  ];

  const drugInteractionAlerts = [
    { patient: "John Doe", drugs: "Warfarin + Aspirin", severity: "Major" },
    { patient: "Mary Johnson", drugs: "Digoxin + Amiodarone", severity: "Major" },
    { patient: "Robert Smith", drugs: "Metformin + Contrast", severity: "Moderate" },
  ];

  const insuranceClaims = [
    { id: "CLM-001", patient: "John Doe", amount: "$125.50", status: "Approved" },
    { id: "CLM-002", patient: "Jane Smith", amount: "$89.75", status: "Rejected" },
    { id: "CLM-003", patient: "Mike Johnson", amount: "$245.00", status: "Under Review" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your pharmacy.</p>
        </div>
        
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Sale
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Drug Interaction Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 text-orange-500 mr-2" />
              Drug Interaction Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drugInteractionAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{alert.patient}</p>
                    <p className="text-sm text-gray-600">{alert.drugs}</p>
                  </div>
                  <Badge variant={alert.severity === "Major" ? "destructive" : "secondary"}>
                    {alert.severity}
                  </Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Pending Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Insurance Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insuranceClaims.map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{claim.id}</p>
                    <p className="text-sm text-gray-600">{claim.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{claim.amount}</p>
                    <Badge variant={
                      claim.status === "Approved" ? "default" : 
                      claim.status === "Rejected" ? "destructive" : "secondary"
                    }>
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Medicines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-orange-500 mr-2" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringMedicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{medicine.name}</p>
                    <p className="text-sm text-gray-600">Expires: {medicine.expiryDate}</p>
                  </div>
                  <Badge variant="secondary">{medicine.daysLeft} days left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Package className="h-6 w-6 mb-2" />
              <span>Add Medicine</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>New Customer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              <span>Create Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Shield className="h-6 w-6 mb-2" />
              <span>Check Interactions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <CreditCard className="h-6 w-6 mb-2" />
              <span>Submit Claim</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};