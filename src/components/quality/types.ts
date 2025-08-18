export interface QualityCheck {
  id: string;
  type: "batch-testing" | "storage-conditions" | "expiry-verification" | "supplier-audit" | "documentation" | "temperature-log";
  medicineId?: string;
  medicineName?: string;
  batchNumber?: string;
  checkDate: string;
  inspector: string;
  status: "passed" | "failed" | "pending" | "requires-attention";
  priority: "low" | "medium" | "high" | "critical";
  findings: string;
  corrective_actions: string;
  compliance_standards: string[];
  next_check_date?: string;
  attachments?: string[];
  cost_impact?: number;
}

export interface ComplianceMetric {
  standard: string;
  current_score: number;
  target_score: number;
  last_audit: string;
  status: "compliant" | "non-compliant" | "needs-improvement";
}

export interface QualityCheckFormData extends Partial<QualityCheck> {}

export interface QualityFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

export interface QualityStats {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
}