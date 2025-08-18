export interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorLicense: string;
  medications: PrescriptionMedication[];
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Filled" | "Expired" | "Cancelled";
  notes: string;
  refillsRemaining: number;
  totalRefills: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
}

export interface PrescriptionMedication {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  substitutionAllowed: boolean;
}

export interface PrescriptionStats {
  totalPrescriptions: number;
  activePrescriptions: number;
  expiringSoon: number;
  filledToday: number;
}

export interface PrescriptionFormData extends Partial<Prescription> {}