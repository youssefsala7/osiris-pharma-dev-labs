import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Package,
  Users,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings as SettingsIcon,
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
  Building2,
  LogOut,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: any;
  notifications?: number;
  requiredRoles?: Array<'owner'|'admin'|'manager'|'pharmacist'|'cashier'|'inventory_manager'>;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

const groups: NavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "sales", label: "POS", icon: ShoppingCart },
      { id: "inventory", label: "Inventory", icon: Package, notifications: 4 },
      { id: "prescriptions", label: "Prescriptions", icon: FileText, notifications: 2 },
      { id: "suppliers", label: "Suppliers", icon: Truck, requiredRoles: ['owner','admin','manager'] },
      { id: "purchase-orders", label: "Purchase Orders", icon: ClipboardList, notifications: 1, requiredRoles: ['owner','admin','manager'] },
    ],
    defaultOpen: true,
  },
  {
    id: "people",
    label: "People",
    items: [
      { id: "customers", label: "Customers", icon: Users },
      { id: "user-management", label: "User Management", icon: UserCheck, requiredRoles: ['owner','admin'] },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { id: "billing", label: "Billing", icon: Receipt },
      { id: "insurance-claims", label: "Insurance Claims", icon: CreditCard, notifications: 3 },
      { id: "reports", label: "Reports", icon: BarChart3, requiredRoles: ['owner','admin','manager'] },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    items: [
      { id: "drug-interactions", label: "Drug Interactions", icon: Shield, notifications: 5 },
      { id: "expired-medicines", label: "Expired Medicines", icon: AlertTriangle, notifications: 2 },
      { id: "audit-logs", label: "Audit Logs", icon: Activity, requiredRoles: ['owner','admin'] },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "notifications", label: "Notifications", icon: Bell, notifications: 8 },
      { id: "settings", label: "Settings", icon: SettingsIcon, requiredRoles: ['owner','admin'] },
    ],
  },
];

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const { organization, organizations, membership, profile, switchOrganization, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile) setMobileOpen(false);
  };

  const hasAccess = (item: NavItem) => {
    if (profile?.role === 'platform_owner') return true;
    if (!item.requiredRoles) return true;
    if (!membership) return false;
    return item.requiredRoles.includes(membership.role);
  };

  const NavButton = ({ item, index }: { item: NavItem; index: number }) => {
    if (!hasAccess(item)) return null;
    const Icon = item.icon;
    const isActive = currentPage === item.id;

    const buttonEl = (
      <Button
        key={item.id}
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start transition-all duration-200 hover:scale-[1.015]",
          collapsed && !isMobile && "px-2",
          isActive && "shadow-md"
        )}
        onClick={() => handlePageChange(item.id)}
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <div className="flex items-center w-full relative">
          <Icon size={20} className="flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <>
              <span className="ml-3 flex-1 text-left">{item.label}</span>
              {item.notifications && item.notifications > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs">
                  {item.notifications > 9 ? "9+" : item.notifications}
                </Badge>
              )}
            </>
          )}
          {collapsed && !isMobile && item.notifications && item.notifications > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </Button>
    );

    if (collapsed && !isMobile) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }
    return buttonEl;
  };

  const orgInitials = (organization?.name || "Pharmacy")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const header = (
    <div className="p-4 border-b border-gray-200">
      <div className={cn("flex items-center justify-between", collapsed && !isMobile && "justify-center")}>
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto justify-start">
                <div className="flex items-center space-x-2">
                  {organization?.logo_url ? (
                    <img
                      src={organization.logo_url}
                      alt={organization.name}
                      className="w-8 h-8 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {organization ? orgInitials : <Building2 className="h-4 w-4" />}
                    </div>
                  )}
                  <div className="text-left">
                    <h2 className="text-base font-bold text-gray-800 truncate max-w-[160px]">
                      {organization?.name || "Select Organization"}
                    </h2>
                    <div className="flex items-center space-x-1">
                      {membership && <Badge variant="outline" className="text-xs">{membership.role}</Badge>}
                      {profile?.role === 'platform_owner' && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Platform
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => switchOrganization(org.id)}
                  className={org.id === organization?.id ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{org.name}</span>
                    {org.id === organization?.id && <Badge variant="default" className="text-xs ml-auto">Current</Badge>}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {profile?.role === 'platform_owner' && (
                <DropdownMenuItem onClick={() => handlePageChange('platform-admin')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Platform Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close menu">
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );

  const pinned = (
    <div className="p-3 border-b border-gray-200">
      <div className="flex gap-2">
        <Button
          variant={currentPage === "sales" ? "default" : "outline"}
          size="sm"
          className={cn("flex-1", collapsed && !isMobile && "justify-center px-2")}
          onClick={() => handlePageChange("sales")}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {(!collapsed || isMobile) && <span>POS</span>}
        </Button>
        <Button
          variant={currentPage === "dashboard" ? "default" : "outline"}
          size="sm"
          className={cn("flex-1", collapsed && !isMobile && "justify-center px-2")}
          onClick={() => handlePageChange("dashboard")}
        >
          <Home className="h-4 w-4 mr-2" />
          {(!collapsed || isMobile) && <span>Dashboard</span>}
        </Button>
      </div>
    </div>
  );

  const groupsView = (
    <ScrollArea className="flex-1 p-2">
      <Accordion
        type="multiple"
        defaultValue={groups.filter(g => g.defaultOpen).map(g => g.id)}
        className="space-y-2"
      >
        {groups.map((group) => {
          const visible = group.items.filter(hasAccess);
          if (visible.length === 0) return null;
          return (
            <AccordionItem key={group.id} value={group.id} className="border-none">
              <AccordionTrigger
                className={cn(
                  "px-2 py-2 rounded-md text-xs uppercase tracking-wide text-gray-500 hover:no-underline",
                  collapsed && !isMobile && "justify-center"
                )}
              >
                {!collapsed || isMobile ? <span className="pl-2">{group.label}</span> : <span className="sr-only">{group.label}</span>}
              </AccordionTrigger>
              <AccordionContent className={cn("px-2", collapsed && !isMobile && "px-0")}>
                <div className="space-y-1">
                  {visible.map((item, idx) => (
                    <NavButton key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ScrollArea>
  );

  const userCard = (
    <div className={cn("p-4 border-t border-gray-200", collapsed && !isMobile && "flex items-center justify-center")}>
      <div className={cn("flex items-center space-x-3 p-3 bg-gray-50 rounded-lg w-full", collapsed && !isMobile && "justify-center")}>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{(profile?.first_name || 'A')[0]}</span>
        </div>
        {(!collapsed || isMobile) && (
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{profile?.first_name || 'User'}</p>
            <p className="text-xs text-gray-600">{membership?.role || 'member'}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
        {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}
        <div
          className={cn(
            "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 md:hidden transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {header}
          {pinned}
          {groupsView}
          {userCard}
        </div>
      </>
    );
  }

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300 hidden md:flex flex-col", collapsed ? "w-16" : "w-64")}>
      {header}
      {pinned}
      {groupsView}
      {userCard}
    </div>
  );
};