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
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  supplier: string;
  description: string;
}

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "MED-001",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      stock: 150,
      minStock: 50,
      price: 2.50,
      expiryDate: "2025-06-15",
      supplier: "PharmaCorp Ltd",
      description: "Pain and fever relief tablets"
    },
    {
      id: "MED-002",
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      stock: 75,
      minStock: 30,
      price: 8.75,
      expiryDate: "2024-12-20",
      supplier: "MediSupply Inc",
      description: "Antibiotic capsules for bacterial infections"
    },
    {
      id: "MED-003",
      name: "Ibuprofen 400mg",
      category: "Pain Relief",
      stock: 22,
      minStock: 40,
      price: 3.25,
      expiryDate: "2025-03-10",
      supplier: "PharmaCorp Ltd",
      description: "Anti-inflammatory pain relief tablets"
    },
  ]);

  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.category && newMedicine.stock && newMedicine.price) {
      const medicine: Medicine = {
        id: `MED-${String(medicines.length + 1).padStart(3, '0')}`,
        name: newMedicine.name,
        category: newMedicine.category,
        stock: Number(newMedicine.stock),
        minStock: Number(newMedicine.minStock) || 10,
        price: Number(newMedicine.price),
        expiryDate: newMedicine.expiryDate || "",
        supplier: newMedicine.supplier || "",
        description: newMedicine.description || "",
      };
      
      setMedicines([...medicines, medicine]);
      setNewMedicine({});
      setIsAddDialogOpen(false);
      showSuccess("Medicine added successfully!");
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return <Badge variant="destructive">Low Stock</Badge>;
    } else if (stock <= minStock * 1.5) {
      return <Badge variant="secondary">Medium</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your medicine stock and inventory</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={newMedicine.name || ""}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  placeholder="Enter medicine name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewMedicine({...newMedicine, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Vitamins">Vitamins</SelectItem>
                    <SelectItem value="Cold & Flu">Cold & Flu</SelectItem>
                    <SelectItem value="Digestive">Digestive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newMedicine.stock || ""}
                    onChange={(e) => setNewMedicine({...newMedicine, stock: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newMedicine.minStock || ""}
                    onChange={(e) => setNewMedicine({...newMedicine, minStock: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newMedicine.price || ""}
                  onChange={(e) => setNewMedicine({...newMedicine, price: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newMedicine.expiryDate || ""}
                  onChange={(e) => setNewMedicine({...newMedicine, expiryDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newMedicine.supplier || ""}
                  onChange={(e) => setNewMedicine({...newMedicine, supplier: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMedicine.description || ""}
                  onChange={(e) => setNewMedicine({...newMedicine, description: e.target.value})}
                  placeholder="Enter medicine description"
                />
              </div>
              
              <Button onClick={handleAddMedicine} className="w-full">
                Add Medicine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Medicine Inventory ({filteredMedicines.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.supplier}</p>
                    </div>
                  </TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine.stock}</p>
                      <p className="text-sm text-gray-600">Min: {medicine.minStock}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStockStatus(medicine.stock, medicine.minStock)}</TableCell>
                  <TableCell>${medicine.price.toFixed(2)}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};