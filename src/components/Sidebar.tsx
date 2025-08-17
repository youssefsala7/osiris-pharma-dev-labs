import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, notifications: 0 },
  { id: "inventory", label: "Inventory", icon: Package, notifications: 4 },
  { id: "customers", label: "Customers", icon: Users, notifications: 0 },
  { id: "prescriptions", label: "Prescriptions", icon: FileText, notifications: 2 },
  { id: "sales", label: "Sales", icon: ShoppingCart, notifications: 0 },
  { id: "suppliers", label: "Suppliers", icon: Truck, notifications: 0 },
  { id: "purchase-orders", label: "Purchase Orders", icon: ClipboardList, notifications: 1 },
  { id: "billing", label: "Billing", icon: Receipt, notifications: 0 },
  { id: "insurance-claims", label: "Insurance Claims", icon: CreditCard, notifications: 3 },
  { id: "drug-interactions", label: "Drug Interactions", icon: Shield, notifications: 5 },
  { id: "expired-medicines", label: "Expired Medicines", icon: AlertTriangle, notifications: 2 },
  { id: "user-management", label: "User Management", icon: UserCheck, notifications: 0 },
  { id: "notifications", label: "Notifications", icon: Bell, notifications: 8 },
  { id: "audit-logs", label: "Audit Logs", icon: Activity, notifications: 0 },
  { id: "reports", label: "Reports", icon: BarChart3, notifications: 0 },
  { id: "settings", label: "Settings", icon: Settings, notifications: 0 },
];

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">PharmaCare</h2>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="p-2"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200 hover:scale-105",
                  collapsed && !isMobile && "px-2",
                  isActive && "shadow-md"
                )}
                onClick={() => handlePageChange(item.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center w-full">
                  <Icon size={20} className="flex-shrink-0" />
                  {(!collapsed || isMobile) && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {item.notifications > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                        >
                          {item.notifications > 9 ? "9+" : item.notifications}
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && !isMobile && item.notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center space-x-3 p-3 bg-gray-50 rounded-lg",
          collapsed && !isMobile && "justify-center"
        )}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-600">admin@pharmacare.com</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
        >
          <Menu size={20} />
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 md:hidden transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden md:flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
};