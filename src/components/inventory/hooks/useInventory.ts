import { useState, useMemo } from "react";
import { Medicine, MedicineFormData, InventoryStats } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: "MED-001",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    stock: 150,
    minStock: 50,
    price: 2.50,
    expiryDate: "2025-06-15",
    supplier: "PharmaCorp Ltd",
    description: "Pain and fever relief tablets",
    batchNumber: "PAR-2024-001",
    manufacturer: "PharmaCorp Ltd",
    dosageForm: "Tablet",
    strength: "500mg"
  },
  {
    id: "MED-002",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    stock: 75,
    minStock: 30,
    price: 8.75,
    expiryDate: "2024-12-20",
    supplier: "MediSupply Inc",
    description: "Antibiotic capsules for bacterial infections",
    batchNumber: "AMX-2024-002",
    manufacturer: "MediSupply Inc",
    dosageForm: "Capsule",
    strength: "250mg"
  },
  {
    id: "MED-003",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    stock: 22,
    minStock: 40,
    price: 3.25,
    expiryDate: "2025-03-10",
    supplier: "PharmaCorp Ltd",
    description: "Anti-inflammatory pain relief tablets",
    batchNumber: "IBU-2024-003",
    manufacturer: "PharmaCorp Ltd",
    dosageForm: "Tablet",
    strength: "400mg"
  },
];

const CATEGORIES = ["Pain Relief", "Antibiotics", "Vitamins", "Cold & Flu", "Digestive", "Cardiovascular"];

export const useInventory = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchTerm, selectedCategory]);

  const stats: InventoryStats = useMemo(() => {
    const lowStockCount = medicines.filter(med => med.stock <= med.minStock).length;
    const totalValue = medicines.reduce((sum, med) => sum + (med.stock * med.price), 0);
    
    return {
      totalMedicines: medicines.length,
      lowStockCount,
      totalValue,
      categoriesCount: CATEGORIES.length
    };
  }, [medicines]);

  const addMedicine = async (medicineData: MedicineFormData) => {
    if (!medicineData.name || !medicineData.category || !medicineData.stock || !medicineData.price) {
      showError("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const medicine: Medicine = {
        id: `MED-${String(medicines.length + 1).padStart(3, '0')}`,
        name: medicineData.name,
        category: medicineData.category,
        stock: Number(medicineData.stock),
        minStock: Number(medicineData.minStock) || 10,
        price: Number(medicineData.price),
        expiryDate: medicineData.expiryDate || "",
        supplier: medicineData.supplier || "",
        description: medicineData.description || "",
        batchNumber: medicineData.batchNumber || `BAT-${Date.now()}`,
        manufacturer: medicineData.manufacturer || medicineData.supplier || "",
        dosageForm: medicineData.dosageForm || "Tablet",
        strength: medicineData.strength || "",
      };
      
      setMedicines(prev => [...prev, medicine]);
      showSuccess("Medicine added successfully!");
      return true;
    } catch (error) {
      showError("Failed to add medicine");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedicine = async (updatedMedicine: Medicine) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMedicines(prev => prev.map(med => 
        med.id === updatedMedicine.id ? updatedMedicine : med
      ));
      showSuccess("Medicine updated successfully!");
      return true;
    } catch (error) {
      showError("Failed to update medicine");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedicine = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMedicines(prev => prev.filter(med => med.id !== id));
      showSuccess("Medicine deleted successfully!");
      return true;
    } catch (error) {
      showError("Failed to delete medicine");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ["ID", "Name", "Category", "Stock", "Price", "Expiry Date", "Supplier"].join(","),
        ...filteredMedicines.map(med => [
          med.id, med.name, med.category, med.stock, med.price, med.expiryDate, med.supplier
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory-export.csv";
      a.click();
      
      showSuccess("Inventory data exported successfully!");
      return true;
    } catch (error) {
      showError("Failed to export data");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    medicines: filteredMedicines,
    allMedicines: medicines,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories: CATEGORIES,
    stats,
    isLoading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    exportData
  };
};