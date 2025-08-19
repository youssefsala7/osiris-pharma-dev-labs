import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreditCard, DollarSign, User, Banknote, Smartphone, Shield } from "lucide-react";

interface ModernPosTenderProps {
  total: number;
  onComplete: (opts: { customerName: string; paymentMethod: string; amountReceived?: number }) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ModernPosTender = ({
  total,
  onComplete,
  disabled = false,
  isLoading = false,
}: ModernPosTenderProps) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cashAmount, setCashAmount] = useState<number>(0);

  const changeDue = useMemo(() => {
    if (paymentMethod !== "Cash") return 0;
    return Math.max(0, cashAmount - total);
  }, [cashAmount, paymentMethod, total]);

  const canComplete = useMemo(() => {
    if (disabled || total <= 0) return false;
    if (paymentMethod === "Cash") return cashAmount >= total;
    return paymentMethod !== "";
  }, [disabled, total, paymentMethod, cashAmount]);

  const handlePayment = (method: string, amount?: number) => {
    setPaymentMethod(method);
    if (method === "Cash" && amount) {
      setCashAmount(amount);
    }
    
    // Auto-complete for non-cash payments
    if (method !== "Cash") {
      onComplete({
        customerName: customerName || "Walk-in Customer",
        paymentMethod: method,
      });
    }
  };

  const handleCashPayment = () => {
    onComplete({
      customerName: customerName || "Walk-in Customer",
      paymentMethod: "Cash",
      amountReceived: cashAmount,
    });
  };

  const quickCashAmounts = [
    { label: "Exact", amount: total },
    { label: `$${Math.ceil(total)}`, amount: Math.ceil(total) },
    { label: `$${Math.ceil(total / 5) * 5}`, amount: Math.ceil(total / 5) * 5 },
    { label: `$${Math.ceil(total / 10) * 10}`, amount: Math.ceil(total / 10) * 10 },
  ].filter((item, index, arr) => arr.findIndex(i => i.amount === item.amount) === index);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer */}
        <div>
          <Label className="text-sm flex items-center mb-2">
            <User className="h-4 w-4 mr-1" />
            Customer
          </Label>
          <Input
            placeholder="Walk-in customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Total Display */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Payment Method</Label>
          
          {/* Cash Payment */}
          <div className="space-y-2">
            <Button
              variant={paymentMethod === "Cash" ? "default" : "outline"}
              className="w-full justify-start h-auto p-3"
              onClick={() => setPaymentMethod("Cash")}
            >
              <Banknote className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Cash</div>
                <div className="text-xs opacity-70">Physical currency</div>
              </div>
            </Button>
            
            {paymentMethod === "Cash" && (
              <div className="ml-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {quickCashAmounts.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCashAmount(item.amount)}
                      className={cashAmount === item.amount ? "bg-blue-50 border-blue-300" : ""}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={cashAmount || ""}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  step="0.01"
                />
                {changeDue > 0 && (
                  <div className="text-sm">
                    <Badge variant="secondary">Change Due: ${changeDue.toFixed(2)}</Badge>
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleCashPayment}
                  disabled={!canComplete || isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Complete Cash Payment
                </Button>
              </div>
            )}
          </div>

          {/* Card Payment */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => handlePayment("Card")}
            disabled={isLoading}
          >
            <CreditCard className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Card</div>
              <div className="text-xs opacity-70">Credit/Debit card</div>
            </div>
          </Button>

          {/* Digital Payment */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => handlePayment("Digital")}
            disabled={isLoading}
          >
            <Smartphone className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Digital</div>
              <div className="text-xs opacity-70">Apple Pay, Google Pay, etc.</div>
            </div>
          </Button>

          {/* Insurance */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => handlePayment("Insurance")}
            disabled={isLoading}
          >
            <Shield className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Insurance</div>
              <div className="text-xs opacity-70">Insurance claim</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};