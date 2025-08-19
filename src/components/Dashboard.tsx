import { useState } from "react";
import { 
  Package, 
  Users, 
  FileText, 
  Shield, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Plus 
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { DashboardStats } from "./dashboard/DashboardStats";
import { AlertCard } from "./dashboard/AlertCard";
import { QuickActions } from "./dashboard/QuickActions";
import { QuickSaleDialog } from "./dashboard/QuickSaleDialog";
import { PrescriptionDialog } from "./dashboard/PrescriptionDialog";
import { useDashboard } from "./dashboard/hooks/useDashboard";
import { FadeIn } from "@/components/ui/fade-in";
import { QuickAction } from "./dashboard/types";

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
    createPrescription
  } = useDashboard();

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);

  const quickActions: QuickAction[] = [
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

  // Transform data for AlertCard components
  const lowStockAlerts = lowStockItems.map(item => ({
    id: item.id,
    title: item.name,
    subtitle: `Min stock: ${item.minStock}`,
    badge: `${item.stock} left`,
    severity: item.severity
  }));

  const drugInteractionItems = drugInteractionAlerts.map((alert, index) => ({
    id: `drug-${index}`,
    title: alert.patient,
    subtitle: alert.drugs,
    status: alert.severity,
    severity: alert.priority
  }));

  const recentSaleItems = recentSales.map(sale => ({
    id: sale.id,
    title: sale.id,
    subtitle: sale.customer,
    badge: sale.amount,
    severity: "info" as const
  }));

  const pendingOrderItems = pendingOrders.map(order => ({
    id: order.id,
    title: order.id,
    subtitle: order.supplier,
    status: order.status,
    badge: order.amount,
    severity: order.priority
  }));

  const insuranceClaimItems = insuranceClaims.map(claim => ({
    id: claim.id,
    title: claim.id,
    subtitle: claim.patient,
    status: claim.status,
    badge: claim.amount,
    severity: claim.priority,
    badgeVariant: (
      claim.status === "Approved" ? "default" : 
      claim.status === "Rejected" ? "destructive" : "secondary"
    ) as "default" | "secondary" | "destructive" | "outline"
  }));

  const expiringMedicineItems = expiringMedicines.map((medicine, index) => ({
    id: `exp-${index}`,
    title: medicine.name,
    subtitle: `Expires: ${medicine.expiryDate}`,
    badge: `${medicine.daysLeft} days left`,
    severity: medicine.severity
  }));

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
              <button
                onClick={() => setIsQuickSaleOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Sale
              </button>
              
              <button
                onClick={() => setIsNewPrescriptionOpen(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                New Prescription
              </button>
            </div>
          </div>
        </FadeIn>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <AlertCard
            title="Low Stock Alert"
            icon={<AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
            items={lowStockAlerts}
            delay={100}
          />

          <AlertCard
            title="Drug Interaction Alerts"
            icon={<Shield className="h-5 w-5 text-orange-500 mr-2" />}
            items={drugInteractionItems}
            delay={200}
          />

          <AlertCard
            title="Recent Sales"
            icon={<Activity className="h-5 w-5 text-green-500 mr-2" />}
            items={recentSaleItems}
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <AlertCard
            title="Pending Purchase Orders"
            icon={<FileText className="h-5 w-5 mr-2" />}
            items={pendingOrderItems}
            delay={400}
          />

          <AlertCard
            title="Insurance Claims"
            icon={<CreditCard className="h-5 w-5 mr-2" />}
            items={insuranceClaimItems}
            delay={500}
          />

          <AlertCard
            title="Expiring Soon"
            icon={<Calendar className="h-5 w-5 text-orange-500 mr-2" />}
            items={expiringMedicineItems}
            delay={600}
          />
        </div>

        <QuickActions actions={quickActions} delay={700} />

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
      </div>
    </div>
  );
};