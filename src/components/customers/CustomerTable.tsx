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
import { Users, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Customer } from "./types";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const CustomerTable = ({
  customers,
  onView,
  onEdit,
  onDelete,
  isLoading
}: CustomerTableProps) => {
  return (
    <FadeIn delay={300}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Users className="h-5 w-5 mr-2" />
            Customer Database ({customers.length} customers)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Customer ID</TableHead>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[250px]">Contact</TableHead>
                  <TableHead className="min-w-[150px]">Total Purchases</TableHead>
                  <TableHead className="min-w-[120px]">Last Visit</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{customer.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${customer.totalPurchases.toFixed(2)}</TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onView(customer)}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEdit(customer)}
                          className="w-full sm:w-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDelete(customer.id)}
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
  );
};