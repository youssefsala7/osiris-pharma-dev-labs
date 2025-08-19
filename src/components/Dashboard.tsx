import { useState } from "react";
import {
  Package,
  Users,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Download,
  Calendar,
  Search as SearchIcon,
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "./dashboard/hooks/useDashboard";
import { QuickSaleDialog } from "./dashboard/QuickSaleDialog";
import { PrescriptionDialog } from "./dashboard/PrescriptionDialog";

export const Dashboard = () => {
  const {
    stats,
    lowStockItems,
    recentSales,
    pendingOrders,
    expiringMedicines,
    drugInteractionAlerts,
    insuranceClaims,
    isLoading,
    processQuickSale,
    createPrescription,
  } = useDashboard();

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);

  // New tidy header controls
  const [dateRange, setDateRange] = useState("30d");
  const [search, setSearch] = useState("");

  const exportSummary = () => {
    // lightweight simulated export for now
    showSuccess("Dashboard summary exported.");
  };

  const headerActions = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative max-w-xs w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="h-9 w-[140px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={exportSummary} className="h-9">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsQuickSaleOpen(true)} className="h-9">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Quick Sale
      </Button>
      <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(true)} className="h-9">
        <FileText className="h-4 w-4 mr-2" />
        New Prescription
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening at your pharmacy."
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={<Package className="h-8 w-8 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={<Users className="h-8 w-8 text-green-600" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Today's Sales"
          value={stats.todaysSales}
          icon={<ShoppingCart className="h-8 w-8 text-purple-600" />}
          prefix="$"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.monthlyRevenue}
          icon={<DollarSign className="h-8 w-8 text-orange-600" />}
          prefix="$"
          trend={{ value: 23, isPositive: true }}
        />
      </ResponsiveGrid>

      {/* Alerts & Activity */}
      <ResponsiveGrid cols={3}>
        <StandardCard
          title="Low Stock Alert"
          headerAction={<Badge variant="destructive">{lowStockItems.length}</Badge>}
        >
          <div className="space-y-3">
            {lowStockItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Min stock: {item.minStock}</p>
                </div>
                <Badge variant="destructive" className="animate-pulse">
                  {item.stock} left
                </Badge>
              </div>
            ))}
          </div>
        </StandardCard>

        <StandardCard
          title="Drug Interaction Alerts"
          headerAction={<Badge variant="secondary">{drugInteractionAlerts.length}</Badge>}
        >
          <div className="space-y-3">
            {drugInteractionAlerts.slice(0, 4).map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p className="font-medium text-sm">{alert.patient}</p>
                  <p className="text-xs text-gray-600">{alert.drugs}</p>
                </div>
                <Badge variant="destructive">{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </StandardCard>

        <StandardCard
          title="Recent Sales"
          headerAction={<Badge variant="default">{recentSales.length}</Badge>}
        >
          <div className="space-y-3">
            {recentSales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-medium text-sm">{sale.id}</p>
                  <p className="text-xs text-gray-600">{sale.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{sale.amount}</p>
                  <p className="text-xs text-gray-500">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
        </StandardCard>
      </ResponsiveGrid>

      {/* Orders & Claims */}
      <ResponsiveGrid cols={3}>
        <StandardCard
          title="Pending Purchase Orders"
          headerAction={<Badge variant="secondary">{pendingOrders.length}</Badge>}
        >
          <div className="space-y-3">
            {pendingOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-gray-600">{order.supplier}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{order.status}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </StandardCard>

        <StandardCard
          title="Insurance Claims"
          headerAction={<Badge variant="secondary">{insuranceClaims.length}</Badge>}
        >
          <div className="space-y-3">
            {insuranceClaims.slice(0, 4).map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <div>
                  <p className="font-medium text-sm">{claim.id}</p>
                  <p className="text-xs text-gray-600">{claim.patient}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      claim.status === "Approved"
                        ? "default"
                        : claim.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {claim.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{claim.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </StandardCard>

        <StandardCard
          title="Expiring Soon"
          headerAction={<Badge variant="secondary">{expiringMedicines.length}</Badge>}
        >
          <div className="space-y-3">
            {expiringMedicines.slice(0, 4).map((medicine, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div>
                  <p className="font-medium text-sm">{medicine.name}</p>
                  <p className="text-xs text-gray-600">Expires: {medicine.expiryDate}</p>
                </div>
                <Badge variant="secondary">{medicine.daysLeft} days</Badge>
              </div>
            ))}
          </div>
        </StandardCard>
      </ResponsiveGrid>

      {/* Quick Actions */}
      <StandardCard title="Quick Actions" variant="compact">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
          >
            <Package className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Add Medicine</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200"
          >
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">New Customer</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-200"
            onClick={() => setIsNewPrescriptionOpen(true)}
          >
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">New Prescription</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-200"
          >
            <Shield className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Check Interactions</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-indigo-50 hover:border-indigo-200"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Submit Claim</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center hover:bg-pink-50 hover:border-pink-200"
            onClick={() => setIsQuickSaleOpen(true)}
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Quick Sale</span>
          </Button>
        </div>
      </StandardCard>

      {/* Dialogs */}
      <QuickSaleDialog
        open={isQuickSaleOpen}
        onOpenChange={setIsQuickSaleOpen}
        onSubmit={processQuickSale}
        isLoading={isLoading}
      />
      <PrescriptionDialog
        open={isNewPrescriptionOpen}
        onOpenChange={setIsNewPrescriptionOpen}
        onSubmit={createPrescription}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};