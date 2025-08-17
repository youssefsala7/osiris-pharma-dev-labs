import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: number;
  approvedAmount: number;
  prescriptionId: string;
  medications: ClaimMedication[];
  submissionDate: string;
  processedDate?: string;
  status: "Pending" | "Approved" | "Rejected" | "Under Review" | "Resubmitted";
  rejectionReason?: string;
  notes: string;
  pharmacistId: string;
}

interface ClaimMedication {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  ndc: string; // National Drug Code
}

export const InsuranceClaims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: "CLM-001",
      patientName: "John Doe",
      patientId: "CUST-001",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "BCBS123456789",
      claimAmount: 125.50,
      approvedAmount: 125.50,
      prescriptionId: "RX-001",
      medications: [
        {
          medicineId: "MED-002",
          medicineName: "Amoxicillin 250mg",
          quantity: 21,
          unitPrice: 5.50,
          totalPrice: 115.50,
          ndc: "12345-678-90"
        },
        {
          medicineId: "MED-001",
          medicineName: "Paracetamol 500mg",
          quantity: 4,
          unitPrice: 2.50,
          totalPrice: 10.00,
          ndc: "98765-432-10"
        }
      ],
      submissionDate: "2024-01-15",
      processedDate: "2024-01-18",
      status: "Approved",
      notes: "Standard claim processed successfully",
      pharmacistId: "USR-002"
    },
    {
      id: "CLM-002",
      patientName: "Jane Smith",
      patientId: "CUST-002",
      insuranceProvider: "Aetna",
      policyNumber: "AET987654321",
      claimAmount: 89.75,
      approvedAmount: 0,
      prescriptionId: "RX-002",
      medications: [
        {
          medicineId: "MED-003",
          medicineName: "Ibuprofen 400mg",
          quantity: 30,
          unitPrice: 2.99,
          totalPrice: 89.75,
          ndc: "11111-222-33"
        }
      ],
      submissionDate: "2024-01-14",
      status: "Rejected",
      rejectionReason: "Prior authorization required for this medication",
      notes: "Patient needs to obtain prior authorization from physician",
      pharmacistId: "USR-002"
    },
    {
      id: "CLM-003",
      patientName: "Mike Johnson",
      patientId: "CUST-003",
      insuranceProvider: "Cigna",
      policyNumber: "CIG456789123",
      claimAmount: 245.00,
      approvedAmount: 0,
      prescriptionId: "RX-003",
      medications: [
        {
          medicineId: "MED-004",
          medicineName: "Atorvastatin 20mg",
          quantity: 90,
          unitPrice: 2.72,
          totalPrice: 245.00,
          ndc: "44444-555-66"
        }
      ],
      submissionDate: "2024-01-16",
      status: "Under Review",
      notes: "Claim under review by insurance provider",
      pharmacistId: "USR-002"
    }
  ]);

  const [newClaim, setNewClaim] = useState<Partial<InsuranceClaim>>({
    medications: [],
    status: "Pending"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClaims = claims.filter(claim =>
    claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClaim = () => {
    if (newClaim.patientName && newClaim.insuranceProvider && newClaim.policyNumber && newClaim.claimAmount) {
      const claim: InsuranceClaim = {
        id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
        patientName: newClaim.patientName,
        patientId: newClaim.patientId || `CUST-${String(claims.length + 1).padStart(3, '0')}`,
        insuranceProvider: newClaim.insuranceProvider,
        policyNumber: newClaim.policyNumber,
        claimAmount: newClaim.claimAmount,
        approvedAmount: 0,
        prescriptionId: newClaim.prescriptionId || `RX-${String(claims.length + 1).padStart(3, '0')}`,
        medications: newClaim.medications || [],
        submissionDate: new Date().toISOString().split('T')[0],
        status: "Pending",
        notes: newClaim.notes || "",
        pharmacistId: "USR-002"
      };
      
      setClaims([claim, ...claims]);
      setNewClaim({ medications: [], status: "Pending" });
      setIsAddDialogOpen(false);
      showSuccess("Insurance claim submitted successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Rejected": return "destructive";
      case "Under Review": return "secondary";
      case "Pending": return "outline";
      case "Resubmitted": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Rejected": return <XCircle className="h-4 w-4" />;
      case "Under Review": return <AlertCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Resubmitted": return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === "Pending" || c.status === "Under Review").length;
  const approvedClaims = claims.filter(c => c.status === "Approved").length;
  const totalClaimAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalApprovedAmount = claims.reduce((sum, c) => sum + c.approvedAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Claims</h1>
          <p className="text-gray-600">Manage insurance claims and reimbursements</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Insurance Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newClaim.patientName || ""}
                  onChange={(e) => setNewClaim({...newClaim, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Select onValueChange={(value) => setNewClaim({...newClaim, insuranceProvider: value})}>
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
                  value={newClaim.policyNumber || ""}
                  onChange={(e) => setNewClaim({...newClaim, policyNumber: e.target.value})}
                  placeholder="Enter policy number"
                />
              </div>
              
              <div>
                <Label htmlFor="prescriptionId">Prescription ID</Label>
                <Input
                  id="prescriptionId"
                  value={newClaim.prescriptionId || ""}
                  onChange={(e) => setNewClaim({...newClaim, prescriptionId: e.target.value})}
                  placeholder="Enter prescription ID"
                />
              </div>
              
              <div>
                <Label htmlFor="claimAmount">Claim Amount ($)</Label>
                <Input
                  id="claimAmount"
                  type="number"
                  step="0.01"
                  value={newClaim.claimAmount || ""}
                  onChange={(e) => setNewClaim({...newClaim, claimAmount: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newClaim.notes || ""}
                  onChange={(e) => setNewClaim({...newClaim, notes: e.target.value})}
                  placeholder="Enter any additional notes"
                />
              </div>
              
              <Button onClick={handleAddClaim} className="w-full">
                Submit Claim
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">{totalClaims}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingClaims}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedClaims}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Claim Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalClaimAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalApprovedAmount.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search claims by ID, patient name, insurance provider, or policy number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Insurance Claims ({filteredClaims.length} claims)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Insurance Provider</TableHead>
                <TableHead>Policy Number</TableHead>
                <TableHead>Claim Amount</TableHead>
                <TableHead>Approved Amount</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{claim.patientName}</p>
                      <p className="text-sm text-gray-600">{claim.patientId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{claim.insuranceProvider}</TableCell>
                  <TableCell className="font-mono text-sm">{claim.policyNumber}</TableCell>
                  <TableCell className="font-medium">${claim.claimAmount.toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    ${claim.approvedAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>{claim.submissionDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(claim.status)}
                      <Badge variant={getStatusColor(claim.status) as any}>
                        {claim.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {claim.status === "Rejected" && (
                        <Button variant="outline" size="sm">
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};