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
import { Search, Plus, FileText, User, Calendar, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { showSuccess } from "@/utils/toast";
import { motion } from "framer-motion";

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
  priority: "Low" | "Medium" | "High" | "Urgent";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
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
          instructions: "Do not exceed 4 doses in 24 hours"
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
          instructions: "Take with food to avoid stomach upset"
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
  ]);

  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medications: [],
    status: "Active",
    refillsRemaining: 0,
    totalRefills: 0,
    priority: "Medium"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || prescription.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddPrescription = async () => {
    if (newPrescription.patientName && newPrescription.doctorName) {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prescription: Prescription = {
        id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
        patientName: newPrescription.patientName,
        patientId: newPrescription.patientId || `CUST-${String(prescriptions.length + 1).padStart(3, '0')}`,
        doctorName: newPrescription.doctorName,
        doctorLicense: newPrescription.doctorLicense || "",
        medications: newPrescription.medications || [],
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: newPrescription.expiryDate || "",
        status: "Active",
        notes: newPrescription.notes || "",
        refillsRemaining: Number(newPrescription.refillsRemaining) || 0,
        totalRefills: Number(newPrescription.totalRefills) || 0,
        priority: newPrescription.priority || "Medium"
      };
      
      setPrescriptions([prescription, ...prescriptions]);
      setNewPrescription({ medications: [], status: "Active", refillsRemaining: 0, totalRefills: 0, priority: "Medium" });
      setIsAddDialogOpen(false);
      setIsLoading(false);
      showSuccess("Prescription added successfully!");
    }
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setViewingPrescription(prescription);
    setIsViewDialogOpen(true);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const activePrescriptions = prescriptions.filter(p => p.status === "Active").length;
  const expiringSoon = prescriptions.filter(p => {
    const expiryDate = new Date(p.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && p.status === "Active";
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Prescription Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage patient prescriptions and medication orders</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full lg:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    New Prescription
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Prescription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Label htmlFor="priority">Priority</Label>
                      <Select onValueChange={(value) => setNewPrescription({...newPrescription, priority: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  
                  <Button onClick={handleAddPrescription} className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={prescriptions.length} />
                    </p>
                  </div>
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={activePrescriptions} />
                    </p>
                  </div>
                  <Badge variant="default" className="text-lg px-3 py-1">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={expiringSoon} />
                    </p>
                  </div>
                  <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Filled Today</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={prescriptions.filter(p => p.status === "Filled").length} />
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </StaggerContainer>

        {/* Search and Filters */}
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search prescriptions by ID, patient name, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Filled">Filled</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Prescriptions Table */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <FileText className="h-5 w-5 mr-2" />
                Prescription Database ({filteredPrescriptions.length} prescriptions)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Prescription ID</TableHead>
                      <TableHead className="min-w-[150px]">Patient</TableHead>
                      <TableHead className="min-w-[150px]">Doctor</TableHead>
                      <TableHead className="min-w-[200px]">Medications</TableHead>
                      <TableHead className="min-w-[100px]">Issue Date</TableHead>
                      <TableHead className="min-w-[100px]">Expiry Date</TableHead>
                      <TableHead className="min-w-[80px]">Refills</TableHead>
                      <TableHead className="min-w-[80px]">Priority</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription, index) => (
                      <motion.tr
                        key={prescription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
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
                            {prescription.medications.slice(0, 2).map((med, idx) => (
                              <div key={idx} className="text-sm">
                                <p className="font-medium">{med.medicineName}</p>
                                <p className="text-gray-600">{med.dosage} - {med.frequency}</p>
                              </div>
                            ))}
                            {prescription.medications.length > 2 && (
                              <p className="text-sm text-gray-500">+{prescription.medications.length - 2} more</p>
                            )}
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
                          <Badge variant={getPriorityColor(prescription.priority) as any}>
                            {prescription.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(prescription.status) as any}>
                            {prescription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPrescription(prescription)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full sm:w-auto text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* View Prescription Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            {viewingPrescription && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Prescription ID</Label>
                    <p className="font-medium">{viewingPrescription.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(viewingPrescription.status) as any}>
                        {viewingPrescription.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Patient</Label>
                    <p className="font-medium">{viewingPrescription.patientName}</p>
                    <p className="text-sm text-gray-600">{viewingPrescription.patientId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Doctor</Label>
                    <p className="font-medium">{viewingPrescription.doctorName}</p>
                    <p className="text-sm text-gray-600">{viewingPrescription.doctorLicense}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Medications</Label>
                  <div className="mt-2 space-y-3">
                    {viewingPrescription.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{med.medicineName}</p>
                        <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                        <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                        <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                        <p className="text-sm text-gray-600">Quantity: {med.quantity}</p>
                        <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {viewingPrescription.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Notes</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{viewingPrescription.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};