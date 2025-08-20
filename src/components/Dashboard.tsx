import { useMemo, useState } from "react";
import {
  Package,
  Users,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Download,
  Calendar,
  Search as SearchIcon,
  ListFilter,
  Eye,
  Building2,
  MapPin,
  RefreshCw,
  Filter,
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboard } from "./dashboard/hooks/useDashboard";
import { QuickSaleDialog } from "./dashboard/QuickSaleDialog";
import { PrescriptionDialog } from "./dashboard/PrescriptionDialog";
import { useCurrency } from "@/hooks/use-currency";
import { TrendSparkline } from "./dashboard/TrendSparkline";
import { useAppSettings } from "@/providers/AppSettingsProvider";

export const Dashboard = () => {
  const {
    stats,
    lowStockItems,
    recentSales,
    pendingOrders,
    expiringMedicines,
    drugInteractionAlerts,
    insuranceClaims,
    isLoading,
    processQuickSale,
    createPrescription,
  } = useDashboard();

  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);

  // Header controls
  const [dateRange, setDateRange] = useState("30d");
  const [search, setSearch] = useState("");

  // View-all modals
  const [openLowStock, setOpenLowStock] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [openClaims, setOpenClaims] = useState(false);

  // Quick filter toggles
  const [onlyCriticalStock, setOnlyCriticalStock] = useState(false);
  const [onlyMajorInteractions, setOnlyMajorInteractions] = useState(false);

  const { symbol, format } = useCurrency();
  const { settings } = useAppSettings();

  // Derived filters applied across sections
  const filteredLowStock = useMemo(() => {
    const base = lowStockItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return onlyCriticalStock ? base.filter(i => i.severity === "critical") : base;
  }, [lowStockItems, search, onlyCriticalStock]);

  const filteredRecentSales = useMemo(
    () => recentSales.filter(s =>
      s.id.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase())
    ),
    [recentSales, search]
  );

  const filteredPendingOrders = useMemo(
    () => pendingOrders.filter(p =>
      p.id.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase())
    ),
    [pendingOrders, search]
  );

  const filteredExpiring = useMemo(
    () => expiringMedicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
    [expiringMedicines, search]
  );

  const filteredInteractions = useMemo(() => {
    const base = drugInteractionAlerts.filter(a =>
      a.patient.toLowerCase().includes(search.toLowerCase()) || a.drugs.toLowerCase().includes(search.toLowerCase())
    );
    return onlyMajorInteractions ? base.filter(a => a.severity === "Major") : base;
  }, [drugInteractionAlerts, search, onlyMajorInteractions]);

  const filteredClaims = useMemo(
    () => insuranceClaims.filter(c =>
      c.id.toLowerCase().includes(search.toLowerCase()) || c.patient.toLowerCase().includes(search.toLowerCase())
    ),
    [insuranceClaims, search]
  );

  // Snapshot metrics
  const criticalLowStock = useMemo(() => lowStockItems.filter(i => i.severity === "critical").length, [lowStockItems]);
  const pendingOrderCount = useMemo(
    () => pendingOrders.filter(po => ["Sent", "Confirmed"].includes(po.status)).length,
    [pendingOrders]
  );
  const majorAlerts = useMemo(() => drugInteractionAlerts.filter(a => a.severity === "Major").length, [drugInteractionAlerts]);
  const claimsUnderReview = useMemo(
    () => insuranceClaims.filter(c => c.status === "Under Review").length,
    [insuranceClaims]
  );

  const exportSummary = () => {
    const rows = [
      ["Section", "Primary", "Secondary", "Tertiary"],
      ...filteredLowStock.map(i => ["Low Stock", i.name, String(i.stock), `Min ${i.minStock}`]),
      ...filteredPendingOrders.map(o => ["Order", o.id, o.supplier, o.status]),
      ...filteredRecentSales.map(s => ["Recent Sale", s.id, s.customer, s.amount]),
      ...filteredClaims.map(c => ["Claim", c.id, c.patient, c.status]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-summary.csv";
    a.click();
    showSuccess("Dashboard summary exported.");
  };

  // Simple sparkline demo data
  const todaySalesTrend = useMemo(() => [12, 18, 9, 22, 19, 28, 24, 31, 29, 34], []);
  const monthlyRevenueTrend = useMemo(() => [32, 36, 34, 38, 41, 40, 44, 47, 46, 52], []);

  const headerActions = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative max-w-xs w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search across dashboard..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="h-9 w-[160px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={exportSummary} className="h-9">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsQuickSaleOpen(true)} className="h-9">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Quick Sale
      </Button>
      <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(true)} className="h-9">
        <FileText className="h-4 w-4 mr-2" />
        New Prescription
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening at your pharmacy."
      headerActions={headerActions}
    >
      {/* Meta Bar */}
      <StandardCard variant="compact">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Pharmacy</div>
              <div className="font-semibold">
                {settings.pharmacyName || "Al Kindi Pharmacy"}
                <span className="text-sm text-gray-500 ml-2 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {settings.location || "Sharjah"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Last synced {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </StandardCard>

      {/* KPI Row with Sparklines */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={<Package className="h-8 w-8 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={<Users className="h-8 w-8 text-green-600" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Today's Sales"
          value={stats.todaysSales}
          icon={<ShoppingCart className="h-8 w-8 text-purple-600" />}
          prefix={`${symbol} `}
          trend={{ value: 15, isPositive: true }}
          extra={<TrendSparkline data={todaySalesTrend} color="#7C3AED" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.monthlyRevenue}
          icon={<DollarSign className="h-8 w-8 text-orange-600" />}
          prefix={`${symbol} `}
          trend={{ value: 23, isPositive: true }}
          extra={<TrendSparkline data={monthlyRevenueTrend} color="#EA580C" />}
        />
      </ResponsiveGrid>

      {/* Quick Filters */}
      <StandardCard variant="compact" title="Quick Filters" headerAction={<Filter className="h-4 w-4 text-gray-500" />}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={onlyCriticalStock ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyCriticalStock(v => !v)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical Low Stock
          </Button>
          <Button
            variant={onlyMajorInteractions ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyMajorInteractions(v => !v)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Major Interaction Alerts
          </Button>
        </div>
      </StandardCard>

      {/* Operational Snapshot */}
      <StandardCard title="Operational Snapshot" variant="compact">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 border rounded-lg bg-red-50/60 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-red-700">Critical Low Stock</div>
                <div className="text-xl font-bold text-red-800">{criticalLowStock}</div>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50/60 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-700">Pending Orders</div>
                <div className="text-xl font-bold text-blue-800">{pendingOrderCount}</div>
              </div>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-orange-50/60 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-orange-700">Major Alerts</div>
                <div className="text-xl font-bold text-orange-800">{majorAlerts}</div>
              </div>
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-indigo-50/60 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-indigo-700">Claims Under Review</div>
                <div className="text-xl font-bold text-indigo-800">{claimsUnderReview}</div>
              </div>
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </StandardCard>

      {/* Alerts & Activity (Left) + Orders & Claims (Right) */}
      <ResponsiveGrid cols={3}>
        <StandardCard
          title="Low Stock Alert"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{filteredLowStock.length}</Badge>
              <Button size="sm" variant="outline" onClick={() => setOpenLowStock(true)}>
                <Eye className="h-4 w-4 mr-1" /> View all
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            {filteredLowStock.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Min stock: {item.minStock}</p>
                </div>
                <Badge variant="destructive" className="animate-pulse">
                  {item.stock} left
                </Badge>
              </div>
            ))}
            {filteredLowStock.length === 0 && (
              <div className="text-sm text-gray-500">No matches for current filters.</div>
            )}
          </div>
        </StandardCard>

        <StandardCard
          title="Drug Interaction Alerts"
          headerAction={<Badge variant="secondary">{filteredInteractions.length}</Badge>}
        >
          <div className="space-y-3">
            {filteredInteractions.slice(0, 4).map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p className="font-medium text-sm">{alert.patient}</p>
                  <p className="text-xs text-gray-600">{alert.drugs}</p>
                </div>
                <Badge variant="destructive">{alert.severity}</Badge>
              </div>
            ))}
            {filteredInteractions.length === 0 && (
              <div className="text-sm text-gray-500">No alerts found for current filters.</div>
            )}
          </div>
        </StandardCard>

        <StandardCard
          title="Recent Sales"
          headerAction={<Badge variant="default">{filteredRecentSales.length}</Badge>}
        >
          <div className="space-y-3">
            {filteredRecentSales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-medium text-sm">{sale.id}</p>
                  <p className="text-xs text-gray-600">{sale.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{sale.amount}</p>
                  <p className="text-xs text-gray-500">{sale.time}</p>
                </div>
              </div>
            ))}
            {filteredRecentSales.length === 0 && (
              <div className="text-sm text-gray-500">No recent sales match your search.</div>
            )}
          </div>
        </StandardCard>
      </ResponsiveGrid>

      <ResponsiveGrid cols={3}>
        <StandardCard
          title="Pending Purchase Orders"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{filteredPendingOrders.length}</Badge>
              <Button size="sm" variant="outline" onClick={() => setOpenOrders(true)}>
                <Eye className="h-4 w-4 mr-1" /> View all
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            {filteredPendingOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-gray-600">{order.supplier}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{order.status}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{order.amount}</p>
                </div>
              </div>
            ))}
            {filteredPendingOrders.length === 0 && (
              <div className="text-sm text-gray-500">No orders found.</div>
            )}
          </div>
        </StandardCard>

        <StandardCard
          title="Insurance Claims"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{filteredClaims.length}</Badge>
              <Button size="sm" variant="outline" onClick={() => setOpenClaims(true)}>
                <Eye className="h-4 w-4 mr-1" /> View all
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            {filteredClaims.slice(0, 4).map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <div>
                  <p className="font-medium text-sm">{claim.id}</p>
                  <p className="text-xs text-gray-600">{claim.patient}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      claim.status === "Approved"
                        ? "default"
                        : claim.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {claim.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{claim.amount}</p>
                </div>
              </div>
            ))}
            {filteredClaims.length === 0 && (
              <div className="text-sm text-gray-500">No matching claims.</div>
            )}
          </div>
        </StandardCard>

        <StandardCard
          title="Expiring Soon"
          headerAction={<Badge variant="secondary">{filteredExpiring.length}</Badge>}
        >
          <div className="space-y-3">
            {filteredExpiring.slice(0, 4).map((medicine, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div>
                  <p className="font-medium text-sm">{medicine.name}</p>
                  <p className="text-xs text-gray-600">Expires: {medicine.expiryDate}</p>
                </div>
                <Badge variant="secondary">{medicine.daysLeft} days</Badge>
              </div>
            ))}
            {filteredExpiring.length === 0 && (
              <div className="text-sm text-gray-500">No medicines expiring soon match your search.</div>
            )}
          </div>
        </StandardCard>
      </ResponsiveGrid>

      {/* Dialog: Low Stock Full List */}
      <Dialog open={openLowStock} onOpenChange={setOpenLowStock}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Low Stock Items</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead className="w-24 text-right">Stock</TableHead>
                  <TableHead className="w-24 text-right">Min</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLowStock.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-right">{i.stock}</TableCell>
                    <TableCell className="text-right">{i.minStock}</TableCell>
                  </TableRow>
                ))}
                {filteredLowStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-gray-500">
                      No items match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Pending Orders Full List */}
      <Dialog open={openOrders} onOpenChange={setOpenOrders}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pending Purchase Orders</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-28 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingOrders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.supplier}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{o.amount}</TableCell>
                  </TableRow>
                ))}
                {filteredPendingOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                      No orders match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Insurance Claims Full List */}
      <Dialog open={openClaims} onOpenChange={setOpenClaims}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Insurance Claims</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-28 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.patient}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "Approved"
                            ? "default"
                            : c.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{c.amount}</TableCell>
                  </TableRow>
                ))}
                {filteredClaims.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                      No claims match the current search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <QuickSaleDialog
        open={isQuickSaleOpen}
        onOpenChange={setIsQuickSaleOpen}
        onSubmit={processQuickSale}
        isLoading={isLoading}
      />
      <PrescriptionDialog
        open={isNewPrescriptionOpen}
        onOpenChange={setIsNewPrescriptionOpen}
        onSubmit={createPrescription}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};