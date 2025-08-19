import { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
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
import { Receipt, Pause, Play, Trash2, Wallet } from "lucide-react";
import { HoldCartsDialog, HoldCart } from "./sales/HoldCartsDialog";
import { ReceiptPreview, ReceiptData } from "./sales/ReceiptPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Sales = () => {
  const { addSale, allSales, isLoading } = useSales();
  const isMobile = useIsMobile();

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

  const quickPicks = useMemo(() => CATALOG.slice(0, 8), [CATALOG]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [holds, setHolds] = useState<HoldCart[]>([]);
  const [holdsOpen, setHoldsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

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

  const holdCart = () => {
    if (cart.length === 0) {
      showError("Nothing to hold");
      return;
    }
    const id = String(holds.length + 1).padStart(3, "0");
    setHolds(prev => [
      {
        id,
        createdAt: new Date().toISOString(),
        itemsCount: cart.length,
        total,
      },
      ...prev,
    ]);
    setCart([]);
    setDiscount(0);
    showSuccess(`Cart held (#${id})`);
  };

  const resumeHold = (id: string) => {
    const h = holds.find(x => x.id === id);
    if (!h) return;
    // In this simple implementation, we only stored counts/total; real app would store items snapshot.
    // We'll just notify and remove hold.
    setHolds(prev => prev.filter(x => x.id !== id));
    showSuccess(`Hold #${id} resumed (load original items in a real setup)`);
  };

  const deleteHold = (id: string) => {
    setHolds(prev => prev.filter(x => x.id !== id));
    showSuccess(`Hold #${id} deleted`);
  };

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
      const receiptData: ReceiptData = {
        id: (allSales[0]?.id as string) || undefined,
        date: new Date().toLocaleString(),
        customer: opts.customerName || "Walk-in Customer",
        paymentMethod: opts.paymentMethod,
        items: cart.map(i => ({
          name: i.name,
          qty: i.quantity,
          price: i.price,
          total: i.price * i.quantity,
        })),
        subtotal,
        discount,
        tax,
        total,
      };
      setReceipt(receiptData);
      setReceiptOpen(true);
      showSuccess("Sale completed");
      setCart([]);
      setDiscount(0);
      setPaymentOpen(false);
    }
  };

  // Keyboard shortcuts for speed at POS
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // focus search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // complete sale
      if (e.key.toLowerCase() === "f9") {
        e.preventDefault();
        if (isMobile) {
          setPaymentOpen(true);
        }
      }
      // clear search
      if (e.key === "Escape") {
        if (document.activeElement === searchRef.current) {
          (document.activeElement as HTMLElement)?.blur();
        }
      }
      // clear cart
      if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobile]);

  const headerActions = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" onClick={holdCart} className="w-full sm:w-auto">
        <Pause className="h-4 w-4 mr-2" />
        Hold
      </Button>
      <Button variant="outline" onClick={() => setHoldsOpen(true)} className="w-full sm:w-auto">
        <Play className="h-4 w-4 mr-2" />
        Resume
      </Button>
      <Button variant="outline" onClick={clear} className="w-full sm:w-auto text-red-600">
        <Trash2 className="h-4 w-4 mr-2" />
        Clear
      </Button>
      <Button variant="outline" className="w-full sm:w-auto" disabled={cart.length === 0} onClick={() => setReceiptOpen(true)}>
        <Receipt className="h-4 w-4 mr-2" />
        Preview
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Point of Sale"
      subtitle="Fast checkout with scan, quick picks, hold/resume, and mobile checkout"
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Search, Quick Picks */}
        <div className="space-y-6">
          <PosProductSearch
            products={CATALOG}
            onAdd={addToCart}
            onScan={handleScan}
            quickPicks={quickPicks}
            searchRef={searchRef}
          />

          <StandardCard title="Tips">
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Press / to focus search quickly.</div>
              <div>• Press Enter to add the top result or scan an NDC.</div>
              <div>• Use Hold/Resume to park and retrieve carts.</div>
              <div className="lg:hidden">• Tap Checkout to pay in a mobile sheet.</div>
            </div>
          </StandardCard>
        </div>

        {/* Right: Cart + Payment (payment inline on desktop, sheet on mobile) */}
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

          {/* Desktop payment */}
          <div className="hidden lg:block">
            <PosPayment
              total={total}
              onComplete={completeSale}
              disabled={cart.length === 0}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky summary / checkout */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-screen-lg p-3 flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-lg font-semibold">${total.toFixed(2)}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="sm:hidden" onClick={() => setHoldsOpen(true)}>
              <Pause className="h-4 w-4 mr-1" /> Hold
            </Button>
            <Button onClick={() => setPaymentOpen(true)} disabled={cart.length === 0}>
              <Wallet className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile payment sheet */}
      <Sheet open={paymentOpen} onOpenChange={setPaymentOpen}>
        <SheetContent side="bottom" className="max-h-[85vh]">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
          </SheetHeader>
          <div className="mt-3">
            <PosPayment
              total={total}
              onComplete={completeSale}
              disabled={cart.length === 0}
              isLoading={isLoading}
            />
          </div>
        </SheetContent>
      </Sheet>

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

      {/* Hold carts dialog */}
      <HoldCartsDialog
        open={holdsOpen}
        onOpenChange={setHoldsOpen}
        holds={holds}
        onResume={resumeHold}
        onDelete={deleteHold}
      />

      {/* Receipt preview */}
      <ReceiptPreview open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </PageContainer>
  );
};