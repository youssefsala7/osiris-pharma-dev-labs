import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Package,
  Users,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  ClipboardList,
  UserCheck,
  Receipt,
  Bell,
  AlertTriangle,
  Shield,
  CreditCard,
  Activity,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "insurance-claims", label: "Insurance Claims", icon: CreditCard },
  { id: "drug-interactions", label: "Drug Interactions", icon: Shield },
  { id: "expired-medicines", label: "Expired Medicines", icon: AlertTriangle },
  { id: "user-management", label: "User Management", icon: UserCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "audit-logs", label: "Audit Logs", icon: Activity },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-800">PharmaCare</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "px-2"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon size={20} />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};