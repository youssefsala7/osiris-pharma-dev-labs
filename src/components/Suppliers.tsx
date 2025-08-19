import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Truck, Phone, Mail, MapPin, Download } from "lucide-react";
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

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  category: string;
  status: "Active" | "Inactive" | "Pending";
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  paymentTerms: string;
  notes: string;
}

export const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "SUP-001",
      name: "PharmaCorp Ltd",
      contactPerson: "John Smith",
      email: "orders@pharmacorp.com",
      phone: "+1 (555) 234-5678",
      address: "123 Industrial Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      category: "Pharmaceuticals",
      status: "Active",
      totalOrders: 45,
      totalValue: 125000.50,
      lastOrderDate: "2024-01-10",
      paymentTerms: "Net 30",
      notes: "Primary supplier for pain relief medications"
    },
    {
      id: "SUP-002",
      name: "MediSupply Inc",
      contactPerson: "Sarah Johnson",
      email: "supply@medisupply.com",
      phone: "+1 (555) 345-6789",
      address: "456 Commerce St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      category: "Antibiotics",
      status: "Active",
      totalOrders: 32,
      totalValue: 89750.25,
      lastOrderDate: "2024-01-08",
      paymentTerms: "Net 15",
      notes: "Reliable supplier for antibiotics and specialty medications"
    },
    {
      id: "SUP-003",
      name: "VitaHealth Distributors",
      contactPerson: "Mike Davis",
      email: "info@vitahealth.com",
      phone: "+1 (555) 456-7890",
      address: "789 Health Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      category: "Vitamins & Supplements",
      status: "Active",
      totalOrders: 28,
      totalValue: 45200.75,
      lastOrderDate: "2024-01-12",
      paymentTerms: "Net 30",
      notes: "Specializes in vitamins and nutritional supplements"
    },
  ]);

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contactPerson && newSupplier.email && newSupplier.phone) {
      const supplier: Supplier = {
        id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
        name: newSupplier.name,
        contactPerson: newSupplier.contactPerson,
        email: newSupplier.email,
        phone: newSupplier.phone,
        address: newSupplier.address || "",
        city: newSupplier.city || "",
        state: newSupplier.state || "",
        zipCode: newSupplier.zipCode || "",
        country: newSupplier.country || "USA",
        category: newSupplier.category || "General",
        status: "Active",
        totalOrders: 0,
        totalValue: 0,
        lastOrderDate: "",
        paymentTerms: newSupplier.paymentTerms || "Net 30",
        notes: newSupplier.notes || "",
      };
      
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({});
      setIsAddDialogOpen(false);
      showSuccess("Supplier added successfully!");
    }
  };

  const headerActions = (
    <>
      <Button variant="outline" className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Supplier
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Supplier Management"
      subtitle="Manage your supplier relationships and procurement"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Suppliers"
          value={suppliers.length}
          icon={<Truck className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Active Suppliers"
          value={suppliers.filter(s => s.status === "Active").length}
          icon={<Badge className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Total Orders"
          value={suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
          icon={<div className="h-8 w-8 text-purple-600 text-2xl font-bold">#</div>}
        />
        <StatCard
          title="Total Value"
          value={suppliers.reduce((sum, s) => sum + s.totalValue, 0)}
          icon={<div className="h-8 w-8 text-green-600 text-2xl font-bold">$</div>}
          prefix="$"
        />
      </ResponsiveGrid>

      {/* Search */}
      <StandardCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers by name, contact person, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </StandardCard>

      {/* Suppliers Table */}
      <StandardCard title={`Supplier Database (${filteredSuppliers.length} suppliers)`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      {supplier.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {supplier.city}, {supplier.state}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{supplier.category}</Badge>
                </TableCell>
                <TableCell>{supplier.totalOrders}</TableCell>
                <TableCell>${supplier.totalValue.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StandardCard>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newSupplier.name || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newSupplier.contactPerson || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  placeholder="Enter contact person"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newSupplier.address || ""}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                placeholder="Enter street address"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newSupplier.city || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, city: e.target.value})}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newSupplier.state || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, state: e.target.value})}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={newSupplier.zipCode || ""}
                  onChange={(e) => setNewSupplier({...newSupplier, zipCode: e.target.value})}
                  placeholder="Enter zip code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewSupplier({...newSupplier, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Vitamins & Supplements">Vitamins & Supplements</SelectItem>
                    <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select onValueChange={(value) => setNewSupplier({...newSupplier, paymentTerms: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newSupplier.notes || ""}
                onChange={(e) => setNewSupplier({...newSupplier, notes: e.target.value})}
                placeholder="Enter any additional notes"
              />
            </div>
            
            <Button onClick={handleAddSupplier} className="w-full">
              Add Supplier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};