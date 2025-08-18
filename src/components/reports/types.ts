export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: "sales" | "inventory" | "customer" | "financial" | "prescription";
  dateRange: string;
  generatedBy: string;
  generatedAt: string;
  status: "Generated" | "Processing" | "Failed";
  fileSize?: string;
  downloadUrl?: string;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingMedicines: TopSellingMedicine[];
  salesByPaymentMethod: PaymentMethodSales[];
  dailySales: DailySales[];
  monthlySales: MonthlySales[];
}

export interface TopSellingMedicine {
  name: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface PaymentMethodSales {
  method: string;
  amount: number;
  percentage: number;
  transactions: number;
}

export interface DailySales {
  date: string;
  sales: number;
  revenue: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface InventoryReport {
  totalMedicines: number;
  totalValue: number;
  lowStockItems: number;
  expiringItems: number;
  categoryBreakdown: CategoryBreakdown[];
  stockMovement: StockMovement[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

export interface StockMovement {
  date: string;
  inbound: number;
  outbound: number;
  net: number;
}

export interface CustomerReport {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customerRetention: number;
  topCustomers: TopCustomer[];
  customerSegments: CustomerSegment[];
}

export interface TopCustomer {
  name: string;
  totalPurchases: number;
  visits: number;
  lastVisit: string;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  averageSpend: number;
}

export interface ReportFilters {
  dateRange: "today" | "week" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  reportType: "all" | "sales" | "inventory" | "customer" | "financial" | "prescription";
  status: "all" | "Generated" | "Processing" | "Failed";
}