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
import { Search, Plus, FileText, DollarSign, CreditCard, Receipt, Printer, Download } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(false);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = async () => {
    if (newInvoice.customerName && newInvoice.dueDate) {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Billing & Invoices</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage invoices, payments, and billing records</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </motion.div>
              </DialogTrigger>
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
                  
                  <Button onClick={handleAddInvoice} className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      $<AnimatedCounter value={totalRevenue} />
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      $<AnimatedCounter value={pendingAmount} />
                    </p>
                  </div>
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      $<AnimatedCounter value={overdueAmount} />
                    </p>
                  </div>
                  <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={totalInvoices} />
                    </p>
                  </div>
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </StaggerContainer>

        {/* Search */}
        <FadeIn delay={200}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices by ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Invoices Table */}
        <FadeIn delay={300}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <FileText className="h-5 w-5 mr-2" />
                Invoice Records ({filteredInvoices.length} invoices)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Invoice ID</TableHead>
                      <TableHead className="min-w-[150px]">Customer</TableHead>
                      <TableHead className="min-w-[100px]">Issue Date</TableHead>
                      <TableHead className="min-w-[100px]">Due Date</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Payment Method</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice, index) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
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
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};