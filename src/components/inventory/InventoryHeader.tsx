import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FadeIn } from "@/components/ui/fade-in";

interface InventoryHeaderProps {
  onExport: () => void;
  onAddMedicine: () => void;
  isLoading: boolean;
}

export const InventoryHeader = ({ onExport, onAddMedicine, isLoading }: InventoryHeaderProps) => {
  return (
    <FadeIn>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your medicine stock and inventory</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onExport} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
          
          <Button onClick={onAddMedicine} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};