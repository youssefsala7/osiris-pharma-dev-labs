import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Download } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SalesStats } from "./sales/SalesStats";
import { SalesTable } from "./sales/SalesTable";
import { QuickSaleForm } from "./sales/QuickSaleForm";
import { SaleDetails } from "./sales/SaleDetails";
import { useSales } from "./sales/hooks/useSales";
import { Sale, QuickSaleData } from "./sales/types";
import { showSuccess } from "@/utils/toast";
import { motion } from "framer-motion";

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
    // Simulate receipt printing
    showSuccess(`Receipt printed for sale ${sale.id}`);
  };

  const handleExportData = () => {
    exportSales();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Track and manage your pharmacy sales</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export
              </Button>
              
              <Dialog open={isQuickSaleOpen} onOpenChange={setIsQuickSaleOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Sale
                    </Button>
                  </motion.div>
                </DialogTrigger>
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
            </div>
          </div>
        </FadeIn>

        <SalesStats stats={stats} />

        {/* Search and Filters */}
        <FadeIn delay={200}>
          <Card>
            <CardContent className="p-4 sm:p-6">
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
            </CardContent>
          </Card>
        </FadeIn>

        <SalesTable
          sales={sales}
          onView={handleViewSale}
          onRefund={handleRefundSale}
          onPrintReceipt={handlePrintReceipt}
          isLoading={isLoading}
        />

        {/* View Sale Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Sale Details</DialogTitle>
            </DialogHeader>
            {viewingSale && <SaleDetails sale={viewingSale} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};