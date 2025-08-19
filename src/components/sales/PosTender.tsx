import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreditCard, DollarSign, User, FileText } from "lucide-react";

interface PosTenderProps {
  total: number;
  onComplete: (opts: { customerName: string; paymentMethod: string; amountReceived?: number }) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const PosTender = ({
  total,
  onComplete,
  disabled = false,
  isLoading = false,
}: PosTenderProps) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState<string>("");

  const changeDue = useMemo(() => {
    if (paymentMethod !== "Cash") return 0;
    const amt = Number(amountReceived) || 0;
    return Math.max(0, amt - total);
  }, [amountReceived, paymentMethod, total]);

  const canComplete = useMemo(() => {
    if (disabled) return false;
    if (total <= 0) return false;
    if (paymentMethod === "Cash") {
      const amt = Number(amountReceived) || 0;
      return amt >= total;
    }
    return true;
  }, [disabled, total, paymentMethod, amountReceived]);

  const quickFill = (type: "exact" | 5 | 10 | 20) => {
    if (paymentMethod !== "Cash") return;
    if (type === "exact") {
      setAmountReceived(total.toFixed(2));
      return;
    }
    const current = Number(amountReceived) || 0;
    setAmountReceived((current + Number(type)).toFixed(2));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Tender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-sm"><User className="h-3.5 w-3.5 inline mr-1" /> Customer (optional)</Label>
          <Input
            placeholder="Walk-in customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-sm"><FileText className="h-3.5 w-3.5 inline mr-1" /> Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Digital">Digital</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1" /> Amount Received
            </Label>
            <Input
              type="number"
              placeholder={paymentMethod === "Cash" ? total.toFixed(2) : "Optional"}
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              disabled={paymentMethod !== "Cash"}
            />
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickFill("exact")} disabled={paymentMethod !== "Cash"}>
                Exact
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickFill(5)} disabled={paymentMethod !== "Cash"}>
                +$5
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickFill(10)} disabled={paymentMethod !== "Cash"}>
                +$10
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickFill(20)} disabled={paymentMethod !== "Cash"}>
                +$20
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Change Due: <span className="font-semibold">${changeDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div>Total</div>
            <div className="font-semibold">${total.toFixed(2)}</div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => onComplete({ customerName, paymentMethod, amountReceived: Number(amountReceived) || undefined })}
          disabled={!canComplete || isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          Complete Sale
        </Button>
      </CardContent>
    </Card>
  );
};