import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, Calendar } from "lucide-react";

interface ReportGeneratorProps {
  onGenerate: (reportType: string, dateRange: string) => Promise<boolean>;
  isLoading: boolean;
}

export const ReportGenerator = ({ onGenerate, isLoading }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const handleGenerate = async () => {
    if (!reportType) return;
    
    let dateRangeText = "";
    switch (dateRange) {
      case "today":
        dateRangeText = "Today";
        break;
      case "week":
        dateRangeText = "This Week";
        break;
      case "month":
        dateRangeText = "This Month";
        break;
      case "quarter":
        dateRangeText = "This Quarter";
        break;
      case "year":
        dateRangeText = "This Year";
        break;
      case "custom":
        dateRangeText = `${customStartDate} to ${customEndDate}`;
        break;
      default:
        dateRangeText = "This Month";
    }
    
    await onGenerate(reportType, dateRangeText);
    setReportType("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Generate New Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="reportType">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="inventory">Inventory Report</SelectItem>
              <SelectItem value="customer">Customer Report</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="prescription">Prescription Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dateRange">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleGenerate} 
          className="w-full" 
          disabled={isLoading || !reportType}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Calendar className="h-4 w-4 mr-2" />
          )}
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
};