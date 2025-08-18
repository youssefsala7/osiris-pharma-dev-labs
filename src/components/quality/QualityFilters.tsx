import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { QualityFilters as IQualityFilters } from "./types";

interface QualityFiltersProps {
  filters: IQualityFilters;
  onFiltersChange: (filters: IQualityFilters) => void;
  delay?: number;
}

export const QualityFilters = ({ filters, onFiltersChange, delay = 0 }: QualityFiltersProps) => {
  const updateFilter = (key: keyof IQualityFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <FadeIn delay={delay}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search quality checks..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.statusFilter} 
              onValueChange={(value) => updateFilter('statusFilter', value)}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="requires-attention">Requires Attention</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.typeFilter} 
              onValueChange={(value) => updateFilter('typeFilter', value)}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="batch-testing">Batch Testing</SelectItem>
                <SelectItem value="storage-conditions">Storage Conditions</SelectItem>
                <SelectItem value="expiry-verification">Expiry Verification</SelectItem>
                <SelectItem value="supplier-audit">Supplier Audit</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="temperature-log">Temperature Log</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};