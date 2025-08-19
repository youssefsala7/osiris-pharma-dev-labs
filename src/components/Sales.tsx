import { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { ModernPosSearch, POSProduct } from "./sales/ModernPosSearch";
import { ModernPosCart, CartItem } from "./sales/ModernPosCart";
import { ModernPosTender } from "./sales/ModernPosTender";
import { useSales } from "./sales/hooks/useSales";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Pause, Play, Trash2, Clock } from "lucide-react";
import { HoldCartsDialog, HoldCart } from "./sales/HoldCartsDialog";
import { ReceiptPreview, ReceiptData } from "./sales/ReceiptPreview";
import { useIsMobile } from "@/hooks/use-mobile";

export const Sales = () => {
  const { addSale, allSales, isLoading } = useSales();
  const isMobile = useIsMobile();

  // Enhanced catalog with more realistic pharmacy data
  const CATALOG: POSProduct[] = [
    { id: "MED-001", name: "Paracetamol 500mg", price: 2.5, ndc: "98765-432-10", category: "Pain Relief", stock: 150 },
    { id: "MED-002", name: "Amoxicillin 250mg", price: 8.75, ndc: "12345-678-90", category: "Antibiotics", stock: 75 },
    { id: "MED-003", name: "Ibuprofen 400mg", price: 3.25, ndc: "11111-222-33", category: "Pain Relief", stock: 22 },
    { id: "MED-004", name: "Vitamin D3 1000IU", price: 12, ndc: "55555-666-77", category: "Vitamins", stock: 60 },
    { id: "MED-005", name: "Aspirin 75mg", price: 1.9, ndc: "22222-333-44", category: "Cardio", stock: 110 },
    { id: "MED-006", name: "Omeprazole 20mg", price: 9.5, ndc: "33333-444-55", category: "Digestive", stock: 85 },
    { id: "MED-007", name: "Cough Syrup 100ml", price: 8.75, ndc: "44444-555-66", category: "Cold & Flu", stock: 30 },
    { id: "MED-008", name: "Lisinopril 10mg", price: 7.25, ndc: "66666-777-88", category: "Cardio", stock: 40 },
    { id: "MED-009", name: "Metformin 500mg", price: 6.1, ndc: "77777-888-99", category: "Diabetes", stock: 55 },
    { id: "MED-010", name: "Amlodipine 5mg", price: 5.8, ndc: "88888-999-00", category: "Cardio", stock: 50 },
    { id: "MED-011", name: "Levothyroxine 50mcg", price: 10.2, ndc: "99999-000-11", category: "Endocrine", stock: 70 },
    { id: "MED-012", name: "Simvastatin 20mg", price: 9.9, ndc: "12121-343-65", category: "Cardio", stock: 45 },
    { id: "MED-013", name: "Insulin Pen", price: 45.0, ndc: "13131-454-76", category: "Diabetes", stock: 25 },
    { id: "MED-014", name: "Albuterol Inhaler", price: 32.5, ndc: "14141-565-87", category: "Respiratory", stock: 18 },
    { id: "MED-015", name: "Prednisone 10mg", price: 4.8, ndc: "15151-676-98", category: "Steroids", stock: 90 },
  ];

  // POS state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [holds, setHolds] = useState<HoldCart[]>([]);
  const [holdsOpen, setHoldsOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // Totals
  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
  const tax = useMemo(() => Math.max(0, (subtotal - discount) * 0.08), [subtotal, discount]);
  const total = useMemo(() => Math.max(0, subtotal - discount + tax), [subtotal, discount, tax]);

  // Cart operations
  const addToCart = (product: POSProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        ndc: product.ndc, 
        quantity: 1 
      }];
    });
    showSuccess(`Added ${product.name}`);
  };

  const inc = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  const remove = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clear = () => {
    setCart([]);
    setDiscount(0);
  };

  // Hold operations
  const holdCart = () => {
    if (cart.length === 0) return showError("Nothing to hold");
    const id = String(holds.length + 1).padStart(3, "0");
    setHolds(prev => [{ 
      id, 
      createdAt: new Date().toISOString(), 
      itemsCount: cart.length, 
      total,
      note: `${cart.length} items - $${total.toFixed(2)}`
    }, ...prev]);
    clear();
    showSuccess(`Cart held (#${id})`);
  };

  const resumeHold = (id: string) => {
    setHolds(prev => prev.filter(h => h.id !== id));
    showSuccess(`Hold #${id} resumed`);
  };

  const deleteHold = (id: string) => {
    setHolds(prev => prev.filter(h => h.id !== id));
    showSuccess(`Hold #${id} deleted`);
  };

  // Complete sale
  const completeSale = async (opts: { customerName: string; paymentMethod: string; amountReceived?: number }) => {
    if (cart.length === 0) return showError("Cart is empty");

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
      notes: "Modern POS checkout",
    });

    if (ok) {
      const receiptData: ReceiptData = {
        id: `SALE-${Date.now()}`,
        date: new Date().toLocaleString(),
        customer: opts.customerName || "Walk-in Customer",
        paymentMethod: opts.paymentMethod,
        items: cart.map(i => ({ 
          name: i.name, 
          qty: i.quantity, 
          price: i.price, 
          total: i.price * i.quantity 
        })),
        subtotal,
        discount,
        tax,
        total,
      };
      setReceipt(receiptData);
      setReceiptOpen(true);
      clear();
      showSuccess("Sale completed successfully!");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={holdCart} disabled={cart.length === 0}>
        <Pause className="h-4 w-4 mr-2" />
        Hold
      </Button>
      <Button variant="outline" onClick={() => setHoldsOpen(true)}>
        <Play className="h-4 w-4 mr-2" />
        Resume
      </Button>
      <Button variant="outline" onClick={clear} disabled={cart.length === 0}>
        <Trash2 className="h-4 w-4 mr-2" />
        Clear
      </Button>
      <Button variant="outline" onClick={() => setReceiptOpen(true)} disabled={cart.length === 0}>
        <Receipt className="h-4 w-4 mr-2" />
        Preview
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Pharmacy POS"
      subtitle="Modern point of sale system • Scan, add, pay"
      headerActions={headerActions}
    >
      {/* Main POS Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Products */}
        <div className="lg:col-span-2 order-1">
          <ModernPosSearch
            products={CATALOG}
            onAdd={addToCart}
            searchRef={searchRef}
          />
        </div>

        {/* Cart & Payment */}
        <div className="order-2 space-y-6">
          <ModernPosCart
            items={cart}
            totals={{ subtotal, discount, tax, total }}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            onClear={clear}
            onDiscountChange={setDiscount}
          />
          
          <ModernPosTender
            total={total}
            onComplete={completeSale}
            disabled={cart.length === 0}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Recent Sales */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Sales
            <Badge variant="secondary" className="ml-2">
              {allSales.slice(0, 5).length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allSales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{sale.id}</div>
                  <div className="text-sm text-gray-600">{sale.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${sale.totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">{sale.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile sticky total */}
      {isMobile && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">{cart.length} items</div>
              <div className="text-xl font-bold">${total.toFixed(2)}</div>
            </div>
            <Button size="lg" disabled={cart.length === 0}>
              Pay Now
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <HoldCartsDialog
        open={holdsOpen}
        onOpenChange={setHoldsOpen}
        holds={holds}
        onResume={resumeHold}
        onDelete={deleteHold}
      />

      <ReceiptPreview 
        open={receiptOpen} 
        onOpenChange={setReceiptOpen} 
        receipt={receipt} 
      />
    </PageContainer>
  );
};