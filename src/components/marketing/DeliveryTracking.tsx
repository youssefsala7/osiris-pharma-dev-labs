import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Plus, Bell, MessageCircle, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { showSuccess, showError } from "@/utils/toast";
import { DeliveryTracking as IDeliveryTracking, DeliveryUpdate } from "./types";

export const DeliveryTracking = () => {
  const [deliveries, setDeliveries] = useState<IDeliveryTracking[]>([
    {
      id: "DEL-001",
      orderId: "ORD-001",
      customerName: "John Doe",
      customerPhone: "+971501234567",
      customerEmail: "john.doe@email.com",
      trackingNumber: "TRK123456789",
      carrier: "Emirates Post",
      status: "In Transit",
      estimatedDelivery: "2024-01-17T15:00:00Z",
      location: "Dubai Distribution Center",
      notifications: {
        whatsapp: true,
        email: true,
        sms: false
      },
      updates: [
        {
          id: "UPD-001",
          timestamp: "2024-01-15T10:00:00Z",
          status: "Picked Up",
          location: "Al Kindi Pharmacy - Sharjah",
          description: "Package picked up from pharmacy"
        },
        {
          id: "UPD-002",
          timestamp: "2024-01-16T08:30:00Z",
          status: "In Transit",
          location: "Dubai Distribution Center",
          description: "Package arrived at distribution center"
        }
      ]
    },
    {
      id: "DEL-002",
      orderId: "ORD-002",
      customerName: "Sarah Wilson",
      customerPhone: "+971509876543",
      customerEmail: "sarah.wilson@email.com",
      trackingNumber: "TRK987654321",
      carrier: "Aramex",
      status: "Out for Delivery",
      estimatedDelivery: "2024-01-16T14:00:00Z",
      location: "Abu Dhabi - Final Mile",
      notifications: {
        whatsapp: true,
        email: true,
        sms: true
      },
      updates: [
        {
          id: "UPD-003",
          timestamp: "2024-01-15T11:00:00Z",
          status: "Picked Up",
          location: "Al Kindi Pharmacy - Sharjah",
          description: "Package picked up from pharmacy"
        },
        {
          id: "UPD-004",
          timestamp: "2024-01-16T09:00:00Z",
          status: "Out for Delivery",
          location: "Abu Dhabi - Final Mile",
          description: "Package out for delivery"
        }
      ]
    }
  ]);

  const [newDelivery, setNewDelivery] = useState<Partial<IDeliveryTracking>>({
    notifications: { whatsapp: true, email: true, sms: false }
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateDelivery = () => {
    if (!newDelivery.orderId || !newDelivery.customerName || !newDelivery.trackingNumber) {
      showError("Please fill in all required fields");
      return;
    }

    const delivery: IDeliveryTracking = {
      id: `DEL-${String(deliveries.length + 1).padStart(3, '0')}`,
      orderId: newDelivery.orderId,
      customerName: newDelivery.customerName,
      customerPhone: newDelivery.customerPhone || "",
      customerEmail: newDelivery.customerEmail || "",
      trackingNumber: newDelivery.trackingNumber,
      carrier: newDelivery.carrier || "Emirates Post",
      status: "Pending",
      estimatedDelivery: newDelivery.estimatedDelivery || "",
      notifications: newDelivery.notifications || { whatsapp: true, email: true, sms: false },
      updates: []
    };

    setDeliveries([delivery, ...deliveries]);
    setNewDelivery({ notifications: { whatsapp: true, email: true, sms: false } });
    setIsCreateDialogOpen(false);
    showSuccess("Delivery tracking created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Out for Delivery": return "secondary";
      case "In Transit": return "outline";
      case "Picked Up": return "outline";
      case "Pending": return "secondary";
      case "Failed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Out for Delivery": return <Truck className="h-4 w-4 text-blue-500" />;
      case "In Transit": return <Package className="h-4 w-4 text-orange-500" />;
      case "Picked Up": return <Package className="h-4 w-4 text-purple-500" />;
      case "Pending": return <Clock className="h-4 w-4 text-gray-500" />;
      case "Failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalDeliveries = deliveries.length;
  const inTransit = deliveries.filter(d => d.status === "In Transit" || d.status === "Out for Delivery").length;
  const delivered = deliveries.filter(d => d.status === "Delivered").length;
  const pending = deliveries.filter(d => d.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={totalDeliveries} />
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={inTransit} />
                  </p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={delivered} />
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={pending} />
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Delivery Management */}
      <FadeIn delay={200}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Active Deliveries ({deliveries.length})
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Delivery
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Delivery Tracking</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orderId">Order ID</Label>
                      <Input
                        id="orderId"
                        value={newDelivery.orderId || ""}
                        onChange={(e) => setNewDelivery({...newDelivery, orderId: e.target.value})}
                        placeholder="ORD-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                      <Input
                        id="trackingNumber"
                        value={newDelivery.trackingNumber || ""}
                        onChange={(e) => setNewDelivery({...newDelivery, trackingNumber: e.target.value})}
                        placeholder="TRK123456789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={newDelivery.customerName || ""}
                      onChange={(e) => setNewDelivery({...newDelivery, customerName: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        value={newDelivery.customerPhone || ""}
                        onChange={(e) => setNewDelivery({...newDelivery, customerPhone: e.target.value})}
                        placeholder="+971501234567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newDelivery.customerEmail || ""}
                        onChange={(e) => setNewDelivery({...newDelivery, customerEmail: e.target.value})}
                        placeholder="customer@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carrier">Carrier</Label>
                      <Select onValueChange={(value) => setNewDelivery({...newDelivery, carrier: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Emirates Post">Emirates Post</SelectItem>
                          <SelectItem value="Aramex">Aramex</SelectItem>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                      <Input
                        id="estimatedDelivery"
                        type="datetime-local"
                        value={newDelivery.estimatedDelivery || ""}
                        onChange={(e) => setNewDelivery({...newDelivery, estimatedDelivery: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Notification Preferences</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">WhatsApp Notifications</span>
                        </div>
                        <Switch
                          checked={newDelivery.notifications?.whatsapp || false}
                          onCheckedChange={(checked) => setNewDelivery({
                            ...newDelivery, 
                            notifications: { ...newDelivery.notifications!, whatsapp: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Email Notifications</span>
                        </div>
                        <Switch
                          checked={newDelivery.notifications?.email || false}
                          onCheckedChange={(checked) => setNewDelivery({
                            ...newDelivery, 
                            notifications: { ...newDelivery.notifications!, email: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">SMS Notifications</span>
                        </div>
                        <Switch
                          checked={newDelivery.notifications?.sms || false}
                          onCheckedChange={(checked) => setNewDelivery({
                            ...newDelivery, 
                            notifications: { ...newDelivery.notifications!, sms: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleCreateDelivery} className="w-full">
                    Create Delivery Tracking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(delivery.status)}
                        <h3 className="font-medium">{delivery.customerName}</h3>
                        <Badge variant={getStatusColor(delivery.status) as any}>
                          {delivery.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Order:</span> {delivery.orderId}
                        </div>
                        <div>
                          <span className="font-medium">Tracking:</span> {delivery.trackingNumber}
                        </div>
                        <div>
                          <span className="font-medium">Carrier:</span> {delivery.carrier}
                        </div>
                      </div>
                      {delivery.location && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {delivery.location}
                        </div>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {delivery.notifications.whatsapp && (
                          <Badge variant="outline" className="text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            WhatsApp
                          </Badge>
                        )}
                        {delivery.notifications.email && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Badge>
                        )}
                        {delivery.notifications.sms && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            SMS
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                      <Button variant="outline" size="sm">
                        Notify
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Carrier Integration */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle>Carrier Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-medium mb-1">Emirates Post</h4>
                <Badge variant="default" className="text-xs">Connected</Badge>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-medium mb-1">Aramex</h4>
                <Badge variant="default" className="text-xs">Connected</Badge>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="font-medium mb-1">DHL</h4>
                <Badge variant="secondary" className="text-xs">Setup Required</Badge>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-1">FedEx</h4>
                <Badge variant="secondary" className="text-xs">Setup Required</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};