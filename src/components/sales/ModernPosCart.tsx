import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2, ShoppingCart, Utensils, Moon } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  ndc?: string;
  quantity: number;
  unit?: string; // e.g., pack | strip | tablet | bottle
  sellableUnits?: string[];
  unitMeta?: {
    dosageForm?: string;
    stripsPerPack?: number;
    tabletsPerStrip?: number;
  };
  flags?: {
    withFood?: boolean;
    sedating?: boolean;
  };
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
  onUnitChange: (id: string, unit: string) => void;
}

export const ModernPosCart = ({
  items,
  totals,
  onInc,
  onDec,
  onRemove,
  onClear,
  onDiscountChange,
  onUnitChange,
}: ModernPosCartProps) => {
  const [discountInput, setDiscountInput] = useState<string>("");
  const { format } = useCurrency();

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
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      {item.ndc && <span className="text-xs text-gray-500">NDC: {item.ndc}</span>}
                      {item.flags?.withFood && (
                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                          <Utensils className="h-3 w-3" /> With food
                        </Badge>
                      )}
                      {item.flags?.sedating && (
                        <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                          <Moon className="h-3 w-3" /> Sedating
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <div className="text-sm font-semibold">{format(item.price)}</div>

                      {item.sellableUnits && item.sellableUnits.length > 1 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Unit</span>
                          <Select value={item.unit} onValueChange={(u) => onUnitChange(item.id, u)}>
                            <SelectTrigger className="h-8 w-[120px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.sellableUnits.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u.charAt(0).toUpperCase() + u.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">{item.unit || "unit"}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
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
                      <div className="font-bold">{format(item.price * item.quantity)}</div>
                      <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-red-500 p-1">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
            onChange={(e) => setDiscountInput(e.target.value)}
            onBlur={() => {
              const amount = parseFloat(discountInput) || 0;
              onDiscountChange(amount);
              setDiscountInput(amount ? amount.toFixed(2) : "");
            }}
            className="w-28"
          />
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{format(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-{format(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>{format(totals.tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span>{format(totals.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};