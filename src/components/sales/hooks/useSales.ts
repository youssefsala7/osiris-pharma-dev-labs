import { useState, useMemo } from "react";
import { Sale, SaleFormData, SalesStats, QuickSaleData } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_SALES: Sale[] = [
  {
    id: "INV-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    items: [
      {
        medicineId: "MED-001",
        medicineName: "Paracetamol 500mg",
        quantity: 2,
        unitPrice: 2.50,
        totalPrice: 5.00,
        discount: 0
      },
      {
        medicineId: "MED-003",
        medicineName: "Ibuprofen 400mg",
        quantity: 1,
        unitPrice: 3.25,
        totalPrice: 3.25,
        discount: 0
      }
    ],
    totalAmount: 8.25,
    paymentMethod: "Cash",
    date: "2024-01-15",
    status: "Completed",
    cashierId: "USR-003",
    cashierName: "Sarah Johnson",
    discount: 0,
    tax: 0.66,
    notes: ""
  },
  {
    id: "INV-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    items: [
      {
        medicineId: "MED-002",
        medicineName: "Amoxicillin 250mg",
        quantity: 1,
        unitPrice: 8.75,
        totalPrice: 8.75,
        discount: 0
      }
    ],
    totalAmount: 8.75,
    paymentMethod: "Card",
    date: "2024-01-15",
    status: "Completed",
    cashierId: "USR-003",
    cashierName: "Sarah Johnson",
    discount: 0,
    tax: 0.70,
    notes: ""
  },
  {
    id: "INV-003",
    customerId: "CUST-003",
    customerName: "Mike Johnson",
    items: [
      {
        medicineId: "MED-001",
        medicineName: "Paracetamol 500mg",
        quantity: 3,
        unitPrice: 2.50,
        totalPrice: 7.50,
        discount: 0.75
      }
    ],
    totalAmount: 7.50,
    paymentMethod: "Cash",
    date: "2024-01-14",
    status: "Completed",
    cashierId: "USR-003",
    cashierName: "Sarah Johnson",
    discount: 0.75,
    tax: 0.60,
    notes: "Senior citizen discount applied"
  },
];

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.cashierName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const saleDate = new Date(sale.date);
        const today = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = saleDate.toDateString() === today.toDateString();
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = saleDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = saleDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [sales, searchTerm, statusFilter, dateFilter]);

  const stats: SalesStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysSales = sales.filter(sale => sale.date === today).length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

    return {
      totalSales: sales.length,
      todaysSales,
      totalRevenue,
      averageSale
    };
  }, [sales]);

  const processQuickSale = async (quickSaleData: QuickSaleData) => {
    if (!quickSaleData.customerName || !quickSaleData.medicineName || !quickSaleData.quantity) {
      showError("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sale: Sale = {
        id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
        customerId: quickSaleData.customerId || `CUST-${String(sales.length + 1).padStart(3, '0')}`,
        customerName: quickSaleData.customerName,
        items: [
          {
            medicineId: quickSaleData.medicineId || `MED-${Math.floor(Math.random() * 100)}`,
            medicineName: quickSaleData.medicineName,
            quantity: quickSaleData.quantity,
            unitPrice: 5.00, // Mock price
            totalPrice: quickSaleData.quantity * 5.00,
            discount: 0
          }
        ],
        totalAmount: quickSaleData.quantity * 5.00,
        paymentMethod: quickSaleData.paymentMethod,
        date: new Date().toISOString().split('T')[0],
        status: "Completed",
        cashierId: "USR-003",
        cashierName: "Current User",
        discount: 0,
        tax: quickSaleData.quantity * 5.00 * 0.08,
        notes: "Quick sale transaction"
      };
      
      setSales(prev => [sale, ...prev]);
      showSuccess("Quick sale completed successfully!");
      return true;
    } catch (error) {
      showError("Failed to process sale");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addSale = async (saleData: SaleFormData) => {
    if (!saleData.customerName || !saleData.items || saleData.items.length === 0) {
      showError("Please add at least one item to the sale");
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sale: Sale = {
        id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
        customerId: saleData.customerId || `CUST-${String(sales.length + 1).padStart(3, '0')}`,
        customerName: saleData.customerName,
        items: saleData.items,
        totalAmount: saleData.items.reduce((sum, item) => sum + item.totalPrice, 0),
        paymentMethod: saleData.paymentMethod || "Cash",
        date: new Date().toISOString().split('T')[0],
        status: "Completed",
        cashierId: "USR-003",
        cashierName: "Current User",
        discount: saleData.discount || 0,
        tax: saleData.tax || 0,
        notes: saleData.notes || ""
      };
      
      setSales(prev => [sale, ...prev]);
      showSuccess("Sale recorded successfully!");
      return true;
    } catch (error) {
      showError("Failed to record sale");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refundSale = async (saleId: string) => {
    if (!window.confirm("Are you sure you want to refund this sale?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, status: "Refunded" as const } : sale
      ));
      showSuccess("Sale refunded successfully!");
      return true;
    } catch (error) {
      showError("Failed to refund sale");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportSales = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ["Sale ID", "Customer", "Date", "Amount", "Payment Method", "Status"].join(","),
        ...filteredSales.map(sale => [
          sale.id, sale.customerName, sale.date, sale.totalAmount, 
          sale.paymentMethod, sale.status
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sales-export.csv";
      a.click();
      
      showSuccess("Sales data exported successfully!");
      return true;
    } catch (error) {
      showError("Failed to export data");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sales: filteredSales,
    allSales: sales,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    stats,
    isLoading,
    processQuickSale,
    addSale,
    refundSale,
    exportSales
  };
};