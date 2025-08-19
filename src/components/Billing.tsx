import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, DollarSign, CreditCard, Receipt, Printer, Download } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccess } from "@/utils/toast";

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  paymentMethod: string;
  notes: string;
}

interface InvoiceItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2024-001",
      customerId: "CUST-001",
      customerName: "John Doe",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
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
      subtotal: 8.25,
      tax: 0.66,
      discount: 0.00,
      total: 8.91,
      status: "Paid",
      paymentMethod: "Cash",
      notes: ""
    },
    {
      id: "INV-2024-002",
      customerId: "CUST-002",
      customerName: "Jane Smith",
      issueDate: "2024-01-14",
      dueDate: "2024-02-14",
      items: [
        {
          medicineId: "MED-002",
          medicineName: "Amoxicillin 250mg",
          quantity: 1,
          unitPrice: 8.75,
          totalPrice: 8.75
        }
      ],
      subtotal: 8.75,
      tax: 0.70,
      discount: 0.00,
      total: 9.45,
      status: "Sent",
      paymentMethod: "Card",
      notes: "Insurance claim pending"
    },
    {
      id: "INV-2024-003",
      customerId: "CUST-003",
      customerName: "Mike Johnson",
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      items: [
        {
          medicineId: "MED-001",
          medicineName: "Paracetamol 500mg",
          quantity: 3,
          unitPrice: 2.50,
          totalPrice: 7.50
        }
      ],
      subtotal: 7.50,
      tax: 0.60,
      discount: 0.75,
      total: 7.35,
      status: "Overdue",
      paymentMethod: "Cash",
      notes: "Senior citizen discount applied"
    },
  ]);

  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    items: [],
    status: "Draft"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = () => {
    if (newInvoice.customerName && newInvoice.dueDate) {
      const invoice: Invoice = {
        id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        customerId: `CUST-${String(invoices.length + 1).padStart(3, '0')}`,
        customerName: newInvoice.customerName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: newInvoice.dueDate,
        items: newInvoice.items || [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: "Draft",
        paymentMethod: newInvoice.paymentMethod || "Cash",
        notes: newInvoice.notes || "",
      };
      
      setInvoices([...invoices, invoice]);
      setNewInvoice({ items: [], status: "Draft" });
      setIsAddDialogOpen(false);
      showSuccess("Invoice created successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "secondary";
      case "Sent": return "outline";
      case "Paid": return "default";
      case "Overdue": return "destructive";
      case "Cancelled": return "secondary";
      default: return "secondary";
    }
  };

  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === "Sent").reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices.filter(i => i.status === "Overdue").reduce((sum, i) => sum + i.total, 0);
  const totalInvoices = invoices.length;

  const headerActions = (
    <>
      <Button variant="outline" className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Create Invoice
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Billing & Invoices"
      subtitle="Manage invoices, payments, and billing records"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          prefix="$"
        />
        <StatCard
          title="Pending Amount"
          value={pendingAmount}
          icon={<CreditCard className="h-8 w-8 text-blue-600" />}
          prefix="$"
        />
        <StatCard
          title="Overdue Amount"
          value={overdueAmount}
          icon={<Receipt className="h-8 w-8 text-red-600" />}
          prefix="$"
        />
        <StatCard
          title="Total Invoices"
          value={totalInvoices}
          icon={<FileText className="h-8 w-8 text-purple-600" />}
        />
      </ResponsiveGrid>

      {/* Search */}
      <StandardCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search invoices by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </StandardCard>

      {/* Invoices Table */}
      <StandardCard title={`Invoice Records (${filteredInvoices.length} invoices)`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.customerName}</p>
                    <p className="text-sm text-gray-600">{invoice.customerId}</p>
                  </div>
                </TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(invoice.status) as any}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{invoice.paymentMethod}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StandardCard>

      {/* Add Invoice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={newInvoice.customerName || ""}
                onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newInvoice.dueDate || ""}
                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={(value) => setNewInvoice({...newInvoice, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Credit/Debit Card</SelectItem>
                  <SelectItem value="Digital">Digital Payment</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              Note: Items can be added after creating the invoice.
            </div>
            
            <Button onClick={handleAddInvoice} className="w-full">
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};