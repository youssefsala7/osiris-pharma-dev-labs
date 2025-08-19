import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Download } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { CustomerStats } from "./customers/CustomerStats";
import { CustomerTable } from "./customers/CustomerTable";
import { CustomerForm } from "./customers/CustomerForm";
import { CustomerDetails } from "./customers/CustomerDetails";
import { useCustomers } from "./customers/hooks/useCustomers";
import { Customer, CustomerFormData } from "./customers/types";
import { Users, UserCheck, UserPlus, DollarSign } from "lucide-react";

export const Customers = () => {
  const {
    customers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    exportCustomers
  } = useCustomers();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [newCustomerData, setNewCustomerData] = useState<CustomerFormData>({});
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = async () => {
    const success = await addCustomer(newCustomerData);
    if (success) {
      setNewCustomerData({});
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCustomer = async () => {
    if (editingCustomer) {
      const success = await updateCustomer(editingCustomer);
      if (success) {
        setEditingCustomer(null);
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
  };

  const handleExportData = () => {
    exportCustomers();
  };

  const headerActions = (
    <>
      <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Customer Management"
      subtitle="Manage your customer database and relationships"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={<UserCheck className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="New This Month"
          value={stats.newCustomers}
          icon={<UserPlus className="h-8 w-8 text-purple-600" />}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<DollarSign className="h-8 w-8 text-orange-600" />}
          prefix="$"
        />
      </ResponsiveGrid>

      {/* Search and Filters */}
      <StandardCard>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </StandardCard>

      <CustomerTable
        customers={customers}
        onView={handleViewCustomer}
        onEdit={handleEditClick}
        onDelete={handleDeleteCustomer}
        isLoading={isLoading}
      />

      {/* Dialogs */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            formData={newCustomerData}
            onFormDataChange={setNewCustomerData}
            onSubmit={handleAddCustomer}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && <CustomerDetails customer={viewingCustomer} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm
              formData={editingCustomer}
              onFormDataChange={(data) => setEditingCustomer({ ...editingCustomer, ...data })}
              onSubmit={handleEditCustomer}
              isLoading={isLoading}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};