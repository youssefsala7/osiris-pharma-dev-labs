import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface PosCartProps {
  items: CartItem[];
  totals: Totals;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onDiscountChange: (amount: number) => void;
}

export const PosCart = ({
  items,
  totals,
  onInc,
  onDec,
  onRemove,
  onClear,
  onDiscountChange,
}: PosCartProps) => {
  const [discountInput, setDiscountInput] = useState<string>(totals.discount ? totals.discount.toString() : "");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({items.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Tax 8%</Badge>
          <Button variant="outline" size="sm" onClick={onClear} disabled={items.length === 0}>
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-24 text-right">Price</TableHead>
                <TableHead className="w-36 text-center">Qty</TableHead>
                <TableHead className="w-24 text-right">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium">{it.name}</div>
                    {it.ndc && <div className="text-xs text-gray-500">NDC: {it.ndc}</div>}
                  </TableCell>
                  <TableCell className="text-right">${it.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => onDec(it.id)} disabled={it.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-8 text-center font-medium">{it.quantity}</div>
                      <Button variant="outline" size="icon" onClick={() => onInc(it.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${(it.price * it.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" className="text-red-600" onClick={() => onRemove(it.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                    Cart is empty. Search or scan to add items.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs mb-1">Discount ($)</div>
            <Input
              placeholder="0.00"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              onBlur={() => {
                const val = Number(discountInput) || 0;
                setDiscountInput(val ? val.toFixed(2) : "");
                onDiscountChange(val);
              }}
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Subtotal: ${totals.subtotal.toFixed(2)}</div>
            {totals.discount > 0 && (
              <div className="text-sm text-green-600">Discount: -${totals.discount.toFixed(2)}</div>
            )}
            <div className="text-sm text-gray-600">Tax: ${totals.tax.toFixed(2)}</div>
            <div className="text-lg font-bold mt-1">Total: ${totals.total.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};