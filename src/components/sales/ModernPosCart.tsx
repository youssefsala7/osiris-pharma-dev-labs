import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  ndc?: string;
  quantity: number;
};

interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

interface ModernPosCartProps {
  items: CartItem[];
  totals: Totals;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onDiscountChange: (amount: number) => void;
}

export const ModernPosCart = ({
  items,
  totals,
  onInc,
  onDec,
  onRemove,
  onClear,
  onDiscountChange,
}: ModernPosCartProps) => {
  const [discountInput, setDiscountInput] = useState<string>("");

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    const amount = parseFloat(value) || 0;
    onDiscountChange(amount);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Cart is empty</h3>
          <p className="text-sm text-gray-400">Scan or search to add items</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({items.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onDec(item.id)} disabled={item.quantity <= 1}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => onInc(item.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-red-500 p-1">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discount */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Discount:</label>
          <Input
            type="number"
            placeholder="0.00"
            value={discountInput}
            onChange={(e) => handleDiscountChange(e.target.value)}
            className="w-24"
          />
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-${totals.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};