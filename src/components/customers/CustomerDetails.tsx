import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Customer } from "./types";

interface CustomerDetailsProps {
  customer: Customer;
}

export const CustomerDetails = ({ customer }: CustomerDetailsProps) => {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Customer ID</Label>
          <p className="font-medium">{customer.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Status</Label>
          <div className="mt-1">
            <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
              {customer.status}
            </Badge>
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
        <p className="font-medium">{customer.name}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Email</Label>
          <p className="text-sm break-all">{customer.email}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Phone</Label>
          <p className="text-sm">{customer.phone}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-600">Address</Label>
        <p className="text-sm">{customer.address}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
          <p className="text-sm">{customer.dateOfBirth || "Not provided"}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
          <p className="text-sm">{customer.emergencyContact || "Not provided"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Insurance Provider</Label>
          <p className="text-sm">{customer.insuranceProvider || "Not provided"}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Policy Number</Label>
          <p className="text-sm font-mono">{customer.policyNumber || "Not provided"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Total Purchases</Label>
          <p className="text-lg font-bold text-green-600">${customer.totalPurchases.toFixed(2)}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Last Visit</Label>
          <p className="text-sm">{customer.lastVisit}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-600">Allergies</Label>
        <div className="mt-1 flex flex-wrap gap-1">
          {customer.allergies && customer.allergies.length > 0 ? (
            customer.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {allergy}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500">No known allergies</p>
          )}
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-600">Medical Conditions</Label>
        <div className="mt-1 flex flex-wrap gap-1">
          {customer.medicalConditions && customer.medicalConditions.length > 0 ? (
            customer.medicalConditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {condition}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500">No medical conditions recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};