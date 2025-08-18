import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Download } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CustomerStats } from "./customers/CustomerStats";
import { CustomerTable } from "./customers/CustomerTable";
import { CustomerForm } from "./customers/CustomerForm";
import { CustomerDetails } from "./customers/CustomerDetails";
import { useCustomers } from "./customers/hooks/useCustomers";
import { Customer, CustomerFormData } from "./customers/types";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your customer database and relationships</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                  </motion.div>
                </DialogTrigger>
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
            </div>
          </div>
        </FadeIn>

        <CustomerStats stats={stats} />

        {/* Search and Filters */}
        <FadeIn delay={200}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
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
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <CustomerTable
          customers={customers}
          onView={handleViewCustomer}
          onEdit={handleEditClick}
          onDelete={handleDeleteCustomer}
          isLoading={isLoading}
        />

        {/* View Customer Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {viewingCustomer && <CustomerDetails customer={viewingCustomer} />}
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
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
      </div>
    </div>
  );
};