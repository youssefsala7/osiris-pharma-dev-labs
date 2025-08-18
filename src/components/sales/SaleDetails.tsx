import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sale } from "./types";

interface SaleDetailsProps {
  sale: Sale;
}

export const SaleDetails = ({ sale }: SaleDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Pending": return "secondary";
      case "Refunded": return "destructive";
      case "Cancelled": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {/* Sale Header */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Sale ID</Label>
          <p className="font-medium text-lg">{sale.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Status</Label>
          <div className="mt-1">
            <Badge variant={getStatusColor(sale.status) as any}>
              {sale.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div>
        <Label className="text-sm font-medium text-gray-600">Customer</Label>
        <div className="mt-1">
          <p className="font-medium">{sale.customerName}</p>
          <p className="text-sm text-gray-600">{sale.customerId}</p>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <Label className="text-sm font-medium text-gray-600">Items Purchased</Label>
        <div className="mt-2 space-y-3">
          {sale.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{item.medicineName}</p>
                <p className="text-sm text-gray-600">
                  ${item.unitPrice.toFixed(2)} x {item.quantity}
                  {item.discount > 0 && (
                    <span className="text-green-600 ml-2">
                      (-${item.discount.toFixed(2)} discount)
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Payment Summary */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>${(sale.totalAmount - sale.tax + sale.discount).toFixed(2)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-${sale.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Tax:</span>
          <span>${sale.tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${sale.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      {/* Transaction Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
          <p className="font-medium">{sale.paymentMethod}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Date</Label>
          <p className="font-medium">{sale.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Cashier</Label>
          <p className="font-medium">{sale.cashierName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Cashier ID</Label>
          <p className="font-mono text-sm">{sale.cashierId}</p>
        </div>
      </div>

      {sale.notes && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Notes</Label>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{sale.notes}</p>
        </div>
      )}
    </div>
  );
};