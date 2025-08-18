import { useState, useMemo } from "react";
import { 
  DashboardStats, 
  LowStockItem, 
  RecentSale, 
  PendingOrder, 
  ExpiringMedicine, 
  DrugInteractionAlert, 
  InsuranceClaim 
} from "../types";
import { showSuccess } from "@/utils/toast";

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = useMemo(() => ({
    totalMedicines: 1247,
    activeCustomers: 856,
    todaysSales: 2847,
    monthlyRevenue: 45230
  }), []);

  const lowStockItems: LowStockItem[] = useMemo(() => [
    { id: "MED-001", name: "Paracetamol 500mg", stock: 15, minStock: 50, severity: "critical" },
    { id: "MED-002", name: "Amoxicillin 250mg", stock: 8, minStock: 30, severity: "critical" },
    { id: "MED-003", name: "Ibuprofen 400mg", stock: 22, minStock: 40, severity: "warning" },
    { id: "MED-004", name: "Aspirin 75mg", stock: 12, minStock: 25, severity: "critical" },
  ], []);

  const recentSales: RecentSale[] = useMemo(() => [
    { id: "INV-001", customer: "John Doe", amount: "$45.50", time: "2 min ago", status: "completed" },
    { id: "INV-002", customer: "Jane Smith", amount: "$78.20", time: "15 min ago", status: "completed" },
    { id: "INV-003", customer: "Mike Johnson", amount: "$32.10", time: "1 hour ago", status: "completed" },
    { id: "INV-004", customer: "Sarah Wilson", amount: "$156.75", time: "2 hours ago", status: "completed" },
  ], []);

  const pendingOrders: PendingOrder[] = useMemo(() => [
    { id: "PO-001", supplier: "PharmaCorp Ltd", amount: "$1,971.00", status: "Confirmed", priority: "high" },
    { id: "PO-002", supplier: "MediSupply Inc", amount: "$1,620.00", status: "Sent", priority: "medium" },
    { id: "PO-003", supplier: "VitaHealth Distributors", amount: "$1,296.00", status: "Delivered", priority: "low" },
  ], []);

  const expiringMedicines: ExpiringMedicine[] = useMemo(() => [
    { name: "Vitamin C 500mg", expiryDate: "2024-02-28", daysLeft: 13, severity: "critical" },
    { name: "Cough Syrup", expiryDate: "2024-03-15", daysLeft: 28, severity: "warning" },
    { name: "Eye Drops", expiryDate: "2024-03-20", daysLeft: 33, severity: "info" },
  ], []);

  const drugInteractionAlerts: DrugInteractionAlert[] = useMemo(() => [
    { patient: "John Doe", drugs: "Warfarin + Aspirin", severity: "Major", priority: "high" },
    { patient: "Mary Johnson", drugs: "Digoxin + Amiodarone", severity: "Major", priority: "high" },
    { patient: "Robert Smith", drugs: "Metformin + Contrast", severity: "Moderate", priority: "medium" },
  ], []);

  const insuranceClaims: InsuranceClaim[] = useMemo(() => [
    { id: "CLM-001", patient: "John Doe", amount: "$125.50", status: "Approved", priority: "low" },
    { id: "CLM-002", patient: "Jane Smith", amount: "$89.75", status: "Rejected", priority: "high" },
    { id: "CLM-003", patient: "Mike Johnson", amount: "$245.00", status: "Under Review", priority: "medium" },
  ], []);

  const processQuickSale = async (saleData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess("Quick sale completed successfully!");
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createPrescription = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("New prescription created successfully!");
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};