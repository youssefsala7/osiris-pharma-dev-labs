import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Edit } from "lucide-react";
import { CustomerFormData } from "./types";
import { useState } from "react";

interface CustomerFormProps {
  formData: CustomerFormData;
  onFormDataChange: (data: CustomerFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEditing?: boolean;
}

export const CustomerForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
  isEditing = false
}: CustomerFormProps) => {
  const [allergiesInput, setAllergiesInput] = useState(formData.allergies?.join(", ") || "");
  const [conditionsInput, setConditionsInput] = useState(formData.medicalConditions?.join(", ") || "");

  const updateFormData = (field: keyof CustomerFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleAllergiesChange = (value: string) => {
    setAllergiesInput(value);
    const allergiesArray = value.split(",").map(item => item.trim()).filter(item => item);
    updateFormData('allergies', allergiesArray);
  };

  const handleConditionsChange = (value: string) => {
    setConditionsInput(value);
    const conditionsArray = value.split(",").map(item => item.trim()).filter(item => item);
    updateFormData('medicalConditions', conditionsArray);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ""}
          onChange={(e) => updateFormData('address', e.target.value)}
          placeholder="Enter address"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact || ""}
            onChange={(e) => updateFormData('emergencyContact', e.target.value)}
            placeholder="Enter emergency contact"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Select 
            value={formData.insuranceProvider || ""} 
            onValueChange={(value) => updateFormData('insuranceProvider', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select insurance provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
              <SelectItem value="Aetna">Aetna</SelectItem>
              <SelectItem value="Cigna">Cigna</SelectItem>
              <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
              <SelectItem value="Humana">Humana</SelectItem>
              <SelectItem value="Medicare">Medicare</SelectItem>
              <SelectItem value="Medicaid">Medicaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="policyNumber">Policy Number</Label>
          <Input
            id="policyNumber"
            value={formData.policyNumber || ""}
            onChange={(e) => updateFormData('policyNumber', e.target.value)}
            placeholder="Enter policy number"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="allergies">Allergies (comma-separated)</Label>
        <Input
          id="allergies"
          value={allergiesInput}
          onChange={(e) => handleAllergiesChange(e.target.value)}
          placeholder="e.g., Penicillin, Sulfa, Latex"
        />
      </div>
      
      <div>
        <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
        <Input
          id="conditions"
          value={conditionsInput}
          onChange={(e) => handleConditionsChange(e.target.value)}
          placeholder="e.g., Hypertension, Diabetes, Asthma"
        />
      </div>
      
      <Button onClick={onSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : isEditing ? (
          <Edit className="h-4 w-4 mr-2" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        {isEditing ? "Update Customer" : "Add Customer"}
      </Button>
    </div>
  );
};