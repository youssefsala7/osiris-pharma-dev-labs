import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ShoppingCart } from "lucide-react";

interface QuickSaleData {
  customer: string;
  medicine: string;
  quantity: string;
  paymentMethod: string;
}

interface QuickSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: QuickSaleData) => Promise<boolean>;
  isLoading: boolean;
}

export const QuickSaleDialog = ({ open, onOpenChange, onSubmit, isLoading }: QuickSaleDialogProps) => {
  const [quickSaleData, setQuickSaleData] = useState<QuickSaleData>({
    customer: "",
    medicine: "",
    quantity: "",
    paymentMethod: "Cash"
  });

  const handleSubmit = async () => {
    const success = await onSubmit(quickSaleData);
    if (success) {
      setQuickSaleData({ customer: "", medicine: "", quantity: "", paymentMethod: "Cash" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Quick Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              value={quickSaleData.customer}
              onChange={(e) => setQuickSaleData({...quickSaleData, customer: e.target.value})}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="medicine">Medicine</Label>
            <Select onValueChange={(value) => setQuickSaleData({...quickSaleData, medicine: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paracetamol">Paracetamol 500mg</SelectItem>
                <SelectItem value="amoxicillin">Amoxicillin 250mg</SelectItem>
                <SelectItem value="ibuprofen">Ibuprofen 400mg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quickSaleData.quantity}
              onChange={(e) => setQuickSaleData({...quickSaleData, quantity: e.target.value})}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <Label htmlFor="payment">Payment Method</Label>
            <Select value={quickSaleData.paymentMethod} onValueChange={(value) => setQuickSaleData({...quickSaleData, paymentMethod: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Digital">Digital Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
            Complete Sale
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};