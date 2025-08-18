export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  totalPurchases: number;
  lastVisit: string;
  status: "Active" | "Inactive";
  insuranceProvider?: string;
  policyNumber?: string;
  emergencyContact?: string;
  allergies?: string[];
  medicalConditions?: string[];
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  totalRevenue: number;
}

export interface CustomerFormData extends Partial<Customer> {}