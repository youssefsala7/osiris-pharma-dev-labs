import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Plus,
  Search,
  Download
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { showSuccess } from "@/utils/toast";

interface QualityCheck {
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

interface ComplianceMetric {
  standard: string;
  current_score: number;
  target_score: number;
  last_audit: string;
  status: "compliant" | "non-compliant" | "needs-improvement";
}

export const QualityControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([
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
  ]);

  const [complianceMetrics] = useState<ComplianceMetric[]>([
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
  ]);

  const [newCheck, setNewCheck] = useState<Partial<QualityCheck>>({
    status: "pending",
    priority: "medium"
  });

  const filteredChecks = qualityChecks.filter(check => {
    const matchesSearch = check.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.findings.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || check.status === statusFilter;
    const matchesType = typeFilter === "all" || check.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddCheck = () => {
    if (newCheck.type && newCheck.inspector && newCheck.findings) {
      const check: QualityCheck = {
        id: `QC-${String(qualityChecks.length + 1).padStart(3, '0')}`,
        type: newCheck.type,
        medicineId: newCheck.medicineId,
        medicineName: newCheck.medicineName,
        batchNumber: newCheck.batchNumber,
        checkDate: new Date().toISOString().split('T')[0],
        inspector: newCheck.inspector,
        status: newCheck.status || "pending",
        priority: newCheck.priority || "medium",
        findings: newCheck.findings,
        corrective_actions: newCheck.corrective_actions || "",
        compliance_standards: newCheck.compliance_standards || [],
        next_check_date: newCheck.next_check_date,
        cost_impact: newCheck.cost_impact || 0
      };
      
      setQualityChecks([check, ...qualityChecks]);
      setNewCheck({ status: "pending", priority: "medium" });
      setIsAddCheckOpen(false);
      showSuccess("Quality check added successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "default";
      case "failed": return "destructive";
      case "requires-attention": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "requires-attention": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "pending": return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant": return "text-green-600";
      case "non-compliant": return "text-red-600";
      case "needs-improvement": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const totalChecks = qualityChecks.length;
  const passedChecks = qualityChecks.filter(c => c.status === "passed").length;
  const failedChecks = qualityChecks.filter(c => c.status === "failed").length;
  const pendingChecks = qualityChecks.filter(c => c.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
            <p className="text-gray-600">Manage quality assurance and regulatory compliance</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            
            <Dialog open={isAddCheckOpen} onOpenChange={setIsAddCheckOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Quality Check
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Quality Check</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Check Type</Label>
                      <Select onValueChange={(value) => setNewCheck({...newCheck, type: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select check type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batch-testing">Batch Testing</SelectItem>
                          <SelectItem value="storage-conditions">Storage Conditions</SelectItem>
                          <SelectItem value="expiry-verification">Expiry Verification</SelectItem>
                          <SelectItem value="supplier-audit">Supplier Audit</SelectItem>
                          <SelectItem value="documentation">Documentation Review</SelectItem>
                          <SelectItem value="temperature-log">Temperature Log</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newCheck.priority} onValueChange={(value) => setNewCheck({...newCheck, priority: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medicineName">Medicine Name</Label>
                      <Input
                        id="medicineName"
                        value={newCheck.medicineName || ""}
                        onChange={(e) => setNewCheck({...newCheck, medicineName: e.target.value})}
                        placeholder="Enter medicine name (if applicable)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="batchNumber">Batch Number</Label>
                      <Input
                        id="batchNumber"
                        value={newCheck.batchNumber || ""}
                        onChange={(e) => setNewCheck({...newCheck, batchNumber: e.target.value})}
                        placeholder="Enter batch number (if applicable)"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="inspector">Inspector</Label>
                    <Input
                      id="inspector"
                      value={newCheck.inspector || ""}
                      onChange={(e) => setNewCheck({...newCheck, inspector: e.target.value})}
                      placeholder="Enter inspector name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="findings">Findings</Label>
                    <Textarea
                      id="findings"
                      value={newCheck.findings || ""}
                      onChange={(e) => setNewCheck({...newCheck, findings: e.target.value})}
                      placeholder="Enter detailed findings"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="corrective_actions">Corrective Actions</Label>
                    <Textarea
                      id="corrective_actions"
                      value={newCheck.corrective_actions || ""}
                      onChange={(e) => setNewCheck({...newCheck, corrective_actions: e.target.value})}
                      placeholder="Enter corrective actions taken or required"
                      rows={2}
                    />
                  </div>
                  
                  <Button onClick={handleAddCheck} className="w-full">
                    Add Quality Check
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </FadeIn>

      {/* Quality Metrics */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Checks</p>
                  <p className="text-2xl font-bold text-gray-900">{totalChecks}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{passedChecks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedChecks}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingChecks}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Compliance Standards */}
      <FadeIn delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Compliance Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceMetrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{metric.standard}</h3>
                    <Badge variant={metric.status === "compliant" ? "default" : metric.status === "non-compliant" ? "destructive" : "secondary"}>
                      {metric.status.replace("-", " ")}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Score</span>
                      <span className={getComplianceColor(metric.status)}>
                        {metric.current_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.current_score >= metric.target_score ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${metric.current_score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Target: {metric.target_score}%</span>
                      <span>Last Audit: {metric.last_audit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={300}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search quality checks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="requires-attention">Requires Attention</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="batch-testing">Batch Testing</SelectItem>
                  <SelectItem value="storage-conditions">Storage Conditions</SelectItem>
                  <SelectItem value="expiry-verification">Expiry Verification</SelectItem>
                  <SelectItem value="supplier-audit">Supplier Audit</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="temperature-log">Temperature Log</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quality Checks List */}
      <FadeIn delay={400}>
        <Card>
          <CardHeader>
            <CardTitle>Quality Checks ({filteredChecks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredChecks.map((check) => (
                <div key={check.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">
                            {check.medicineName || check.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <Badge variant={getStatusColor(check.status) as any}>
                            {check.status.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline">
                            {check.priority}
                          </Badge>
                        </div>
                        
                        {check.batchNumber && (
                          <p className="text-sm text-gray-600 mb-2">
                            Batch: {check.batchNumber}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-700 mb-2">{check.findings}</p>
                        
                        {check.corrective_actions && (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <span className="font-medium">Actions:</span> {check.corrective_actions}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>Inspector: {check.inspector}</span>
                          <span>Date: {check.checkDate}</span>
                          {check.next_check_date && (
                            <span>Next Check: {check.next_check_date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};