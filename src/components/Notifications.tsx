import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, CheckCircle, X, Calendar, Package, Users, DollarSign } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  category: "inventory" | "sales" | "customer" | "system" | "prescription" | "billing";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionRequired: boolean;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "NOT-001",
      type: "warning",
      category: "inventory",
      title: "Low Stock Alert",
      message: "Paracetamol 500mg is running low (15 units remaining, minimum: 50)",
      timestamp: "2024-01-15 09:30:00",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "NOT-002",
      type: "error",
      category: "inventory",
      title: "Medicine Expired",
      message: "Aspirin 325mg (Batch: ASP-2023-001) has expired and needs disposal",
      timestamp: "2024-01-15 08:45:00",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "NOT-003",
      type: "info",
      category: "sales",
      title: "Daily Sales Report",
      message: "Today's sales: $2,847 (45 transactions)",
      timestamp: "2024-01-15 18:00:00",
      read: true,
      priority: "low",
      actionRequired: false
    },
    {
      id: "NOT-004",
      type: "success",
      category: "billing",
      title: "Payment Received",
      message: "Invoice INV-2024-001 has been paid by John Doe ($8.91)",
      timestamp: "2024-01-15 14:20:00",
      read: false,
      priority: "medium",
      actionRequired: false
    },
    {
      id: "NOT-005",
      type: "warning",
      category: "prescription",
      title: "Prescription Expiring",
      message: "Prescription RX-001 for John Doe expires in 7 days",
      timestamp: "2024-01-15 10:15:00",
      read: true,
      priority: "medium",
      actionRequired: true
    },
    {
      id: "NOT-006",
      type: "info",
      category: "customer",
      title: "New Customer Registration",
      message: "New customer Sarah Wilson has been registered",
      timestamp: "2024-01-15 11:30:00",
      read: false,
      priority: "low",
      actionRequired: false
    },
    {
      id: "NOT-007",
      type: "warning",
      category: "billing",
      title: "Overdue Invoice",
      message: "Invoice INV-2024-003 for Mike Johnson is overdue ($7.35)",
      timestamp: "2024-01-15 09:00:00",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "NOT-008",
      type: "info",
      category: "system",
      title: "System Backup Completed",
      message: "Daily system backup completed successfully",
      timestamp: "2024-01-15 02:00:00",
      read: true,
      priority: "low",
      actionRequired: false
    }
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case "unread": return !notification.read;
      case "high": return notification.priority === "high";
      default: return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    showSuccess("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    showSuccess("Notification deleted");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "inventory": return <Package className="h-4 w-4" />;
      case "sales": return <DollarSign className="h-4 w-4" />;
      case "customer": return <Users className="h-4 w-4" />;
      case "prescription": return <Calendar className="h-4 w-4" />;
      case "billing": return <DollarSign className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important alerts and system notifications</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Info className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Notifications
        </Button>
        <Button 
          variant={filter === "unread" ? "default" : "outline"}
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={filter === "high" ? "default" : "outline"}
          onClick={() => setFilter("high")}
        >
          High Priority
        </Button>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <Badge variant={getPriorityColor(notification.priority) as any}>
                          {notification.priority}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(notification.category)}
                          <span className="text-xs text-gray-500 capitalize">{notification.category}</span>
                        </div>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};