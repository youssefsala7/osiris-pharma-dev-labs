import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye, Edit, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Medicine } from "./types";

interface MedicineTableProps {
  medicines: Medicine[];
  onView: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const MedicineTable = ({
  medicines,
  onView,
  onEdit,
  onDelete,
  isLoading
}: MedicineTableProps) => {
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return <Badge className="low-stock">Low Stock</Badge>;
    } else if (stock <= minStock * 1.5) {
      return <Badge className="status-moderate">Medium</Badge>;
    }
    return <Badge className="status-success">In Stock</Badge>;
  };

  return (
    <FadeIn delay={300}>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Package className="h-5 w-5 mr-2" />
            Medicine Inventory ({medicines.length} items)
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
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{medicine.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm opacity-70">{medicine.supplier}</p>
                      </div>
                    </TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{medicine.stock}</p>
                        <p className="text-sm opacity-70">Min: {medicine.minStock}</p>
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
                          onClick={() => onView(medicine)}
                          className="w-full sm:w-auto action-button"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEdit(medicine)}
                          className="w-full sm:w-auto action-button"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDelete(medicine.id)}
                          disabled={isLoading}
                          className="w-full sm:w-auto text-red-600 hover:text-red-700 action-button"
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
  );
};