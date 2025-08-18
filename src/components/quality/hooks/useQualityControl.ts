import { useState, useMemo } from "react";
import { QualityCheck, ComplianceMetric, QualityCheckFormData, QualityFilters, QualityStats } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_QUALITY_CHECKS: QualityCheck[] = [
  {
    id: "QC-001",
    type: "batch-testing",
    medicineId: "MED-001",
    medicineName: "Paracetamol 500mg",
    batchNumber: "PAR-2024-001",
    checkDate: "2024-01-15",
    inspector: "Dr. Sarah Wilson",
    status: "passed",
    priority: "high",
    findings: "All quality parameters within acceptable limits. Potency: 98.5%, Dissolution: 95.2%",
    corrective_actions: "None required",
    compliance_standards: ["USP", "FDA", "GMP"],
    next_check_date: "2024-04-15",
    cost_impact: 0
  },
  {
    id: "QC-002",
    type: "storage-conditions",
    checkDate: "2024-01-14",
    inspector: "Mike Johnson",
    status: "requires-attention",
    priority: "medium",
    findings: "Temperature fluctuation detected in cold storage unit between 2-8°C range",
    corrective_actions: "Calibrate temperature control system, increase monitoring frequency",
    compliance_standards: ["WHO", "FDA"],
    next_check_date: "2024-01-21",
    cost_impact: 1500
  },
  {
    id: "QC-003",
    type: "supplier-audit",
    checkDate: "2024-01-12",
    inspector: "Quality Team",
    status: "failed",
    priority: "critical",
    findings: "Supplier documentation incomplete, missing certificates of analysis for 3 batches",
    corrective_actions: "Request missing documentation, consider supplier review meeting",
    compliance_standards: ["GMP", "ISO"],
    next_check_date: "2024-01-19",
    cost_impact: 5000
  },
  {
    id: "QC-004",
    type: "expiry-verification",
    medicineId: "MED-003",
    medicineName: "Vitamin C 500mg",
    batchNumber: "VC-2024-012",
    checkDate: "2024-01-10",
    inspector: "Dr. Emily Davis",
    status: "passed",
    priority: "low",
    findings: "Expiry dates properly labeled and within shelf life limits",
    corrective_actions: "Continue regular monitoring",
    compliance_standards: ["FDA", "USP"],
    next_check_date: "2024-04-10"
  }
];

const COMPLIANCE_METRICS: ComplianceMetric[] = [
  {
    standard: "FDA Compliance",
    current_score: 94.5,
    target_score: 95.0,
    last_audit: "2024-01-01",
    status: "needs-improvement"
  },
  {
    standard: "GMP Standards",
    current_score: 97.2,
    target_score: 95.0,
    last_audit: "2023-12-15",
    status: "compliant"
  },
  {
    standard: "WHO Guidelines",
    current_score: 92.8,
    target_score: 95.0,
    last_audit: "2024-01-05",
    status: "needs-improvement"
  },
  {
    standard: "ISO 9001",
    current_score: 89.5,
    target_score: 90.0,
    last_audit: "2023-11-20",
    status: "non-compliant"
  }
];

export const useQualityControl = () => {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(INITIAL_QUALITY_CHECKS);
  const [filters, setFilters] = useState<QualityFilters>({
    searchTerm: "",
    statusFilter: "all",
    typeFilter: "all"
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredChecks = useMemo(() => {
    return qualityChecks.filter(check => {
      const matchesSearch = check.medicineName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           check.inspector.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           check.findings.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStatus = filters.statusFilter === "all" || check.status === filters.statusFilter;
      const matchesType = filters.typeFilter === "all" || check.type === filters.typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [qualityChecks, filters]);

  const stats: QualityStats = useMemo(() => ({
    totalChecks: qualityChecks.length,
    passedChecks: qualityChecks.filter(c => c.status === "passed").length,
    failedChecks: qualityChecks.filter(c => c.status === "failed").length,
    pendingChecks: qualityChecks.filter(c => c.status === "pending").length,
  }), [qualityChecks]);

  const addQualityCheck = async (checkData: QualityCheckFormData) => {
    if (!checkData.type || !checkData.inspector || !checkData.findings) {
      showError("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const check: QualityCheck = {
        id: `QC-${String(qualityChecks.length + 1).padStart(3, '0')}`,
        type: checkData.type,
        medicineId: checkData.medicineId,
        medicineName: checkData.medicineName,
        batchNumber: checkData.batchNumber,
        checkDate: new Date().toISOString().split('T')[0],
        inspector: checkData.inspector,
        status: checkData.status || "pending",
        priority: checkData.priority || "medium",
        findings: checkData.findings,
        corrective_actions: checkData.corrective_actions || "",
        compliance_standards: checkData.compliance_standards || [],
        next_check_date: checkData.next_check_date,
        cost_impact: checkData.cost_impact || 0
      };
      
      setQualityChecks(prev => [check, ...prev]);
      showSuccess("Quality check added successfully!");
      return true;
    } catch (error) {
      showError("Failed to add quality check");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQualityCheck = async (updatedCheck: QualityCheck) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setQualityChecks(prev => prev.map(check => 
        check.id === updatedCheck.id ? updatedCheck : check
      ));
      showSuccess("Quality check updated successfully!");
      return true;
    } catch (error) {
      showError("Failed to update quality check");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQualityCheck = async (checkId: string) => {
    if (!window.confirm("Are you sure you want to delete this quality check?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQualityChecks(prev => prev.filter(check => check.id !== checkId));
      showSuccess("Quality check deleted successfully!");
      return true;
    } catch (error) {
      showError("Failed to delete quality check");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportQualityReport = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ["Check ID", "Type", "Medicine", "Inspector", "Status", "Priority", "Date"].join(","),
        ...filteredChecks.map(check => [
          check.id, check.type, check.medicineName || "N/A", check.inspector, 
          check.status, check.priority, check.checkDate
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quality-control-report.csv";
      a.click();
      
      showSuccess("Quality report exported successfully!");
      return true;
    } catch (error) {
      showError("Failed to export report");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    qualityChecks: filteredChecks,
    allQualityChecks: qualityChecks,
    complianceMetrics: COMPLIANCE_METRICS,
    filters,
    setFilters,
    stats,
    isLoading,
    addQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
    exportQualityReport
  };
};