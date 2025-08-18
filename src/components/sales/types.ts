export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: "Completed" | "Pending" | "Refunded" | "Cancelled";
  cashierId: string;
  cashierName: string;
  discount: number;
  tax: number;
  notes?: string;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

export interface SalesStats {
  totalSales: number;
  todaysSales: number;
  totalRevenue: number;
  averageSale: number;
}

export interface SaleFormData extends Partial<Sale> {}

export interface QuickSaleData {
  customerId?: string;
  customerName: string;
  medicineId?: string;
  medicineName: string;
  quantity: number;
  paymentMethod: string;
}