import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Download, Plus, TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReportCard } from "./reports/ReportCard";
import { ReportGenerator } from "./reports/ReportGenerator";
import { SalesChart } from "./reports/SalesChart";
import { useReports } from "./reports/hooks/useReports";

export const Reports = () => {
  const {
    reports,
    filters,
    setFilters,
    isLoading,
    generateReport,
    downloadReport,
    deleteReport,
    getSalesReport
  } = useReports();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const handleGenerateReport = async (reportType: string, dateRange: string) => {
    const success = await generateReport(reportType, dateRange);
    if (success) {
      setIsGeneratorOpen(false);
    }
    return success;
  };

  const exportAllReports = async () => {
    // Simulate export functionality
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const csvContent = [
      ["Report ID", "Title", "Type", "Status", "Generated At", "File Size"].join(","),
      ...reports.map(report => [
        report.id, report.title, report.type, report.status, 
        report.generatedAt, report.fileSize || "N/A"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports-summary.csv";
    a.click();
  };

  const headerActions = (
    <>
      <Button onClick={exportAllReports} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
        Export All
      </Button>
      
      <Button variant="outline" onClick={() => setIsAnalyticsOpen(true)} className="w-full sm:w-auto">
        <TrendingUp className="h-4 w-4 mr-2" />
        Analytics
      </Button>
      
      <Button onClick={() => setIsGeneratorOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Generate Report
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Reports & Analytics"
      subtitle="Generate and manage your pharmacy reports"
      headerActions={headerActions}
    >
      {/* Quick Stats */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Generated Today"
          value={reports.filter(r => {
            const today = new Date().toDateString();
            const reportDate = new Date(r.generatedAt).toDateString();
            return today === reportDate;
          }).length}
          icon={<TrendingUp className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Processing"
          value={reports.filter(r => r.status === "Processing").length}
          icon={<LoadingSpinner size="lg" />}
        />
        <StatCard
          title="Total Size"
          value={`${reports.reduce((total, report) => {
            if (report.fileSize) {
              const size = parseFloat(report.fileSize.replace(' MB', ''));
              return total + size;
            }
            return total;
          }, 0).toFixed(1)} MB`}
          icon={<Download className="h-8 w-8 text-purple-600" />}
          animated={false}
        />
      </ResponsiveGrid>

      {/* Filters */}
      <StandardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select 
            value={filters.reportType} 
            onValueChange={(value) => setFilters({...filters, reportType: value as any})}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters({...filters, status: value as any})}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Generated">Generated</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => setFilters({...filters, dateRange: value as any})}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </StandardCard>

      {/* Reports Grid */}
      <ResponsiveGrid cols={3}>
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onDownload={downloadReport}
            onDelete={deleteReport}
            isLoading={isLoading}
          />
        ))}
      </ResponsiveGrid>

      {reports.length === 0 && (
        <StandardCard>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-4">Generate your first report to get started with analytics.</p>
            <Button onClick={() => setIsGeneratorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </StandardCard>
      )}

      {/* Dialogs */}
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-6xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Analytics</DialogTitle>
          </DialogHeader>
          <SalesChart data={getSalesReport()} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <ReportGenerator
            onGenerate={handleGenerateReport}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};