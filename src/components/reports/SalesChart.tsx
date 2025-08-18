import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendingUp, DollarSign } from "lucide-react";
import { SalesReport } from "./types";

interface SalesChartProps {
  data: SalesReport;
}

export const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Selling Medicines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Selling Medicines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topSellingMedicines.map((medicine, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{medicine.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">${medicine.revenue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{medicine.quantity} units</div>
                  </div>
                </div>
                <ProgressBar
                  value={medicine.percentage}
                  max={100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Sales by Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.salesByPaymentMethod.map((payment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{payment.method}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">${payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{payment.transactions} transactions</div>
                  </div>
                </div>
                <ProgressBar
                  value={payment.percentage}
                  max={100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Sales Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.monthlySales.map((month, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600">{month.month}</div>
                <div className="text-xl font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{month.sales} sales</div>
                <div className={`text-sm font-medium ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {month.growth >= 0 ? '+' : ''}{month.growth}% growth
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};