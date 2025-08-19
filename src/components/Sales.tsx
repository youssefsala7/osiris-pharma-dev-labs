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
import { SafetyPanel, InteractionFinding } from "./sales/SafetyPanel";
import { useCurrency } from "@/hooks/use-currency";

type Unit = "pack" | "strip" | "tablet" | "bottle";

export const Sales = () => {
  const { addSale, allSales, isLoading } = useSales();
  const isMobile = useIsMobile();
  const { format } = useCurrency();

  // Enhanced catalog with pharmacy-specific metadata
  const CATALOG: (POSProduct & {
    dosageForm: "tablet" | "capsule" | "syrup" | "inhaler" | "ointment";
    basePackPrice: number;
    stripsPerPack?: number;
    tabletsPerStrip?: number;
    sellableUnits: Unit[];
    flags?: { withFood?: boolean; sedating?: boolean };
  })[] = [
    { id: "MED-001", name: "Paracetamol 500mg", price: 2.5, ndc: "98765-432-10", category: "Pain Relief", stock: 150, dosageForm: "tablet", basePackPrice: 25, stripsPerPack: 2, tabletsPerStrip: 10, sellableUnits: ["pack","strip","tablet"], flags: { withFood: false } },
    { id: "MED-002", name: "Amoxicillin 250mg", price: 8.75, ndc: "12345-678-90", category: "Antibiotics", stock: 75, dosageForm: "capsule", basePackPrice: 35, stripsPerPack: 1, tabletsPerStrip: 21, sellableUnits: ["pack","strip","tablet"], flags: { withFood: true } },
    { id: "MED-003", name: "Ibuprofen 400mg", price: 3.25, ndc: "11111-222-33", category: "Pain Relief", stock: 22, dosageForm: "tablet", basePackPrice: 32.5, stripsPerPack: 2, tabletsPerStrip: 10, sellableUnits: ["pack","strip","tablet"], flags: { withFood: true } },
    { id: "MED-004", name: "Vitamin D3 1000IU", price: 12, ndc: "55555-666-77", category: "Vitamins", stock: 60, dosageForm: "tablet", basePackPrice: 24, stripsPerPack: 2, tabletsPerStrip: 10, sellableUnits: ["pack","strip","tablet"] },
    { id: "MED-007", name: "Cough Syrup 100ml", price: 8.75, ndc: "44444-555-66", category: "Cold & Flu", stock: 30, dosageForm: "syrup", basePackPrice: 8.75, sellableUnits: ["bottle"], flags: { sedating: false } },
    { id: "MED-013", name: "Insulin Pen", price: 45.0, ndc: "13131-454-76", category: "Diabetes", stock: 25, dosageForm: "inhaler", basePackPrice: 45.0, sellableUnits: ["pack"] },
    { id: "MED-014", name: "Albuterol Inhaler", price: 32.5, ndc: "14141-565-87", category: "Respiratory", stock: 18, dosageForm: "inhaler", basePackPrice: 32.5, sellableUnits: ["pack"] },
    { id: "MED-015", name: "Prednisone 10mg", price: 4.8, ndc: "15151-676-98", category: "Steroids", stock: 90, dosageForm: "tablet", basePackPrice: 24, stripsPerPack: 2, tabletsPerStrip: 10, sellableUnits: ["pack","strip","tablet"], flags: { withFood: true } },
  ];

  // POS state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [holds, setHolds] = useState<HoldCart[]>([]);
  const [holdsOpen, setHoldsOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Safety/interactions
  const [findings, setFindings] = useState<InteractionFinding[]>([]);
  const [overridden, setOverridden] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const getPriceForUnit = (productId: string, unit: Unit): number => {
    const p = CATALOG.find(x => x.id === productId);
    if (!p) return 0;
    if (unit === "pack") return p.basePackPrice;
    if (unit === "strip") {
      const strips = p.stripsPerPack || 1;
      return p.basePackPrice / strips;
    }
    if (unit === "tablet") {
      const strips = p.stripsPerPack || 1;
      const tabsPerStrip = p.tabletsPerStrip || 10;
      return p.basePackPrice / (strips * tabsPerStrip);
    }
    // bottle or default fallbacks to base
    return p.basePackPrice;
  };

  // Totals
  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
  const tax = useMemo(() => Math.max(0, (subtotal - discount) * 0.08), [subtotal, discount]);
  const total = useMemo(() => Math.max(0, subtotal - discount + tax), [subtotal, discount, tax]);

  // Interaction rules (minimal demonstrator)
  const INTERACTIONS = [
    { a: "Warfarin", b: "Aspirin", severity: "Major", message: "Increased bleeding risk. Avoid or monitor closely." },
    { a: "Digoxin", b: "Amiodarone", severity: "Major", message: "Amiodarone increases digoxin levels. Monitor." },
    { a: "Metformin", b: "Contrast", severity: "Moderate", message: "Hold metformin with iodinated contrast." },
    { a: "Ibuprofen 400mg", b: "Prednisone 10mg", severity: "Moderate", message: "GI risk increases; take with food." },
  ] as Array<{ a: string; b: string; severity: "Major" | "Moderate"; message: string }>;

  const computeInteractions = (items: CartItem[]) => {
    const out: InteractionFinding[] = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const n1 = items[i].name;
        const n2 = items[j].name;
        const hit = INTERACTIONS.find(
          (r) => (r.a === n1 && r.b === n2) || (r.a === n2 && r.b === n1)
        );
        if (hit) {
          out.push({
            id: `${i}-${j}`,
            pair: `${n1} + ${n2}`,
            severity: hit.severity === "Major" ? "Major" : "Moderate",
            message: hit.message,
          });
        }
      }
    }
    return out;
  };

  useEffect(() => {
    const f = computeInteractions(cart);
    setFindings(f);
    if (f.length === 0) setOverridden(false);
  }, [cart]);

  // Cart operations
  const addToCart = (product: POSProduct) => {
    const meta = CATALOG.find(p => p.id === product.id);
    if (!meta) return;

    // default unit: pack (or bottle for liquids)
    const defaultUnit: Unit = meta.sellableUnits.includes("pack") ? "pack" : (meta.sellableUnits[0] as Unit);
    const unitPrice = getPriceForUnit(meta.id, defaultUnit);

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.unit === defaultUnit);
      if (existing) {
        return prev.map(i => i.id === product.id && i.unit === defaultUnit ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          id: meta.id,
          name: meta.name,
          price: unitPrice,
          ndc: meta.ndc,
          quantity: 1,
          unit: defaultUnit,
          sellableUnits: meta.sellableUnits,
          unitMeta: {
            dosageForm: meta.dosageForm,
            stripsPerPack: meta.stripsPerPack,
            tabletsPerStrip: meta.tabletsPerStrip,
          },
          flags: meta.flags,
        },
      ];
    });
    showSuccess(`Added ${product.name}`);
  };

  const inc = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const dec = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  const remove = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clear = () => {
    setCart([]);
    setDiscount(0);
    setOverridden(false);
  };

  const changeUnit = (id: string, unit: string) => {
    const meta = CATALOG.find(p => p.id === id);
    if (!meta) return;
    const u = unit as Unit;
    if (!meta.sellableUnits.includes(u)) return;
    const price = getPriceForUnit(id, u);
    setCart(prev => prev.map(i => i.id === id ? { ...i, unit: u, price } : i));
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
      note: `${cart.length} items - ${format(total)}`
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
    const hasCritical = findings.some(f => f.severity === "Major" || f.severity === "Contraindicated");
    if (hasCritical && !overridden) {
      return showError("Critical interaction requires override before completing sale.");
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
      notes: "Modern POS checkout",
    });

    if (ok) {
      const receiptData: ReceiptData = {
        id: `SALE-${Date.now()}`,
        date: new Date().toLocaleString(),
        customer: opts.customerName || "Walk-in Customer",
        paymentMethod: opts.paymentMethod,
        items: cart.map(i => ({ 
          name: `${i.name}${i.unit ? ` (${i.unit})` : ""}`, 
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

  const hasCritical = findings.some(f => f.severity === "Major" || f.severity === "Contraindicated");

  return (
    <PageContainer
      title="Pharmacy POS"
      subtitle="Modern point of sale system • Scan, add, pay"
      headerActions={headerActions}
    >
      {/* Safety Panel */}
      <div className="mb-4">
        <SafetyPanel
          findings={findings}
          onToggleCounseled={(id) => setFindings(prev => prev.map(f => f.id === id ? { ...f, counseled: !f.counseled } : f))}
          hasCritical={hasCritical}
          overridden={overridden}
          onOverride={() => setOverridden(true)}
        />
      </div>

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
            onUnitChange={changeUnit}
          />
          
          <ModernPosTender
            total={total}
            onComplete={completeSale}
            disabled={cart.length === 0 || (hasCritical && !overridden)}
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
                  <div className="font-bold">{format(sale.totalAmount)}</div>
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
              <div className="text-xl font-bold">{format(total)}</div>
            </div>
            <Button size="lg" disabled={cart.length === 0 || (hasCritical && !overridden)}>
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