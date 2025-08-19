import { useMemo, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StandardCard } from "@/components/ui/standard-card";
import { PosProductSearch, POSProduct } from "./sales/PosProductSearch";
import { PosCart, CartItem } from "./sales/PosCart";
import { PosPayment } from "./sales/PosPayment";
import { SalesTable } from "./sales/SalesTable";
import { useSales } from "./sales/hooks/useSales";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

export const Sales = () => {
  const { addSale, allSales, isLoading } = useSales();

  // Mock catalog (common pharmacy items)
  const CATALOG: POSProduct[] = [
    { id: "MED-001", name: "Paracetamol 500mg", price: 2.50, ndc: "98765-432-10", category: "Pain Relief", stock: 150 },
    { id: "MED-002", name: "Amoxicillin 250mg", price: 8.75, ndc: "12345-678-90", category: "Antibiotics", stock: 75 },
    { id: "MED-003", name: "Ibuprofen 400mg", price: 3.25, ndc: "11111-222-33", category: "Pain Relief", stock: 22 },
    { id: "MED-004", name: "Vitamin D3 1000IU", price: 12.00, ndc: "55555-666-77", category: "Vitamins", stock: 60 },
    { id: "MED-005", name: "Aspirin 75mg", price: 1.90, ndc: "22222-333-44", category: "Cardio", stock: 110 },
    { id: "MED-006", name: "Omeprazole 20mg", price: 9.50, ndc: "33333-444-55", category: "Digestive", stock: 85 },
    { id: "MED-007", name: "Cough Syrup 100ml", price: 8.75, ndc: "44444-555-66", category: "Cold & Flu", stock: 30 },
    { id: "MED-008", name: "Lisinopril 10mg", price: 7.25, ndc: "66666-777-88", category: "Cardio", stock: 40 },
    { id: "MED-009", name: "Metformin 500mg", price: 6.10, ndc: "77777-888-99", category: "Diabetes", stock: 55 },
    { id: "MED-010", name: "Amlodipine 5mg", price: 5.80, ndc: "88888-999-00", category: "Cardio", stock: 50 },
    { id: "MED-011", name: "Levothyroxine 50mcg", price: 10.20, ndc: "99999-000-11", category: "Endocrine", stock: 70 },
    { id: "MED-012", name: "Simvastatin 20mg", price: 9.90, ndc: "12121-343-65", category: "Cardio", stock: 45 },
  ];

  const quickPicks = useMemo(() => CATALOG.slice(0, 6), [CATALOG]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
  const tax = useMemo(() => Math.max(0, (subtotal - discount) * 0.08), [subtotal, discount]);
  const total = useMemo(() => Math.max(0, subtotal - discount + tax), [subtotal, discount, tax]);

  const addToCart = (product: POSProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, ndc: product.ndc, quantity: 1 }];
    });
  };

  const handleScan = (code: string) => {
    const prod = CATALOG.find(p => p.ndc.toLowerCase() === code.toLowerCase());
    if (!prod) {
      showError("NDC not found");
      return;
    }
    addToCart(prod);
  };

  const inc = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  const remove = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clear = () => setCart([]);

  const completeSale = async (opts: { customerName: string; paymentMethod: string; amountReceived?: number }) => {
    if (cart.length === 0) {
      showError("Cart is empty");
      return;
    }

    const items = cart.map(i => ({
      medicineId: i.id,
      medicineName: i.name,
      quantity: i.quantity,
      unitPrice: i.price,
      totalPrice: i.price * i.quantity,
      discount: 0,
    }));

    const ok = await addSale({
      customerName: opts.customerName || "Walk-in Customer",
      items,
      paymentMethod: opts.paymentMethod,
      discount,
      tax,
      notes: "POS checkout",
    });

    if (ok) {
      showSuccess("Sale completed");
      setCart([]);
      setDiscount(0);
    }
  };

  return (
    <PageContainer
      title="Point of Sale"
      subtitle="Fast checkout for pharmacy sales with scanning and quick picks"
      headerActions={
        <Button variant="outline" className="w-full sm:w-auto" disabled={cart.length === 0}>
          <Receipt className="h-4 w-4 mr-2" />
          Print Last Receipt
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Search, Quick Picks */}
        <div className="space-y-6">
          <PosProductSearch
            products={CATALOG}
            onAdd={addToCart}
            onScan={handleScan}
            quickPicks={quickPicks}
          />

          <StandardCard title="Tips">
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Press Enter in search to add the top result.</div>
              <div>• Scan NDC or paste barcode to add instantly.</div>
              <div>• Use the Quick Picks for common items.</div>
            </div>
          </StandardCard>
        </div>

        {/* Right: Cart + Payment */}
        <div className="space-y-6">
          <PosCart
            items={cart}
            totals={{ subtotal, discount, tax, total }}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            onClear={clear}
            onDiscountChange={setDiscount}
          />
          <PosPayment total={total} onComplete={completeSale} disabled={cart.length === 0} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent sales condensed */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            Recent Sales
            <Badge variant="secondary" className="ml-2">{allSales.slice(0, 5).length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <SalesTable
              sales={allSales.slice(0, 5)}
              onView={() => {}}
              onRefund={() => {}}
              onPrintReceipt={() => {}}
              isLoading={false}
            />
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};