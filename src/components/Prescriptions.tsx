import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, FileText, User, Calendar, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccess } from "@/utils/toast";

interface Prescription {
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
}

interface PrescriptionMedication {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export const Prescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
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
          instructions: "Take with food"
        }
      ],
      issueDate: "2024-01-15",
      expiryDate: "2024-07-15",
      status: "Active",
      notes: "Patient has mild penicillin allergy - monitor for reactions",
      refillsRemaining: 2,
      totalRefills: 3
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
          instructions: "Do not exceed 4 doses in 24 hours"
        }
      ],
      issueDate: "2024-01-14",
      expiryDate: "2024-07-14",
      status: "Filled",
      notes: "",
      refillsRemaining: 0,
      totalRefills: 1
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
          instructions: "Take with food to avoid stomach upset"
        }
      ],
      issueDate: "2024-01-10",
      expiryDate: "2024-07-10",
      status: "Active",
      notes: "Patient reports chronic back pain",
      refillsRemaining: 1,
      totalRefills: 2
    },
  ]);

  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medications: [],
    status: "Active",
    refillsRemaining: 0,
    totalRefills: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrescriptions = prescriptions.filter(p => p.status === "Active").length;
  const expiringSoon = prescriptions.filter(p => {
    const expiryDate = new Date(p.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && p.status === "Active";
  }).length;

  const handleAddPrescription = () => {
    if (newPrescription.patientName && newPrescription.doctorName && newPrescription.medications && newPrescription.medications.length > 0) {
      const prescription: Prescription = {
        id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
        patientName: newPrescription.patientName,
        patientId: newPrescription.patientId || `CUST-${String(prescriptions.length + 1).padStart(3, '0')}`,
        doctorName: newPrescription.doctorName,
        doctorLicense: newPrescription.doctorLicense || "",
        medications: newPrescription.medications,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: newPrescription.expiryDate || "",
        status: "Active",
        notes: newPrescription.notes || "",
        refillsRemaining: Number(newPrescription.refillsRemaining) || 0,
        totalRefills: Number(newPrescription.totalRefills) || 0,
      };
      
      setPrescriptions([...prescriptions, prescription]);
      setNewPrescription({ medications: [], status: "Active", refillsRemaining: 0, totalRefills: 0 });
      setIsAddDialogOpen(false);
      showSuccess("Prescription added successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Filled": return "secondary";
      case "Expired": return "destructive";
      case "Cancelled": return "outline";
      default: return "secondary";
    }
  };

  const headerActions = (
    <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
      <Plus className="h-4 w-4 mr-2" />
      New Prescription
    </Button>
  );

  return (
    <PageContainer
      title="Prescription Management"
      subtitle="Manage patient prescriptions and medication orders"
      headerActions={headerActions}
    >
      {/* Stats Cards */}
      <ResponsiveGrid cols={4}>
        <StatCard
          title="Total Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Active Prescriptions"
          value={activePrescriptions}
          icon={<User className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoon}
          icon={<AlertCircle className="h-8 w-8 text-orange-600" />}
        />
        <StatCard
          title="Filled Today"
          value={prescriptions.filter(p => p.status === "Filled").length}
          icon={<Calendar className="h-8 w-8 text-purple-600" />}
        />
      </ResponsiveGrid>

      {/* Search */}
      <StandardCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search prescriptions by ID, patient name, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </StandardCard>

      {/* Prescriptions Table */}
      <StandardCard title={`Prescription Database (${filteredPrescriptions.length} prescriptions)`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prescription ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Refills</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell className="font-medium">{prescription.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{prescription.patientName}</p>
                    <p className="text-sm text-gray-600">{prescription.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{prescription.doctorName}</p>
                    <p className="text-sm text-gray-600">{prescription.doctorLicense}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{med.medicineName}</p>
                        <p className="text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{prescription.issueDate}</TableCell>
                <TableCell>{prescription.expiryDate}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{prescription.refillsRemaining} / {prescription.totalRefills}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(prescription.status) as any}>
                    {prescription.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StandardCard>

      {/* Add Prescription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newPrescription.patientName || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={newPrescription.patientId || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, patientId: e.target.value})}
                  placeholder="Enter patient ID"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={newPrescription.doctorName || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, doctorName: e.target.value})}
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <Label htmlFor="doctorLicense">Doctor License</Label>
                <Input
                  id="doctorLicense"
                  value={newPrescription.doctorLicense || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, doctorLicense: e.target.value})}
                  placeholder="Enter license number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newPrescription.expiryDate || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="totalRefills">Total Refills</Label>
                <Input
                  id="totalRefills"
                  type="number"
                  value={newPrescription.totalRefills || ""}
                  onChange={(e) => setNewPrescription({...newPrescription, totalRefills: Number(e.target.value), refillsRemaining: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newPrescription.notes || ""}
                onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                placeholder="Enter any special notes or instructions"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              Note: In a full implementation, you would add medication details here with dosages and instructions.
            </div>
            
            <Button onClick={handleAddPrescription} className="w-full">
              Add Prescription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};