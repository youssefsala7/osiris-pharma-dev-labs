import { useState, useMemo } from "react";
import { Prescription, PrescriptionFormData, PrescriptionStats } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX-001",
    patientName: "John Doe",
    patientId: "CUST-001",
    doctorName: "Dr. Sarah Wilson",
    doctorLicense: "MD-12345",
    medications: [
      {
        medicineId: "MED-002",
        medicineName: "Amoxicillin 250mg",
        dosage: "250mg",
        frequency: "3 times daily",
        duration: "7 days",
        quantity: 21,
        instructions: "Take with food",
        substitutionAllowed: false
      }
    ],
    issueDate: "2024-01-15",
    expiryDate: "2024-07-15",
    status: "Active",
    notes: "Patient has mild penicillin allergy - monitor for reactions",
    refillsRemaining: 2,
    totalRefills: 3,
    priority: "Medium"
  },
  {
    id: "RX-002",
    patientName: "Jane Smith",
    patientId: "CUST-002",
    doctorName: "Dr. Michael Brown",
    doctorLicense: "MD-67890",
    medications: [
      {
        medicineId: "MED-001",
        medicineName: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "Every 6 hours as needed",
        duration: "As needed",
        quantity: 30,
        instructions: "Do not exceed 4 doses in 24 hours",
        substitutionAllowed: true
      }
    ],
    issueDate: "2024-01-14",
    expiryDate: "2024-07-14",
    status: "Filled",
    notes: "",
    refillsRemaining: 0,
    totalRefills: 1,
    priority: "Low"
  },
  {
    id: "RX-003",
    patientName: "Mike Johnson",
    patientId: "CUST-003",
    doctorName: "Dr. Emily Davis",
    doctorLicense: "MD-11111",
    medications: [
      {
        medicineId: "MED-003",
        medicineName: "Ibuprofen 400mg",
        dosage: "400mg",
        frequency: "2 times daily",
        duration: "14 days",
        quantity: 28,
        instructions: "Take with food to avoid stomach upset",
        substitutionAllowed: true
      }
    ],
    issueDate: "2024-01-10",
    expiryDate: "2024-07-10",
    status: "Active",
    notes: "Patient reports chronic back pain",
    refillsRemaining: 1,
    totalRefills: 2,
    priority: "High"
  },
];

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const matchesSearch = prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || prescription.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [prescriptions, searchTerm, statusFilter, priorityFilter]);

  const stats: PrescriptionStats = useMemo(() => {
    const activePrescriptions = prescriptions.filter(p => p.status === "Active").length;
    const expiringSoon = prescriptions.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow && p.status === "Active";
    }).length;
    const filledToday = prescriptions.filter(p => {
      const today = new Date().toISOString().split('T')[0];
      return p.status === "Filled" && p.issueDate === today;
    }).length;

    return {
      totalPrescriptions: prescriptions.length,
      activePrescriptions,
      expiringSoon,
      filledToday
    };
  }, [prescriptions]);

  const addPrescription = async (prescriptionData: PrescriptionFormData) => {
    if (!prescriptionData.patientName || !prescriptionData.doctorName) {
      showError("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prescription: Prescription = {
        id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
        patientName: prescriptionData.patientName,
        patientId: prescriptionData.patientId || `CUST-${String(prescriptions.length + 1).padStart(3, '0')}`,
        doctorName: prescriptionData.doctorName,
        doctorLicense: prescriptionData.doctorLicense || "",
        medications: prescriptionData.medications || [],
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: prescriptionData.expiryDate || "",
        status: "Active",
        notes: prescriptionData.notes || "",
        refillsRemaining: Number(prescriptionData.refillsRemaining) || 0,
        totalRefills: Number(prescriptionData.totalRefills) || 0,
        priority: prescriptionData.priority || "Medium"
      };
      
      setPrescriptions(prev => [prescription, ...prev]);
      showSuccess("Prescription added successfully!");
      return true;
    } catch (error) {
      showError("Failed to add prescription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrescription = async (updatedPrescription: Prescription) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPrescriptions(prev => prev.map(prescription => 
        prescription.id === updatedPrescription.id ? updatedPrescription : prescription
      ));
      showSuccess("Prescription updated successfully!");
      return true;
    } catch (error) {
      showError("Failed to update prescription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fillPrescription = async (prescriptionId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPrescriptions(prev => prev.map(prescription => 
        prescription.id === prescriptionId 
          ? { ...prescription, status: "Filled" as const, refillsRemaining: Math.max(0, prescription.refillsRemaining - 1) }
          : prescription
      ));
      showSuccess("Prescription filled successfully!");
      return true;
    } catch (error) {
      showError("Failed to fill prescription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPrescription = async (prescriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel this prescription?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPrescriptions(prev => prev.map(prescription => 
        prescription.id === prescriptionId 
          ? { ...prescription, status: "Cancelled" as const }
          : prescription
      ));
      showSuccess("Prescription cancelled successfully!");
      return true;
    } catch (error) {
      showError("Failed to cancel prescription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportPrescriptions = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ["Prescription ID", "Patient", "Doctor", "Status", "Issue Date", "Expiry Date", "Priority"].join(","),
        ...filteredPrescriptions.map(prescription => [
          prescription.id, prescription.patientName, prescription.doctorName, 
          prescription.status, prescription.issueDate, prescription.expiryDate, prescription.priority
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prescriptions-export.csv";
      a.click();
      
      showSuccess("Prescription data exported successfully!");
      return true;
    } catch (error) {
      showError("Failed to export data");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prescriptions: filteredPrescriptions,
    allPrescriptions: prescriptions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    stats,
    isLoading,
    addPrescription,
    updatePrescription,
    fillPrescription,
    cancelPrescription,
    exportPrescriptions
  };
};