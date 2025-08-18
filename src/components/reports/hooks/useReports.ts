import { useState, useMemo } from "react";
import { ReportData, SalesReport, InventoryReport, CustomerReport, ReportFilters } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_REPORTS: ReportData[] = [
  {
    id: "RPT-001",
    title: "Monthly Sales Report",
    description: "Comprehensive sales analysis for January 2024",
    type: "sales",
    dateRange: "Jan 1 - Jan 31, 2024",
    generatedBy: "System Admin",
    generatedAt: "2024-01-31T10:30:00Z",
    status: "Generated",
    fileSize: "2.4 MB",
    downloadUrl: "#"
  },
  {
    id: "RPT-002",
    title: "Inventory Status Report",
    description: "Current inventory levels and stock analysis",
    type: "inventory",
    dateRange: "As of Jan 31, 2024",
    generatedBy: "Inventory Manager",
    generatedAt: "2024-01-31T09:15:00Z",
    status: "Generated",
    fileSize: "1.8 MB",
    downloadUrl: "#"
  },
  {
    id: "RPT-003",
    title: "Customer Analytics Report",
    description: "Customer behavior and segmentation analysis",
    type: "customer",
    dateRange: "Q4 2023",
    generatedBy: "Marketing Team",
    generatedAt: "2024-01-30T14:45:00Z",
    status: "Processing",
    fileSize: "3.1 MB"
  },
  {
    id: "RPT-004",
    title: "Financial Summary Report",
    description: "Revenue, expenses, and profit analysis",
    type: "financial",
    dateRange: "Jan 1 - Jan 31, 2024",
    generatedBy: "Finance Manager",
    generatedAt: "2024-01-31T16:20:00Z",
    status: "Generated",
    fileSize: "1.2 MB",
    downloadUrl: "#"
  },
];

const MOCK_SALES_REPORT: SalesReport = {
  totalSales: 1247,
  totalRevenue: 45230.75,
  averageOrderValue: 36.28,
  topSellingMedicines: [
    { name: "Paracetamol 500mg", quantity: 450, revenue: 1125.00, percentage: 15.2 },
    { name: "Amoxicillin 250mg", quantity: 320, revenue: 2800.00, percentage: 12.8 },
    { name: "Ibuprofen 400mg", quantity: 280, revenue: 910.00, percentage: 11.2 },
    { name: "Aspirin 75mg", quantity: 195, revenue: 487.50, percentage: 7.8 },
  ],
  salesByPaymentMethod: [
    { method: "Cash", amount: 18500.30, percentage: 40.9, transactions: 512 },
    { method: "Card", amount: 15200.45, percentage: 33.6, transactions: 398 },
    { method: "Digital", amount: 8730.00, percentage: 19.3, transactions: 245 },
    { method: "Insurance", amount: 2800.00, percentage: 6.2, transactions: 92 },
  ],
  dailySales: [
    { date: "2024-01-01", sales: 45, revenue: 1650.25 },
    { date: "2024-01-02", sales: 52, revenue: 1890.50 },
    { date: "2024-01-03", sales: 38, revenue: 1420.75 },
    { date: "2024-01-04", sales: 61, revenue: 2210.00 },
    { date: "2024-01-05", sales: 47, revenue: 1705.25 },
  ],
  monthlySales: [
    { month: "Oct 2023", sales: 1180, revenue: 42500.00, growth: 8.5 },
    { month: "Nov 2023", sales: 1205, revenue: 43200.00, growth: 1.6 },
    { month: "Dec 2023", sales: 1156, revenue: 41800.00, growth: -3.2 },
    { month: "Jan 2024", sales: 1247, revenue: 45230.75, growth: 7.9 },
  ]
};

export const useReports = () => {
  const [reports, setReports] = useState<ReportData[]>(INITIAL_REPORTS);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "month",
    reportType: "all",
    status: "all"
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesType = filters.reportType === "all" || report.type === filters.reportType;
      const matchesStatus = filters.status === "all" || report.status === filters.status;
      return matchesType && matchesStatus;
    });
  }, [reports, filters]);

  const generateReport = async (reportType: string, dateRange: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        description: `Generated ${reportType} report for ${dateRange}`,
        type: reportType as any,
        dateRange,
        generatedBy: "Current User",
        generatedAt: new Date().toISOString(),
        status: "Generated",
        fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloadUrl: "#"
      };
      
      setReports(prev => [newReport, ...prev]);
      showSuccess("Report generated successfully!");
      return true;
    } catch (error) {
      showError("Failed to generate report");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate file download
      const report = reports.find(r => r.id === reportId);
      if (report) {
        showSuccess(`Downloading ${report.title}...`);
      }
      return true;
    } catch (error) {
      showError("Failed to download report");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.filter(report => report.id !== reportId));
      showSuccess("Report deleted successfully!");
      return true;
    } catch (error) {
      showError("Failed to delete report");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSalesReport = (): SalesReport => MOCK_SALES_REPORT;

  const getInventoryReport = (): InventoryReport => ({
    totalMedicines: 1247,
    totalValue: 125000.00,
    lowStockItems: 23,
    expiringItems: 8,
    categoryBreakdown: [
      { category: "Pain Relief", count: 245, value: 12500.00, percentage: 19.6 },
      { category: "Antibiotics", count: 189, value: 18900.00, percentage: 15.1 },
      { category: "Vitamins", count: 156, value: 7800.00, percentage: 12.5 },
      { category: "Cold & Flu", count: 134, value: 6700.00, percentage: 10.7 },
    ],
    stockMovement: [
      { date: "2024-01-01", inbound: 150, outbound: 89, net: 61 },
      { date: "2024-01-02", inbound: 200, outbound: 125, net: 75 },
      { date: "2024-01-03", inbound: 75, outbound: 156, net: -81 },
      { date: "2024-01-04", inbound: 300, outbound: 98, net: 202 },
    ]
  });

  const getCustomerReport = (): CustomerReport => ({
    totalCustomers: 856,
    activeCustomers: 642,
    newCustomers: 89,
    customerRetention: 75.2,
    topCustomers: [
      { name: "John Doe", totalPurchases: 1250.75, visits: 24, lastVisit: "2024-01-30" },
      { name: "Jane Smith", totalPurchases: 875.50, visits: 18, lastVisit: "2024-01-29" },
      { name: "Mike Johnson", totalPurchases: 2150.25, visits: 31, lastVisit: "2024-01-28" },
    ],
    customerSegments: [
      { segment: "Regular", count: 425, percentage: 49.6, averageSpend: 45.20 },
      { segment: "Occasional", count: 298, percentage: 34.8, averageSpend: 28.50 },
      { segment: "New", count: 89, percentage: 10.4, averageSpend: 15.75 },
      { segment: "VIP", count: 44, percentage: 5.1, averageSpend: 125.00 },
    ]
  });

  return {
    reports: filteredReports,
    allReports: reports,
    filters,
    setFilters,
    isLoading,
    generateReport,
    downloadReport,
    deleteReport,
    getSalesReport,
    getInventoryReport,
    getCustomerReport
  };
};