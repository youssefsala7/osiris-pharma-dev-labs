import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { SearchAndFilters } from "./inventory/SearchAndFilters";
import { MedicineTable } from "./inventory/MedicineTable";
import { MedicineForm } from "./inventory/MedicineForm";
import { MedicineDetails } from "./inventory/MedicineDetails";
import { useInventory } from "./inventory/hooks/useInventory";
import { Medicine, MedicineFormData } from "./inventory/types";
import { Package, AlertTriangle, Filter, DollarSign } from "lucide-react";

export const Inventory = () => {
  const {
    medicines,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    stats,
    isLoading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    exportData
  } = useInventory();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [newMedicineData, setNewMedicineData] = useState<MedicineFormData>({});
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);

  const handleAddMedicine = async () => {
    const success = await addMedicine(newMedicineData);
    if (success) {
      setNewMedicineData({});
      setIsAddDialogOpen(false);
    }
  };

  const handleEditMedicine = async () => {
    if (editingMedicine) {
      const success = await updateMedicine(editingMedicine);
      if (success) {
        setEditingMedicine(null);
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleViewMedicine = (medicine: Medicine) => {
    setViewingMedicine(medicine);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMedicine = (id: string) => {
    deleteMedicine(id);
  };

  const handleExportData = () => {
    exportData();
  };

  const headerActions = (
    <>
      <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Medicine
      </Button>
    </>
  );

  return (
    <PageContainer
      title="Inventory Management"
      subtitle="Manage your medicine stock and inventory"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={<Package className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
        />
        <StatCard
          title="Total Value"
          value={stats.totalValue}
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          prefix="$"
        />
        <StatCard
          title="Categories"
          value={stats.categoriesCount}
          icon={<Filter className="h-8 w-8 text-purple-600" />}
        />
      </ResponsiveGrid>

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <MedicineTable
        medicines={medicines}
        onView={handleViewMedicine}
        onEdit={handleEditClick}
        onDelete={handleDeleteMedicine}
        isLoading={isLoading}
      />

      {/* Add Medicine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <MedicineForm
            formData={newMedicineData}
            onFormDataChange={setNewMedicineData}
            onSubmit={handleAddMedicine}
            isLoading={isLoading}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          {editingMedicine && (
            <MedicineForm
              formData={editingMedicine}
              onFormDataChange={(data) => setEditingMedicine({ ...editingMedicine, ...data })}
              onSubmit={handleEditMedicine}
              isLoading={isLoading}
              categories={categories}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Medicine Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medicine Details</DialogTitle>
          </DialogHeader>
          {viewingMedicine && <MedicineDetails medicine={viewingMedicine} />}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};