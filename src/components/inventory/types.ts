export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  supplier: string;
  description: string;
  batchNumber: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
}

export interface InventoryStats {
  totalMedicines: number;
  lowStockCount: number;
  totalValue: number;
  categoriesCount: number;
}

export interface MedicineFormData extends Partial<Medicine> {}