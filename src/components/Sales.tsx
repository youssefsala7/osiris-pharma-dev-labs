import { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { PosProductSearch, POSProduct } from "./sales/PosProductSearch";
import { PosCart, CartItem } from "./sales/PosCart";
import { PosTender } from "./sales/PosTender";
import { SalesTable } from "./sales/SalesTable";
import { useSales } from "./sales/hooks/useSales";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Pause, Play, Trash2 } from "lucide-react";
import { HoldCartsDialog, HoldCart } from "./sales/HoldCartsDialog";
import { ReceiptPreview, ReceiptData } from "./sales/ReceiptPreview";
import { PosHeader } from "./sales/PosHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export const Sales = () => {
  const { addSale, allSales, isLoading } = useSales();
  const isMobile = useIsMobile();

  // Catalog (mock)
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
  ];
  const quickPicks = useMemo(() => CATALOG.slice(0, 8), [CATALOG]);

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

  // Cart ops
  const addToCart = (product: POSProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, ndc: product.ndc, quantity: 1 }];
    });
  };
  const handleScan = (code: string) => {
    const prod = CATALOG.find(p => p.ndc.toLowerCase() === code.toLowerCase());
    if (!prod) return showError("NDC not found");
    addToCart(prod);
  };
  const inc = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  const remove = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clear = () => setCart([]);

  // Hold carts
  const holdCart = () => {
    if (cart.length === 0) return showError("Nothing to hold");
    const id = String(holds.length + 1).padStart(3, "0");
    setHolds(prev => [{ id, createdAt: new Date().toISOString(), itemsCount: cart.length, total }, ...prev]);
    setCart([]);
    setDiscount(0);
    showSuccess(`Cart held (#${id})`);
  };
  const resumeHold = (id: string) => {
    setHolds(prev => prev.filter(h => h.id !== id));
    showSuccess(`Hold #${id} resumed (items would be restored in a full app)`);
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
      notes: "POS checkout",
    });

    if (ok) {
      const receiptData: ReceiptData = {
        id: (allSales[0]?.id as string) || undefined,
        date: new Date().toLocaleString(),
        customer: opts.customerName || "Walk-in Customer",
        paymentMethod: opts.paymentMethod,
        items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price, total: i.price * i.quantity })),
        subtotal,
        discount,
        tax,
        total,
      };
      setReceipt(receiptData);
      setReceiptOpen(true);
      setCart([]);
      setDiscount(0);
      showSuccess("Sale completed");
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
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        (document.activeElement as HTMLElement)?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={holdCart}>
        <Pause className="h-4 w-4 mr-2" /> Hold
      </Button>
      <Button variant="outline" onClick={() => setHoldsOpen(true)}>
        <Play className="h-4 w-4 mr-2" /> Resume
      </Button>
      <Button variant="outline" onClick={clear} className="text-red-600">
        <Trash2 className="h-4 w-4 mr-2" /> Clear
      </Button>
      <Button variant="outline" disabled={cart.length === 0} onClick={() => setReceiptOpen(true)}>
        <Receipt className="h-4 w-4 mr-2" /> Preview
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Point of Sale"
      subtitle="Thoughtful, responsive pharmacy checkout • scan, add, tender"
      headerActions={headerActions}
    >
      {/* POS Header */}
      <PosHeader
        onHold={holdCart}
        onResume={() => setHoldsOpen(true)}
        onClear={clear}
        cartCount={cart.length}
        total={total}
      />

      {/* Layout: desktop 12-cols: 4 / 5 / 3, mobile stacked */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Search / Scan */}
        <div className="lg:col-span-4 order-1">
          <PosProductSearch
            products={CATALOG}
            onAdd={addToCart}
            onScan={handleScan}
            quickPicks={quickPicks}
            searchRef={searchRef}
          />
        </div>

        {/* Cart */}
        <div className="lg:col-span-5 order-3 lg:order-2">
          <PosCart
            items={cart}
            totals={{ subtotal, discount, tax, total }}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            onClear={clear}
            onDiscountChange={setDiscount}
          />
        </div>

        {/* Tender */}
        <div className="lg:col-span-3 order-2 lg:order-3">
          <PosTender
            total={total}
            onComplete={completeSale}
            disabled={cart.length === 0}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Recent sales */}
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

      {/* Mobile sticky summary */}
      {!isMobile ? null : (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto max-w-screen-sm p-3 flex items-center gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-600">Total</div>
                <div className="text-lg font-semibold">${total.toFixed(2)}</div>
              </div>
              <Button
                className="ml-auto"
                onClick={() => {
                  // Scroll to tender panel on mobile
                  const tender = document.querySelector("#pos-tender-anchor");
                  if (tender) tender.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                disabled={cart.length === 0}
              >
                Pay Now
              </Button>
            </div>
          </div>
          <div className="h-16" />
        </>
      )}

      {/* Anchor for smooth scroll (mobile) */}
      <div id="pos-tender-anchor" className="mt-0" />

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