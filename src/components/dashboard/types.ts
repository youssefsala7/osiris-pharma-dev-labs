export interface DashboardStats {
  totalMedicines: number;
  activeCustomers: number;
  todaysSales: number;
  monthlyRevenue: number;
}

export interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  severity: "critical" | "warning" | "info";
}

export interface RecentSale {
  id: string;
  customer: string;
  amount: string;
  time: string;
  status: "completed" | "pending" | "refunded";
}

export interface PendingOrder {
  id: string;
  supplier: string;
  amount: string;
  status: "Confirmed" | "Sent" | "Delivered";
  priority: "high" | "medium" | "low";
}

export interface ExpiringMedicine {
  name: string;
  expiryDate: string;
  daysLeft: number;
  severity: "critical" | "warning" | "info";
}

export interface DrugInteractionAlert {
  patient: string;
  drugs: string;
  severity: "Major" | "Moderate" | "Minor";
  priority: "high" | "medium" | "low";
}

export interface InsuranceClaim {
  id: string;
  patient: string;
  amount: string;
  status: "Approved" | "Rejected" | "Under Review";
  priority: "high" | "medium" | "low";
}

export interface QuickAction {
  icon: any;
  label: string;
  action: () => void;
  color: string;
}