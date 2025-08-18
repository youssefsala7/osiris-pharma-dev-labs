import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Calendar, 
  Package, 
  TrendingDown, 
  Bell,
  Settings,
  Filter,
  Search
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { showSuccess } from "@/utils/toast";

interface InventoryAlert {
  id: string;
  type: "low-stock" | "out-of-stock" | "expiring" | "expired" | "overstock" | "slow-moving";
  severity: "critical" | "high" | "medium" | "low";
  medicineId: string;
  medicineName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  expiryDate?: string;
  daysUntilExpiry?: number;
  lastMovement?: string;
  supplier: string;
  estimatedCost: number;
  recommendedAction: string;
  createdAt: string;
  acknowledged: boolean;
}

export const InventoryAlerts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [alerts, setAlerts] = useState<InventoryAlert[]>([
    {
      id: "ALT-001",
      type: "out-of-stock",
      severity: "critical",
      medicineId: "MED-001",
      medicineName: "Paracetamol 500mg",
      category: "Pain Relief",
      currentStock: 0,
      minStock: 50,
      supplier: "PharmaCorp Ltd",
      estimatedCost: 125.00,
      recommendedAction: "Immediate reorder required - high demand item",
      createdAt: "2024-01-15T09:30:00Z",
      acknowledged: false
    },
    {
      id: "ALT-002",
      type: "low-stock",
      severity: "high",
      medicineId: "MED-002",
      medicineName: "Amoxicillin 250mg",
      category: "Antibiotics",
      currentStock: 8,
      minStock: 30,
      supplier: "MediSupply Inc",
      estimatedCost: 262.50,
      recommendedAction: "Reorder within 3 days to avoid stockout",
      createdAt: "2024-01-15T08:45:00Z",
      acknowledged: false
    },
    {
      id: "ALT-003",
      type: "expiring",
      severity: "high",
      medicineId: "MED-003",
      medicineName: "Vitamin C 500mg",
      category: "Vitamins",
      currentStock: 25,
      minStock: 20,
      expiryDate: "2024-02-28",
      daysUntilExpiry: 13,
      supplier: "VitaHealth Distributors",
      estimatedCost: 300.00,
      recommendedAction: "Promote or discount to move inventory before expiry",
      createdAt: "2024-01-15T07:20:00Z",
      acknowledged: true
    },
    {
      id: "ALT-004",
      type: "slow-moving",
      severity: "medium",
      medicineId: "MED-004",
      medicineName: "Cough Syrup Premium",
      category: "Cold & Flu",
      currentStock: 45,
      minStock: 15,
      maxStock: 50,
      lastMovement: "2024-01-01",
      supplier: "PharmaCorp Ltd",
      estimatedCost: 450.00,
      recommendedAction: "Consider reducing order quantities or promotional pricing",
      createdAt: "2024-01-14T16:30:00Z",
      acknowledged: false
    },
    {
      id: "ALT-005",
      type: "overstock",
      severity: "low",
      medicineId: "MED-005",
      medicineName: "Multivitamin Complex",
      category: "Vitamins",
      currentStock: 150,
      minStock: 30,
      maxStock: 80,
      supplier: "VitaHealth Distributors",
      estimatedCost: 1800.00,
      recommendedAction: "Excess inventory - consider promotional campaigns",
      createdAt: "2024-01-14T14:15:00Z",
      acknowledged: true
    }
  ]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    showSuccess("Alert acknowledged");
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
    showSuccess("All alerts acknowledged");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "out-of-stock": return <Package className="h-4 w-4 text-red-500" />;
      case "low-stock": return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case "expiring": return <Calendar className="h-4 w-4 text-yellow-500" />;
      case "expired": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "overstock": return <Package className="h-4 w-4 text-blue-500" />;
      case "slow-moving": return <TrendingDown className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const highAlerts = alerts.filter(a => a.severity === "high" && !a.acknowledged).length;
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const totalCost = alerts.reduce((sum, alert) => sum + alert.estimatedCost, 0);

  return (
    <div className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Alerts</h1>
            <p className="text-gray-600">Monitor and manage inventory alerts and notifications</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Alert Settings
            </Button>
            <Button onClick={handleAcknowledgeAll} disabled={unacknowledged === 0}>
              <Bell className="h-4 w-4 mr-2" />
              Acknowledge All
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Alert Summary */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-700">{criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-700">{highAlerts}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Unacknowledged</p>
                  <p className="text-2xl font-bold text-blue-700">{unacknowledged}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Estimated Impact</p>
                  <p className="text-2xl font-bold text-purple-700">${totalCost.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={200}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by medicine name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="slow-moving">Slow Moving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Alerts List */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    alert.acknowledged ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{alert.medicineName}</h3>
                          <Badge variant={getSeverityColor(alert.severity) as any}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {getTypeLabel(alert.type)}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge variant="secondary" className="text-xs">
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Category:</span> {alert.category}
                          </div>
                          <div>
                            <span className="font-medium">Current Stock:</span> {alert.currentStock}
                          </div>
                          <div>
                            <span className="font-medium">Supplier:</span> {alert.supplier}
                          </div>
                        </div>
                        
                        {alert.expiryDate && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Expires:</span> {alert.expiryDate} 
                            ({alert.daysUntilExpiry} days remaining)
                          </div>
                        )}
                        
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Recommended Action:</span> {alert.recommendedAction}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                          <span>Estimated Cost Impact: ${alert.estimatedCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {!alert.acknowledged && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};