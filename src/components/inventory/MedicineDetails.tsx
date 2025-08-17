import { Label } from "@/components/ui/label";
import { Medicine } from "./types";

interface MedicineDetailsProps {
  medicine: Medicine;
}

export const MedicineDetails = ({ medicine }: MedicineDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Medicine ID</Label>
          <p className="font-medium">{medicine.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Name</Label>
          <p className="font-medium">{medicine.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Category</Label>
          <p>{medicine.category}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Strength</Label>
          <p>{medicine.strength}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Stock</Label>
          <p>{medicine.stock}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Min Stock</Label>
          <p>{medicine.minStock}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Price</Label>
          <p>${medicine.price.toFixed(2)}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Dosage Form</Label>
          <p>{medicine.dosageForm}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-600">Description</Label>
        <p className="text-sm">{medicine.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Batch Number</Label>
          <p className="font-mono text-sm">{medicine.batchNumber}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
          <p>{medicine.expiryDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Supplier</Label>
          <p>{medicine.supplier}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Manufacturer</Label>
          <p>{medicine.manufacturer}</p>
        </div>
      </div>
    </div>
  );
};