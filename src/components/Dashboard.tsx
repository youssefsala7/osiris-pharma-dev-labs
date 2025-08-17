import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Activity,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { showSuccess } from "@/utils/toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";

export const Dashboard = () => {
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickSaleData, setQuickSaleData] = useState({
    customer: "",
    medicine: "",
    quantity: "",
    paymentMethod: "Cash"
  });

  const stats = [
    {
      title: "Total Medicines",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      trend: "up"
    },
    {
      title: "Active Customers",
      value: "856",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Today's Sales",
      value: "$2,847",
      change: "+15%",
      icon: ShoppingCart,
      color: "text-purple-600",
      trend: "up"
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
      trend: "up"
    },
  ];

  const lowStockItems = [
    { name: "Paracetamol 500mg", stock: 15, minStock: 50, severity: "critical" },
    { name: "Amoxicillin 250mg", stock: 8, minStock: 30, severity: "critical" },
    { name: "Ibuprofen 400mg", stock: 22, minStock: 40, severity: "warning" },
    { name: "Aspirin 75mg", stock: 12, minStock: 25, severity: "critical" },
  ];

  const recentSales = [
    { id: "INV-001", customer: "John Doe", amount: "$45.50", time: "2 min ago", status: "completed" },
    { id: "INV-002", customer: "Jane Smith", amount: "$78.20", time: "15 min ago", status: "completed" },
    { id: "INV-003", customer: "Mike Johnson", amount: "$32.10", time: "1 hour ago", status: "completed" },
    { id: "INV-004", customer: "Sarah Wilson", amount: "$156.75", time: "2 hours ago", status: "completed" },
  ];

  const pendingOrders = [
    { id: "PO-001", supplier: "PharmaCorp Ltd", amount: "$1,971.00", status: "Confirmed", priority: "high" },
    { id: "PO-002", supplier: "MediSupply Inc", amount: "$1,620.00", status: "Sent", priority: "medium" },
    { id: "PO-003", supplier: "VitaHealth Distributors", amount: "$1,296.00", status: "Delivered", priority: "low" },
  ];

  const expiringMedicines = [
    { name: "Vitamin C 500mg", expiryDate: "2024-02-28", daysLeft: 13, severity: "critical" },
    { name: "Cough Syrup", expiryDate: "2024-03-15", daysLeft: 28, severity: "warning" },
    { name: "Eye Drops", expiryDate: "2024-03-20", daysLeft: 33, severity: "info" },
  ];

  const drugInteractionAlerts = [
    { patient: "John Doe", drugs: "Warfarin + Aspirin", severity: "Major", priority: "high" },
    { patient: "Mary Johnson", drugs: "Digoxin + Amiodarone", severity: "Major", priority: "high" },
    { patient: "Robert Smith", drugs: "Metformin + Contrast", severity: "Moderate", priority: "medium" },
  ];

  const insuranceClaims = [
    { id: "CLM-001", patient: "John Doe", amount: "$125.50", status: "Approved", priority: "low" },
    { id: "CLM-002", patient: "Jane Smith", amount: "$89.75", status: "Rejected", priority: "high" },
    { id: "CLM-003", patient: "Mike Johnson", amount: "$245.00", status: "Under Review", priority: "medium" },
  ];

  const handleQuickSale = async () => {
    if (!quickSaleData.customer || !quickSaleData.medicine || !quickSaleData.quantity) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsQuickSaleOpen(false);
    setQuickSaleData({ customer: "", medicine: "", quantity: "", paymentMethod: "Cash" });
    showSuccess("Quick sale completed successfully!");
  };

  const handleNewPrescription = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsNewPrescriptionOpen(false);
    showSuccess("New prescription created successfully!");
  };

  const quickActions = [
    { 
      icon: Package, 
      label: "Add Medicine", 
      action: () => showSuccess("Redirecting to inventory..."),
      color: "hover:bg-blue-50 hover:border-blue-200"
    },
    { 
      icon: Users, 
      label: "New Customer", 
      action: () => showSuccess("Redirecting to customers..."),
      color: "hover:bg-green-50 hover:border-green-200"
    },
    { 
      icon: FileText, 
      label: "Create Order", 
      action: () => showSuccess("Redirecting to purchase orders..."),
      color: "hover:bg-purple-50 hover:border-purple-200"
    },
    { 
      icon: Shield, 
      label: "Check Interactions", 
      action: () => showSuccess("Redirecting to drug interactions..."),
      color: "hover:bg-orange-50 hover:border-orange-200"
    },
    { 
      icon: CreditCard, 
      label: "Submit Claim", 
      action: () => showSuccess("Redirecting to insurance claims..."),
      color: "hover:bg-indigo-50 hover:border-indigo-200"
    },
    { 
      icon: TrendingUp, 
      label: "View Reports", 
      action: () => showSuccess("Redirecting to reports..."),
      color: "hover:bg-pink-50 hover:border-pink-200"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's what's happening at your pharmacy.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={isQuickSaleOpen} onOpenChange={setIsQuickSaleOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Sale
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Quick Sale</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer">Customer Name</Label>
                      <Input
                        id="customer"
                        value={quickSaleData.customer}
                        onChange={(e) => setQuickSaleData({...quickSaleData, customer: e.target.value})}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="medicine">Medicine</Label>
                      <Select onValueChange={(value) => setQuickSaleData({...quickSaleData, medicine: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paracetamol">Paracetamol 500mg</SelectItem>
                          <SelectItem value="amoxicillin">Amoxicillin 250mg</SelectItem>
                          <SelectItem value="ibuprofen">Ibuprofen 400mg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quickSaleData.quantity}
                        onChange={(e) => setQuickSaleData({...quickSaleData, quantity: e.target.value})}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select value={quickSaleData.paymentMethod} onValueChange={(value) => setQuickSaleData({...quickSaleData, paymentMethod: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Digital">Digital Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleQuickSale} className="w-full" disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                      Complete Sale
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    New Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Prescription</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Patient Name</Label>
                      <Input placeholder="Enter patient name" />
                    </div>
                    <div>
                      <Label>Doctor Name</Label>
                      <Input placeholder="Enter doctor name" />
                    </div>
                    <div>
                      <Label>Prescription Details</Label>
                      <Input placeholder="Enter prescription details" />
                    </div>
                    <Button onClick={handleNewPrescription} className="w-full" disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                      Create Prescription
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Low Stock Alert */}
          <FadeIn delay={100}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Low Stock Alert
                  <Badge variant="destructive" className="ml-2 animate-pulse">
                    {lowStockItems.filter(item => item.severity === "critical").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      item.severity === "critical" ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"
                    }`}>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Min stock: {item.minStock}</p>
                      </div>
                      <Badge variant={item.severity === "critical" ? "destructive" : "secondary"}>
                        {item.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Drug Interaction Alerts */}
          <FadeIn delay={200}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-5 w-5 text-orange-500 mr-2" />
                  Drug Interaction Alerts
                  <Badge variant="secondary" className="ml-2">
                    {drugInteractionAlerts.filter(alert => alert.priority === "high").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drugInteractionAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{alert.patient}</p>
                        <p className="text-xs text-gray-600">{alert.drugs}</p>
                      </div>
                      <Badge variant={alert.severity === "Major" ? "destructive" : "secondary"}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Recent Sales */}
          <FadeIn delay={300}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  Recent Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{sale.id}</p>
                        <p className="text-xs text-gray-600">{sale.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">{sale.amount}</p>
                        <p className="text-xs text-gray-600">{sale.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Pending Purchase Orders */}
          <FadeIn delay={400}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="h-5 w-5 mr-2" />
                  Pending Purchase Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.id}</p>
                        <p className="text-xs text-gray-600">{order.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">{order.amount}</p>
                        <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Insurance Claims */}
          <FadeIn delay={500}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Insurance Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insuranceClaims.map((claim, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{claim.id}</p>
                        <p className="text-xs text-gray-600">{claim.patient}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">{claim.amount}</p>
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
          </FadeIn>

          {/* Expiring Medicines */}
          <FadeIn delay={600}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                  Expiring Soon
                  <Badge variant="secondary" className="ml-2">
                    {expiringMedicines.filter(med => med.severity === "critical").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiringMedicines.map((medicine, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      medicine.severity === "critical" ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"
                    }`}>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{medicine.name}</p>
                        <p className="text-xs text-gray-600">Expires: {medicine.expiryDate}</p>
                      </div>
                      <Badge variant={medicine.severity === "critical" ? "destructive" : "secondary"}>
                        {medicine.daysLeft} days left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Quick Actions */}
        <FadeIn delay={700}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-16 sm:h-20 flex flex-col items-center justify-center transition-all duration-200 ${action.color}`}
                      onClick={action.action}
                    >
                      <Icon className="h-4 w-4 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                      <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};