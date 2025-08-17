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
import { Search, AlertTriangle, Calendar, Package, Trash2 } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface ExpiredMedicine {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  originalPrice: number;
  totalLoss: number;
  supplier: string;
  category: string;
  daysExpired: number;
  status: "Expired" | "Expiring Soon" | "Disposed";
}

export const ExpiredMedicines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expiredMedicines, setExpiredMedicines] = useState<ExpiredMedicine[]>([
    {
      id: "EXP-001",
      name: "Aspirin 325mg",
      batchNumber: "ASP-2023-001",
      expiryDate: "2023-12-15",
      quantity: 45,
      originalPrice: 1.50,
      totalLoss: 67.50,
      supplier: "PharmaCorp Ltd",
      category: "Pain Relief",
      daysExpired: 31,
      status: "Expired"
    },
    {
      id: "EXP-002",
      name: "Cough Syrup 100ml",
      batchNumber: "CS-2023-045",
      expiryDate: "2023-11-30",
      quantity: 12,
      originalPrice: 8.75,
      totalLoss: 105.00,
      supplier: "MediSupply Inc",
      category: "Cold & Flu",
      daysExpired: 46,
      status: "Expired"
    },
    {
      id: "EXP-003",
      name: "Vitamin C 500mg",
      batchNumber: "VC-2024-012",
      expiryDate: "2024-02-28",
      quantity: 25,
      originalPrice: 12.00,
      totalLoss: 300.00,
      supplier: "VitaHealth Distributors",
      category: "Vitamins",
      daysExpired: -13,
      status: "Expiring Soon"
    },
    {
      id: "EXP-004",
      name: "Antibiotic Cream",
      batchNumber: "AC-2023-078",
      expiryDate: "2023-10-20",
      quantity: 8,
      originalPrice: 15.25,
      totalLoss: 122.00,
      supplier: "PharmaCorp Ltd",
      category: "Topical",
      daysExpired: 87,
      status: "Disposed"
    },
  ]);

  const filteredMedicines = expiredMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDispose = (id: string) => {
    setExpiredMedicines(prev => 
      prev.map(med => 
        med.id === id ? { ...med, status: "Disposed" as const } : med
      )
    );
    showSuccess("Medicine marked as disposed");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Expired": return "destructive";
      case "Expiring Soon": return "secondary";
      case "Disposed": return "outline";
      default: return "secondary";
    }
  };

  const totalExpired = expiredMedicines.filter(m => m.status === "Expired").length;
  const expiringSoon = expiredMedicines.filter(m => m.status === "Expiring Soon").length;
  const totalLoss = expiredMedicines.reduce((sum, m) => sum + m.totalLoss, 0);
  const disposed = expiredMedicines.filter(m => m.status === "Disposed").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expired Medicines</h1>
        <p className="text-gray-600">Track and manage expired and expiring medicines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired Items</p>
                <p className="text-2xl font-bold text-red-600">{totalExpired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSoon}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loss</p>
                <p className="text-2xl font-bold text-red-600">${totalLoss.toFixed(2)}</p>
              </div>
              <div className="text-red-600 text-2xl font-bold">$</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disposed</p>
                <p className="text-2xl font-bold text-gray-600">{disposed}</p>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
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
              placeholder="Search by medicine name, batch number, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expired Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Expired & Expiring Medicines ({filteredMedicines.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Loss</TableHead>
                <TableHead>Days Expired</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{medicine.batchNumber}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell>${medicine.originalPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-red-600">
                    ${medicine.totalLoss.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {medicine.daysExpired > 0 ? (
                      <span className="text-red-600">+{medicine.daysExpired} days</span>
                    ) : (
                      <span className="text-orange-600">{Math.abs(medicine.daysExpired)} days left</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(medicine.status) as any}>
                      {medicine.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {medicine.status !== "Disposed" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDispose(medicine.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Dispose
                      </Button>
                    )}
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