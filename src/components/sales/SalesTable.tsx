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
import { ShoppingCart, Eye, RotateCcw, Receipt } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Sale } from "./types";

interface SalesTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onRefund: (saleId: string) => void;
  onPrintReceipt: (sale: Sale) => void;
  isLoading: boolean;
}

export const SalesTable = ({
  sales,
  onView,
  onRefund,
  onPrintReceipt,
  isLoading
}: SalesTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Pending": return "secondary";
      case "Refunded": return "destructive";
      case "Cancelled": return "outline";
      default: return "secondary";
    }
  };

  return (
    <FadeIn delay={300}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Sales History ({sales.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Sale ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[200px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[120px]">Payment</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sale.customerName}</p>
                        <p className="text-sm text-gray-600">{sale.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {sale.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item.medicineName}</span>
                            <span className="text-gray-600"> x{item.quantity}</span>
                          </div>
                        ))}
                        {sale.items.length > 2 && (
                          <div className="text-sm text-gray-600">
                            +{sale.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sale.status) as any}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onView(sale)}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onPrintReceipt(sale)}
                          className="w-full sm:w-auto"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        {sale.status === "Completed" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onRefund(sale.id)}
                            disabled={isLoading}
                            className="w-full sm:w-auto text-red-600 hover:text-red-700"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
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