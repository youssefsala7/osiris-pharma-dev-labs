import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Users, Shield, UserCheck, UserX, Download } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccess } from "@/utils/toast";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: "Admin" | "Pharmacist" | "Cashier" | "Manager" | "Inventory Manager";
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  createdDate: string;
  permissions: string[];
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "USR-001",
      username: "admin",
      fullName: "System Administrator",
      email: "admin@pharmacare.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15 09:30:00",
      createdDate: "2023-01-01",
      permissions: ["all"]
    },
    {
      id: "USR-002",
      username: "john.pharmacist",
      fullName: "John Smith",
      email: "john.smith@pharmacare.com",
      phone: "+1 (555) 234-5678",
      role: "Pharmacist",
      status: "Active",
      lastLogin: "2024-01-15 08:45:00",
      createdDate: "2023-03-15",
      permissions: ["prescriptions", "inventory", "customers"]
    },
    {
      id: "USR-003",
      username: "sarah.cashier",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@pharmacare.com",
      phone: "+1 (555) 345-6789",
      role: "Cashier",
      status: "Active",
      lastLogin: "2024-01-15 10:15:00",
      createdDate: "2023-06-20",
      permissions: ["sales", "customers"]
    },
    {
      id: "USR-004",
      username: "mike.manager",
      fullName: "Mike Davis",
      email: "mike.davis@pharmacare.com",
      phone: "+1 (555) 456-7890",
      role: "Manager",
      status: "Active",
      lastLogin: "2024-01-14 16:20:00",
      createdDate: "2023-02-10",
      permissions: ["reports", "inventory", "sales", "customers"]
    },
  ]);

  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.username && newUser.fullName && newUser.email && newUser.role) {
      const user: User = {
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone || "",
        role: newUser.role,
        status: "Active",
        lastLogin: "Never",
        createdDate: new Date().toISOString().split('T')[0],
        permissions: getDefaultPermissions(newUser.role),
      };
      
      setUsers([...users, user]);
      setNewUser({});
      setIsAddDialogOpen(false);
      showSuccess("User added successfully!");
    }
  };

  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case "Admin": return ["all"];
      case "Pharmacist": return ["prescriptions", "inventory", "customers"];
      case "Cashier": return ["sales", "customers"];
      case "Manager": return ["reports", "inventory", "sales", "customers"];
      case "Inventory Manager": return ["inventory", "suppliers", "purchase-orders"];
      default: return [];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "destructive";
      case "Pharmacist": return "default";
      case "Manager": return "secondary";
      case "Cashier": return "outline";
      case "Inventory Manager": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Suspended": return "destructive";
      default: return "secondary";
    }
  };

  const activeUsers = users.filter(u => u.status === "Active").length;
  const totalUsers = users.length;

  const headerActions = (
    <>
      <Button variant="outline" className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </>
  );

  return (
    <PageContainer
      title="User Management"
      subtitle="Manage system users, roles, and permissions"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={<UserCheck className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Inactive Users"
          value={totalUsers - activeUsers}
          icon={<UserX className="h-8 w-8 text-red-600" />}
        />
        <StatCard
          title="Admin Users"
          value={users.filter(u => u.role === "Admin").length}
          icon={<Shield className="h-8 w-8 text-purple-600" />}
        />
      </ResponsiveGrid>

      {/* Search */}
      <StandardCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name, username, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </StandardCard>

      {/* Users Table */}
      <StandardCard title={`System Users (${filteredUsers.length} users)`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>User Details</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleColor(user.role) as any}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(user.status) as any}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StandardCard>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUser.username || ""}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUser.fullName || ""}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email || ""}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUser.phone || ""}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setNewUser({...newUser, role: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddUser} className="w-full">
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};