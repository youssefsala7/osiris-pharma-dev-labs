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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ShoppingCart, DollarSign, Receipt, Calendar } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: "Completed" | "Pending" | "Refunded";
}

interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "INV-001",
      customerId: "CUST-001",
      customerName: "John Doe",
      items: [
        {
          medicineId: "MED-001",
          medicineName: "Paracetamol 500mg",
          quantity: 2,
          unitPrice: 2.50,
          totalPrice: 5.00
        },
        {
          medicineId: "MED-003",
          medicineName: "Ibuprofen 400mg",
          quantity: 1,
          unitPrice: 3.25,
          totalPrice: 3.25
        }
      ],
      totalAmount: 8.25,
      paymentMethod: "Cash",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: "INV-002",
      customerId: "CUST-002",
      customerName: "Jane Smith",
      items: [
        {
          medicineId: "MED-002",
          medicineName: "Amoxicillin 250mg",
          quantity: 1,
          unitPrice: 8.75,
          totalPrice: 8.75
        }
      ],
      totalAmount: 8.75,
      paymentMethod: "Card",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: "INV-003",
      customerId: "CUST-003",
      customerName: "Mike Johnson",
      items: [
        {
          medicineId: "MED-001",
          medicineName: "Paracetamol 500mg",
          quantity: 3,
          unitPrice: 2.50,
          totalPrice: 7.50
        }
      ],
      totalAmount: 7.50,
      paymentMethod: "Cash",
      date: "2024-01-14",
      status: "Completed"
    },
  ]);

  const [newSale, setNewSale] = useState<Partial<Sale>>({
    items: [],
    paymentMethod: "Cash",
    status: "Completed"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSales = sales.filter(sale =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaysSales = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const averageSale = totalRevenue / sales.length;

  const handleAddSale = () => {
    if (newSale.customerName && newSale.items && newSale.items.length > 0) {
      const sale: Sale = {
        id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
        customerId: `CUST-${String(sales.length + 1).padStart(3, '0')}`,
        customerName: newSale.customerName,
        items: newSale.items,
        totalAmount: newSale.items.reduce((sum, item) => sum + item.totalPrice, 0),
        paymentMethod: newSale.paymentMethod || "Cash",
        date: new Date().toISOString().split('T')[0],
        status: "Completed",
      };
      
      setSales([...sales, sale]);
      setNewSale({ items: [], paymentMethod: "Cash", status: "Completed" });
      setIsAddDialogOpen(false);
      showSuccess("Sale recorded successfully!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track and manage your pharmacy sales</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newSale.customerName || ""}
                  onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select onValueChange={(value) => setNewSale({...newSale, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Digital">Digital Payment</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-600">
                Note: In a full implementation, you would add medicine items here with quantities and prices.
              </div>
              
              <Button onClick={handleAddSale} className="w-full">
                Record Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">{todaysSales.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Sale</p>
                <p className="text-2xl font-bold text-gray-900">${averageSale.toFixed(2)}</p>
              </div>
              <Receipt className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
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
              placeholder="Search sales by invoice ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Sales History ({filteredSales.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-sm text-gray-600">{sale.customerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {sale.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{item.medicineName}</span>
                          <span className="text-gray-600"> x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sale.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        sale.status === "Completed" ? "default" : 
                        sale.status === "Pending" ? "secondary" : "destructive"
                      }
                    >
                      {sale.status}
                    </Badge>
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