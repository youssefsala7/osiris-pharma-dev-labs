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
import { Search, Plus, Edit, Trash2, Package, Download, Filter, Eye, AlertTriangle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";

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
  batchNumber: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
}

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
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
      description: "Pain and fever relief tablets",
      batchNumber: "PAR-2024-001",
      manufacturer: "PharmaCorp Ltd",
      dosageForm: "Tablet",
      strength: "500mg"
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
      description: "Antibiotic capsules for bacterial infections",
      batchNumber: "AMX-2024-002",
      manufacturer: "MediSupply Inc",
      dosageForm: "Capsule",
      strength: "250mg"
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
      description: "Anti-inflammatory pain relief tablets",
      batchNumber: "IBU-2024-003",
      manufacturer: "PharmaCorp Ltd",
      dosageForm: "Tablet",
      strength: "400mg"
    },
  ]);

  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({});
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const categories = ["Pain Relief", "Antibiotics", "Vitamins", "Cold & Flu", "Digestive", "Cardiovascular"];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMedicine = async () => {
    if (newMedicine.name && newMedicine.category && newMedicine.stock && newMedicine.price) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        batchNumber: newMedicine.batchNumber || `BAT-${Date.now()}`,
        manufacturer: newMedicine.manufacturer || newMedicine.supplier || "",
        dosageForm: newMedicine.dosageForm || "Tablet",
        strength: newMedicine.strength || "",
      };
      
      setMedicines([...medicines, medicine]);
      setNewMedicine({});
      setIsAddDialogOpen(false);
      setIsLoading(false);
      showSuccess("Medicine added successfully!");
    } else {
      showError("Please fill in all required fields");
    }
  };

  const handleEditMedicine = async () => {
    if (editingMedicine) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMedicines(medicines.map(med => 
        med.id === editingMedicine.id ? editingMedicine : med
      ));
      setEditingMedicine(null);
      setIsEditDialogOpen(false);
      setIsLoading(false);
      showSuccess("Medicine updated successfully!");
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMedicines(medicines.filter(med => med.id !== id));
      setIsLoading(false);
      showSuccess("Medicine deleted successfully!");
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const csvContent = [
      ["ID", "Name", "Category", "Stock", "Price", "Expiry Date", "Supplier"].join(","),
      ...filteredMedicines.map(med => [
        med.id, med.name, med.category, med.stock, med.price, med.expiryDate, med.supplier
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
    
    setIsLoading(false);
    showSuccess("Inventory data exported successfully!");
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return <Badge variant="destructive" className="animate-pulse">Low Stock</Badge>;
    } else if (stock <= minStock * 1.5) {
      return <Badge variant="secondary">Medium</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  const lowStockCount = medicines.filter(med => med.stock <= med.minStock).length;
  const totalValue = medicines.reduce((sum, med) => sum + (med.stock * med.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your medicine stock and inventory</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medicine
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Medicine</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Medicine Name *</Label>
                      <Input
                        id="name"
                        value={newMedicine.name || ""}
                        onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                        placeholder="Enter medicine name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => setNewMedicine({...newMedicine, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock">Stock Quantity *</Label>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($) *</Label>
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
                        <Label htmlFor="strength">Strength</Label>
                        <Input
                          id="strength"
                          value={newMedicine.strength || ""}
                          onChange={(e) => setNewMedicine({...newMedicine, strength: e.target.value})}
                          placeholder="e.g., 500mg"
                        />
                      </div>
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
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={handleAddMedicine} className="w-full" disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Add Medicine
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{medicines.length}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{lowStockCount}</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                </div>
                <div className="text-green-600 text-xl sm:text-2xl font-bold">$</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{categories.length}</p>
                </div>
                <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </StaggerContainer>

        {/* Search and Filters */}
        <FadeIn delay={200}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Inventory Table */}
        <FadeIn delay={300}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Package className="h-5 w-5 mr-2" />
                Medicine Inventory ({filteredMedicines.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Medicine ID</TableHead>
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Stock</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Price</TableHead>
                      <TableHead className="min-w-[120px]">Expiry Date</TableHead>
                      <TableHead className="min-w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((medicine, index) => (
                      <TableRow key={medicine.id} className="hover:bg-gray-50 transition-colors">
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
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setViewingMedicine(medicine);
                                setIsViewDialogOpen(true);
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingMedicine(medicine);
                                setIsEditDialogOpen(true);
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteMedicine(medicine.id)}
                              disabled={isLoading}
                              className="w-full sm:w-auto text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* View Medicine Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Medicine Details</DialogTitle>
            </DialogHeader>
            {viewingMedicine && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Medicine ID</Label>
                    <p className="font-medium">{viewingMedicine.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="font-medium">{viewingMedicine.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p>{viewingMedicine.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Strength</Label>
                    <p>{viewingMedicine.strength}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Stock</Label>
                    <p>{viewingMedicine.stock}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Price</Label>
                    <p>${viewingMedicine.price.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm">{viewingMedicine.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Batch Number</Label>
                    <p className="font-mono text-sm">{viewingMedicine.batchNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
                    <p>{viewingMedicine.expiryDate}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                  <p>{viewingMedicine.supplier}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Medicine Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
            </DialogHeader>
            {editingMedicine && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Medicine Name</Label>
                  <Input
                    id="editName"
                    value={editingMedicine.name}
                    onChange={(e) => setEditingMedicine({...editingMedicine, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Select value={editingMedicine.category} onValueChange={(value) => setEditingMedicine({...editingMedicine, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editStock">Stock</Label>
                    <Input
                      id="editStock"
                      type="number"
                      value={editingMedicine.stock}
                      onChange={(e) => setEditingMedicine({...editingMedicine, stock: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPrice">Price</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      step="0.01"
                      value={editingMedicine.price}
                      onChange={(e) => setEditingMedicine({...editingMedicine, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleEditMedicine} className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  Update Medicine
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};