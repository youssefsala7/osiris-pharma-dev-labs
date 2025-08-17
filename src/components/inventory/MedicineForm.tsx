import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Edit } from "lucide-react";
import { MedicineFormData } from "./types";

interface MedicineFormProps {
  formData: MedicineFormData;
  onFormDataChange: (data: MedicineFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  categories: string[];
  isEditing?: boolean;
}

export const MedicineForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
  categories,
  isEditing = false
}: MedicineFormProps) => {
  const updateFormData = (field: keyof MedicineFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Medicine Name *</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter medicine name"
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={formData.category || ""} 
          onValueChange={(value) => updateFormData('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock || ""}
            onChange={(e) => updateFormData('stock', Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="minStock">Min Stock</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock || ""}
            onChange={(e) => updateFormData('minStock', Number(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || ""}
            onChange={(e) => updateFormData('price', Number(e.target.value))}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="strength">Strength</Label>
          <Input
            id="strength"
            value={formData.strength || ""}
            onChange={(e) => updateFormData('strength', e.target.value)}
            placeholder="e.g., 500mg"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate || ""}
          onChange={(e) => updateFormData('expiryDate', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          value={formData.supplier || ""}
          onChange={(e) => updateFormData('supplier', e.target.value)}
          placeholder="Enter supplier name"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Enter medicine description"
          rows={3}
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
        {isEditing ? "Update Medicine" : "Add Medicine"}
      </Button>
    </div>
  );
};