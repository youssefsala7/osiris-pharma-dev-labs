import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ShoppingCart } from "lucide-react";
import { QuickSaleData } from "./types";

interface QuickSaleFormProps {
  formData: QuickSaleData;
  onFormDataChange: (data: QuickSaleData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const QuickSaleForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading
}: QuickSaleFormProps) => {
  const updateFormData = (field: keyof QuickSaleData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const availableMedicines = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Ibuprofen 400mg",
    "Aspirin 75mg",
    "Vitamin D3 1000IU",
    "Omeprazole 20mg"
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          value={formData.customerName}
          onChange={(e) => updateFormData('customerName', e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      
      <div>
        <Label htmlFor="medicine">Medicine *</Label>
        <Select onValueChange={(value) => updateFormData('medicineName', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select medicine" />
          </SelectTrigger>
          <SelectContent>
            {availableMedicines.map(medicine => (
              <SelectItem key={medicine} value={medicine}>{medicine}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity || ""}
          onChange={(e) => updateFormData('quantity', Number(e.target.value))}
          placeholder="Enter quantity"
        />
      </div>
      
      <div>
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select 
          value={formData.paymentMethod} 
          onValueChange={(value) => updateFormData('paymentMethod', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Credit/Debit Card</SelectItem>
            <SelectItem value="Digital">Digital Payment</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={onSubmit} 
        className="w-full" 
        disabled={isLoading || !formData.customerName || !formData.medicineName || !formData.quantity}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        Complete Sale
      </Button>
    </div>
  );
};