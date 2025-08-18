import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Download, Plus, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 text-sm sm:text-base">Generate and manage your pharmacy reports</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={exportAllReports} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export All
              </Button>
              
              <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Sales Analytics</DialogTitle>
                  </DialogHeader>
                  <SalesChart data={getSalesReport()} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogTrigger>
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
            </div>
          </div>
        </FadeIn>

        {/* Quick Stats */}
        <FadeIn delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Generated Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => {
                        const today = new Date().toDateString();
                        const reportDate = new Date(r.generatedAt).toDateString();
                        return today === reportDate;
                      }).length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => r.status === "Processing").length}
                    </p>
                  </div>
                  <LoadingSpinner size="lg" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Size</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.reduce((total, report) => {
                        if (report.fileSize) {
                          const size = parseFloat(report.fileSize.replace(' MB', ''));
                          return total + size;
                        }
                        return total;
                      }, 0).toFixed(1)} MB
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={200}>
          <Card>
            <CardContent className="p-4 sm:p-6">
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
            </CardContent>
          </Card>
        </FadeIn>

        {/* Reports Grid */}
        <FadeIn delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDownload={downloadReport}
                onDelete={deleteReport}
                isLoading={isLoading}
              />
            ))}
          </div>
        </FadeIn>

        {reports.length === 0 && (
          <FadeIn delay={400}>
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">Generate your first report to get started with analytics.</p>
                <Button onClick={() => setIsGeneratorOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        )}
      </div>
    </div>
  );
};