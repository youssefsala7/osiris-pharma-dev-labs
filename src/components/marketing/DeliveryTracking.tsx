import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardCard } from "@/components/ui/standard-card";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { FadeIn } from "@/components/ui/fade-in";
import { Truck, RefreshCcw, MapPin } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import type { DeliveryOrder, DeliveryStatus } from "./types";

const STATUS_STEPS: DeliveryStatus[] = [
  "Label Created",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const statusProgress = (status: DeliveryStatus) => {
  const idx = STATUS_STEPS.indexOf(status);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / STATUS_STEPS.length) * 100);
};

export const DeliveryTracking = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DeliveryStatus>("all");
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: "DLV-001",
      customer: "John Doe",
      carrier: "Aramex",
      trackingNumber: "ARMX123456",
      status: "In Transit",
      lastUpdate: "2024-01-15 10:45",
      steps: [
        { time: "2024-01-14 08:15", location: "Sharjah Hub", status: "Label Created" },
        { time: "2024-01-14 18:20", location: "Sharjah Hub", status: "In Transit" },
      ],
      notifyVia: ["Email", "WhatsApp"],
    },
    {
      id: "DLV-002",
      customer: "Jane Smith",
      carrier: "DHL",
      trackingNumber: "DHL987654",
      status: "Out for Delivery",
      lastUpdate: "2024-01-15 11:20",
      steps: [
        { time: "2024-01-13 09:00", location: "Dubai Hub", status: "Label Created" },
        { time: "2024-01-14 16:10", location: "Dubai Hub", status: "In Transit" },
        { time: "2024-01-15 07:30", location: "Dubai", status: "Out for Delivery" },
      ],
      notifyVia: ["Email"],
    },
    {
      id: "DLV-003",
      customer: "Mike Johnson",
      carrier: "Emirates Post",
      trackingNumber: "EMP112233",
      status: "Delivered",
      lastUpdate: "2024-01-14 17:00",
      steps: [
        { time: "2024-01-13 10:10", location: "Ajman Hub", status: "Label Created" },
        { time: "2024-01-13 21:10", location: "Ajman Hub", status: "In Transit" },
        { time: "2024-01-14 12:45", location: "Ajman", status: "Out for Delivery" },
        { time: "2024-01-14 17:00", location: "Ajman", status: "Delivered" },
      ],
      notifyVia: ["Email", "SMS"],
    },
  ]);

  // Simulate periodic status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status === "Delivered") return o;
          const nextIdx = STATUS_STEPS.indexOf(o.status) + 1;
          const next = STATUS_STEPS[nextIdx] || o.status;
          const changed = next !== o.status;
          return changed
            ? {
                ...o,
                status: next,
                lastUpdate: new Date().toLocaleString(),
                steps: [
                  ...o.steps,
                  {
                    time: new Date().toLocaleString(),
                    location: "On Route",
                    status: next,
                  },
                ],
              }
            : o;
        })
      );
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.carrier.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const outForDelivery = orders.filter((o) => o.status === "Out for Delivery").length;
    const inTransit = orders.filter((o) => o.status === "In Transit").length;
    return { total, delivered, outForDelivery, inTransit };
  }, [orders]);

  const refreshNow = () => {
    setOrders((prev) => [...prev]); // trigger render
    showSuccess("Delivery statuses refreshed");
  };

  return (
    <PageContainer
      title="Delivery Tracking"
      subtitle="Monitor order shipments and notify customers automatically"
      headerActions={
        <Button variant="outline" onClick={refreshNow}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      }
    >
      <ResponsiveGrid cols={4}>
        <StatCard title="Total Shipments" value={stats.total} icon={<Truck className="h-8 w-8 text-blue-600" />} />
        <StatCard title="Delivered" value={stats.delivered} icon={<Truck className="h-8 w-8 text-green-600" />} />
        <StatCard title="Out for Delivery" value={stats.outForDelivery} icon={<Truck className="h-8 w-8 text-orange-600" />} />
        <StatCard title="In Transit" value={stats.inTransit} icon={<Truck className="h-8 w-8 text-purple-600" />} />
      </ResponsiveGrid>

      <StandardCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Input
              placeholder="Search shipment by ID, customer, tracking, or carrier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Label Created">Label Created</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Exception">Exception</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </StandardCard>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((o) => (
            <Card key={o.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{o.id}</span>
                    <span className="ml-2 text-sm text-gray-600">{o.customer}</span>
                  </div>
                  <Badge variant="outline">{o.carrier}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <div>Tracking: <span className="font-mono">{o.trackingNumber}</span></div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">{o.steps[o.steps.length - 1]?.location || "—"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{o.status}</span>
                    <span className="text-xs text-gray-600">{o.lastUpdate}</span>
                  </div>
                  <ProgressBar value={statusProgress(o.status)} max={100} />
                </div>
                <div className="text-xs text-gray-600">
                  {o.steps.slice(-3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{s.status}</span>
                      <span className="text-right">{s.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>
    </PageContainer>
  );
};

export default DeliveryTracking;