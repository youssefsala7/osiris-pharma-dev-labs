import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Download } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { SalesStats } from "./sales/SalesStats";
import { SalesTable } from "./sales/SalesTable";
import { QuickSaleForm } from "./sales/QuickSaleForm";
import { SaleDetails } from "./sales/SaleDetails";
import { useSales } from "./sales/hooks/useSales";
import { Sale, QuickSaleData } from "./sales/types";
import { ShoppingCart, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { showSuccess } from "@/utils/toast";

export const Sales = () => {
  const {
    sales,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    stats,
    isLoading,
    processQuickSale,
    refundSale,
    exportSales
  } = useSales();

  // Dialog states
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [quickSaleData, setQuickSaleData] = useState<QuickSaleData>({
    customerName: "",
    medicineName: "",
    quantity: 1,
    paymentMethod: "Cash"
  });
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  const handleQuickSale = async () => {
    const success = await processQuickSale(quickSaleData);
    if (success) {
      setQuickSaleData({
        customerName: "",
        medicineName: "",
        quantity: 1,
        paymentMethod: "Cash"
      });
      setIsQuickSaleOpen(false);
    }
  };

  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale);
    setIsViewDialogOpen(true);
  };

  const handleRefundSale = (saleId: string) => {
    refundSale(saleId);
  };

  const handlePrintReceipt = (sale: Sale) => {
    showSuccess(`Receipt printed for sale ${sale.id}`);
  };

  const handleExportData = () => {
    exportSales();
  };

  const headerActions = (
    <>
      <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsQuickSaleOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Quick Sale
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Sales Management"
      subtitle="Track and manage your pharmacy sales"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Today's Sales"
          value={stats.todaysSales}
          icon={<ShoppingCart className="h-8 w-8 text-blue-600" />}
          suffix=" sales"
        />
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={<TrendingUp className="h-8 w-8 text-green-600" />}
          suffix=" transactions"
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<DollarSign className="h-8 w-8 text-purple-600" />}
          prefix="$"
        />
        <StatCard
          title="Average Sale"
          value={stats.averageSale}
          icon={<Calendar className="h-8 w-8 text-orange-600" />}
          prefix="$"
        />
      </ResponsiveGrid>

      {/* Search and Filters */}
      <StandardCard>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sales by ID, customer, or cashier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </StandardCard>

      <SalesTable
        sales={sales}
        onView={handleViewSale}
        onRefund={handleRefundSale}
        onPrintReceipt={handlePrintReceipt}
        isLoading={isLoading}
      />

      {/* Dialogs */}
      <Dialog open={isQuickSaleOpen} onOpenChange={setIsQuickSaleOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Quick Sale</DialogTitle>
          </DialogHeader>
          <QuickSaleForm
            formData={quickSaleData}
            onFormDataChange={setQuickSaleData}
            onSubmit={handleQuickSale}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
          </DialogHeader>
          {viewingSale && <SaleDetails sale={viewingSale} />}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};