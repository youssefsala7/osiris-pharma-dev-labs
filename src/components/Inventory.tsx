import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryStats } from "./inventory/InventoryStats";
import { SearchAndFilters } from "./inventory/SearchAndFilters";
import { MedicineTable } from "./inventory/MedicineTable";
import { MedicineForm } from "./inventory/MedicineForm";
import { MedicineDetails } from "./inventory/MedicineDetails";
import { useInventory } from "./inventory/hooks/useInventory";
import { Medicine, MedicineFormData } from "./inventory/types";
import { motion } from "framer-motion";
import { FadeIn } from "./ui/fade-in";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <InventoryHeader
            onExport={handleExportData}
            onAddMedicine={() => setIsAddDialogOpen(true)}
            isLoading={isLoading}
          />
        </FadeIn>

        <InventoryStats stats={stats} />

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
      </div>
    </div>
  );
};