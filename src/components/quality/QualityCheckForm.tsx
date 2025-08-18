import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Edit } from "lucide-react";
import { QualityCheckFormData } from "./types";

interface QualityCheckFormProps {
  formData: QualityCheckFormData;
  onFormDataChange: (data: QualityCheckFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEditing?: boolean;
}

export const QualityCheckForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
  isEditing = false
}: QualityCheckFormProps) => {
  const updateFormData = (field: keyof QualityCheckFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Check Type *</Label>
          <Select 
            value={formData.type || ""} 
            onValueChange={(value) => updateFormData('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select check type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="batch-testing">Batch Testing</SelectItem>
              <SelectItem value="storage-conditions">Storage Conditions</SelectItem>
              <SelectItem value="expiry-verification">Expiry Verification</SelectItem>
              <SelectItem value="supplier-audit">Supplier Audit</SelectItem>
              <SelectItem value="documentation">Documentation Review</SelectItem>
              <SelectItem value="temperature-log">Temperature Log</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={formData.priority || "medium"} 
            onValueChange={(value) => updateFormData('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicineName">Medicine Name</Label>
          <Input
            id="medicineName"
            value={formData.medicineName || ""}
            onChange={(e) => updateFormData('medicineName', e.target.value)}
            placeholder="Enter medicine name (if applicable)"
          />
        </div>
        
        <div>
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input
            id="batchNumber"
            value={formData.batchNumber || ""}
            onChange={(e) => updateFormData('batchNumber', e.target.value)}
            placeholder="Enter batch number (if applicable)"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="inspector">Inspector *</Label>
        <Input
          id="inspector"
          value={formData.inspector || ""}
          onChange={(e) => updateFormData('inspector', e.target.value)}
          placeholder="Enter inspector name"
        />
      </div>
      
      <div>
        <Label htmlFor="findings">Findings *</Label>
        <Textarea
          id="findings"
          value={formData.findings || ""}
          onChange={(e) => updateFormData('findings', e.target.value)}
          placeholder="Enter detailed findings"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="corrective_actions">Corrective Actions</Label>
        <Textarea
          id="corrective_actions"
          value={formData.corrective_actions || ""}
          onChange={(e) => updateFormData('corrective_actions', e.target.value)}
          placeholder="Enter corrective actions taken or required"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="next_check_date">Next Check Date</Label>
        <Input
          id="next_check_date"
          type="date"
          value={formData.next_check_date || ""}
          onChange={(e) => updateFormData('next_check_date', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="cost_impact">Cost Impact ($)</Label>
        <Input
          id="cost_impact"
          type="number"
          step="0.01"
          value={formData.cost_impact || ""}
          onChange={(e) => updateFormData('cost_impact', Number(e.target.value))}
          placeholder="0.00"
        />
      </div>
      
      <Button onClick={onSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : isEditing ? (
          <Edit className="h-4 w-4 mr-2" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        {isEditing ? "Update Quality Check" : "Add Quality Check"}
      </Button>
    </div>
  );
};