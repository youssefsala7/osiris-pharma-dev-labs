import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Calendar, DollarSign, Package } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: "Draft" | "Sent" | "Confirmed" | "Delivered" | "Cancelled";
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdBy: string;
}

interface PurchaseOrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "PO-001",
      supplierId: "SUP-001",
      supplierName: "PharmaCorp Ltd",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-22",
      status: "Confirmed",
      items: [
        {
          medicineId: "MED-001",
          medicineName: "Paracetamol 500mg",
          quantity: 500,
          unitPrice: 2.00,
          totalPrice: 1000.00
        },
        {
          medicineId: "MED-003",
          medicineName: "Ibuprofen 400mg",
          quantity: 300,
          unitPrice: 2.75,
          totalPrice: 825.00
        }
      ],
      subtotal: 1825.00,
      tax: 146.00,
      total: 1971.00,
      notes: "Urgent order for pain relief medications",
      createdBy: "Admin User"
    },
    {
      id: "PO-002",
      supplierId: "SUP-002",
      supplierName: "MediSupply Inc",
      orderDate: "2024-01-14",
      expectedDelivery: "2024-01-21",
      status: "Sent",
      items: [
        {
          medicineId: "MED-002",
          medicineName: "Amoxicillin 250mg",
          quantity: 200,
          unitPrice: 7.50,
          totalPrice: 1500.00
        }
      ],
      subtotal: 1500.00,
      tax: 120.00,
      total: 1620.00,
      notes: "Regular monthly antibiotic order",
      createdBy: "Admin User"
    },
    {
      id: "PO-003",
      supplierId: "SUP-003",
      supplierName: "VitaHealth Distributors",
      orderDate: "2024-01-13",
      expectedDelivery: "2024-01-20",
      status: "Delivered",
      items: [
        {
          medicineId: "MED-004",
          medicineName: "Vitamin D3 1000IU",
          quantity: 100,
          unitPrice: 12.00,
          totalPrice: 1200.00
        }
      ],
      subtotal: 1200.00,
      tax: 96.00,
      total: 1296.00,
      notes: "Vitamin supplement restock",
      createdBy: "Admin User"
    },
  ]);

  const [newPurchaseOrder, setNewPurchaseOrder] = useState<Partial<PurchaseOrder>>({
    items: [],
    status: "Draft"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPurchaseOrders = purchaseOrders.filter(po =>
    po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPurchaseOrder = () => {
    if (newPurchaseOrder.supplierName && newPurchaseOrder.expectedDelivery) {
      const purchaseOrder: PurchaseOrder = {
        id: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        supplierId: `SUP-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        supplierName: newPurchaseOrder.supplierName,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: newPurchaseOrder.expectedDelivery,
        status: "Draft",
        items: newPurchaseOrder.items || [],
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: newPurchaseOrder.notes || "",
        createdBy: "Admin User",
      };
      
      setPurchaseOrders([...purchaseOrders, purchaseOrder]);
      setNewPurchaseOrder({ items: [], status: "Draft" });
      setIsAddDialogOpen(false);
      showSuccess("Purchase order created successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "secondary";
      case "Sent": return "outline";
      case "Confirmed": return "default";
      case "Delivered": return "default";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const totalPendingOrders = purchaseOrders.filter(po => po.status === "Sent" || po.status === "Confirmed").length;
  const totalOrderValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage your purchase orders and supplier procurement</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplierName">Supplier</Label>
                <Select onValueChange={(value) => setNewPurchaseOrder({...newPurchaseOrder, supplierName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PharmaCorp Ltd">PharmaCorp Ltd</SelectItem>
                    <SelectItem value="MediSupply Inc">MediSupply Inc</SelectItem>
                    <SelectItem value="VitaHealth Distributors">VitaHealth Distributors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={newPurchaseOrder.expectedDelivery || ""}
                  onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, expectedDelivery: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newPurchaseOrder.notes || ""}
                  onChange={(e) => setNewPurchaseOrder({...newPurchaseOrder, notes: e.target.value})}
                  placeholder="Enter any special instructions"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                Note: Items can be added after creating the purchase order.
              </div>
              
              <Button onClick={handleAddPurchaseOrder} className="w-full">
                Create Purchase Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalPendingOrders}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalOrderValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchaseOrders.filter(po => po.status === "Delivered").length}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search purchase orders by ID or supplier name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Purchase Orders ({filteredPurchaseOrders.length} orders)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.supplierName}</p>
                      <p className="text-sm text-gray-600">{order.supplierId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.expectedDelivery}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{item.medicineName}</span>
                          <span className="text-gray-600"> x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-600">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};