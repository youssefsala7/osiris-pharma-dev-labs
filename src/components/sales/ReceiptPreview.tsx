import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type ReceiptItem = {
  name: string;
  qty: number;
  price: number;
  total: number;
};

export type ReceiptData = {
  id?: string;
  date: string;
  customer: string;
  paymentMethod: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

interface ReceiptPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: ReceiptData | null;
}

export const ReceiptPreview = ({ open, onOpenChange, receipt }: ReceiptPreviewProps) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          <div className="text-center">
            <div className="font-semibold">PharmaCare Pharmacy</div>
            <div className="text-xs text-gray-600">123 Main Street • (555) 123-4567</div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <div>Sale #{receipt.id || "-"}</div>
            <div>{receipt.date}</div>
          </div>
          <div className="mt-1">Customer: {receipt.customer || "Walk-in Customer"}</div>
          <div className="mt-1">Payment: {receipt.paymentMethod}</div>
          <Separator className="my-2" />
          <div className="space-y-1">
            {receipt.items.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <div className="min-w-0">
                  <div className="truncate">{it.name}</div>
                  <div className="text-xs text-gray-600">x{it.qty} @ ${it.price.toFixed(2)}</div>
                </div>
                <div className="font-medium">${it.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="space-y-1">
            <div className="flex justify-between text-gray-700">
              <div>Subtotal</div><div>${receipt.subtotal.toFixed(2)}</div>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <div>Discount</div><div>- ${receipt.discount.toFixed(2)}</div>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <div>Tax</div><div>${receipt.tax.toFixed(2)}</div>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <div>Total</div><div>${receipt.total.toFixed(2)}</div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="text-center text-xs text-gray-600">
            Thank you for your purchase!
          </div>

          <div className="mt-3 flex gap-2">
            <Button className="flex-1" onClick={() => window.print()}>Print</Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};