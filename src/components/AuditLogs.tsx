import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, User, Package, FileText, Settings, Download, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: "Inventory" | "Sales" | "Customers" | "Prescriptions" | "Users" | "Settings" | "System";
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Success" | "Failed" | "Warning";
}

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "LOG-001",
      timestamp: "2024-01-15 14:30:25",
      userId: "USR-001",
      userName: "Admin User",
      action: "User Login",
      module: "System",
      details: "Successful login from admin dashboard",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Low",
      status: "Success"
    },
    {
      id: "LOG-002",
      timestamp: "2024-01-15 14:25:12",
      userId: "USR-002",
      userName: "John Smith",
      action: "Medicine Added",
      module: "Inventory",
      details: "Added new medicine: Paracetamol 500mg (Quantity: 100)",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Medium",
      status: "Success"
    },
    {
      id: "LOG-003",
      timestamp: "2024-01-15 14:20:45",
      userId: "USR-003",
      userName: "Sarah Johnson",
      action: "Sale Transaction",
      module: "Sales",
      details: "Processed sale INV-001 for customer John Doe ($45.50)",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Low",
      status: "Success"
    },
    {
      id: "LOG-004",
      timestamp: "2024-01-15 14:15:33",
      userId: "USR-001",
      userName: "Admin User",
      action: "User Created",
      module: "Users",
      details: "Created new user account: mike.manager (Role: Manager)",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "High",
      status: "Success"
    },
    {
      id: "LOG-005",
      timestamp: "2024-01-15 14:10:18",
      userId: "USR-004",
      userName: "Mike Davis",
      action: "Failed Login Attempt",
      module: "System",
      details: "Failed login attempt - incorrect password",
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Critical",
      status: "Failed"
    },
    {
      id: "LOG-006",
      timestamp: "2024-01-15 14:05:22",
      userId: "USR-002",
      userName: "John Smith",
      action: "Prescription Created",
      module: "Prescriptions",
      details: "Created prescription RX-001 for patient John Doe",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Medium",
      status: "Success"
    },
    {
      id: "LOG-007",
      timestamp: "2024-01-15 14:00:15",
      userId: "USR-001",
      userName: "Admin User",
      action: "Settings Modified",
      module: "Settings",
      details: "Updated pharmacy information and notification settings",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Medium",
      status: "Success"
    },
    {
      id: "LOG-008",
      timestamp: "2024-01-15 13:55:40",
      userId: "USR-003",
      userName: "Sarah Johnson",
      action: "Customer Updated",
      module: "Customers",
      details: "Updated customer information for Jane Smith (CUST-002)",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "Low",
      status: "Success"
    }
  ]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === "all" || log.module === selectedModule;
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    
    return matchesSearch && matchesModule && matchesSeverity;
  });

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Inventory": return <Package className="h-4 w-4" />;
      case "Sales": return <FileText className="h-4 w-4" />;
      case "Customers": return <User className="h-4 w-4" />;
      case "Prescriptions": return <FileText className="h-4 w-4" />;
      case "Users": return <User className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      case "System": return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "default";
      case "Failed": return "destructive";
      case "Warning": return "secondary";
      default: return "outline";
    }
  };

  const totalLogs = auditLogs.length;
  const failedActions = auditLogs.filter(log => log.status === "Failed").length;
  const criticalEvents = auditLogs.filter(log => log.severity === "Critical").length;
  const uniqueUsers = new Set(auditLogs.map(log => log.userId)).size;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track and monitor all system activities and user actions</p>
        </div>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Actions</p>
                <p className="text-2xl font-bold text-gray-900">{failedActions}</p>
              </div>
              <Badge variant="destructive" className="text-lg px-3 py-1">Failed</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Events</p>
                <p className="text-2xl font-bold text-gray-900">{criticalEvents}</p>
              </div>
              <Badge variant="destructive" className="text-lg px-3 py-1">Critical</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by action, user, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Customers">Customers</SelectItem>
                <SelectItem value="Prescriptions">Prescriptions</SelectItem>
                <SelectItem value="Users">Users</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Activity Log ({filteredLogs.length} events)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-sm text-gray-600">{log.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getModuleIcon(log.module)}
                      <span>{log.module}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={log.details}>
                      {log.details}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(log.severity) as any}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(log.status) as any}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};