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
import { Search, Plus, FileText, User, Calendar, AlertCircle, Eye, Edit, Trash2, Download } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { showSuccess } from "@/utils/toast";
import { motion } from "framer-motion";
import { usePrescriptions } from "./prescriptions/hooks/usePrescriptions";

export const Prescriptions = () => {
  const {
    prescriptions,
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
  } = usePrescriptions();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [newPrescriptionData, setNewPrescriptionData] = useState<any>({});
  const [editingPrescription, setEditingPrescription] = useState<any>(null);
  const [viewingPrescription, setViewingPrescription] = useState<any>(null);

  const handleAddPrescription = async () => {
    const success = await addPrescription(newPrescriptionData);
    if (success) {
      setNewPrescriptionData({});
      setIsAddDialogOpen(false);
    }
  };

  const handleEditPrescription = async () => {
    if (editingPrescription) {
      const success = await updatePrescription(editingPrescription);
      if (success) {
        setEditingPrescription(null);
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleViewPrescription = (prescription: any) => {
    setViewingPrescription(prescription);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (prescription: any) => {
    setEditingPrescription(prescription);
    setIsEditDialogOpen(true);
  };

  const handleFillPrescription = (prescriptionId: string) => {
    fillPrescription(prescriptionId);
  };

  const handleCancelPrescription = (prescriptionId: string) => {
    cancelPrescription(prescriptionId);
  };

  const handleExportData = () => {
    exportPrescriptions();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Prescription Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage patient prescriptions and medication orders</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExportData} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto">
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
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={newPrescriptionData.patientName || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, patientName: e.target.value})}
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientId">Patient ID</Label>
                        <Input
                          id="patientId"
                          value={newPrescriptionData.patientId || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, patientId: e.target.value})}
                          placeholder="Enter patient ID"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="doctorName">Doctor Name *</Label>
                        <Input
                          id="doctorName"
                          value={newPrescriptionData.doctorName || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, doctorName: e.target.value})}
                          placeholder="Enter doctor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctorLicense">Doctor License</Label>
                        <Input
                          id="doctorLicense"
                          value={newPrescriptionData.doctorLicense || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, doctorLicense: e.target.value})}
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
                          value={newPrescriptionData.expiryDate || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, expiryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select onValueChange={(value) => setNewPrescriptionData({...newPrescriptionData, priority: value})}>
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
                          value={newPrescriptionData.totalRefills || ""}
                          onChange={(e) => setNewPrescriptionData({...newPrescriptionData, totalRefills: Number(e.target.value), refillsRemaining: Number(e.target.value)})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newPrescriptionData.notes || ""}
                        onChange={(e) => setNewPrescriptionData({...newPrescriptionData, notes: e.target.value})}
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
                      <AnimatedCounter value={stats.totalPrescriptions} />
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
                      <AnimatedCounter value={stats.activePrescriptions} />
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
                      <AnimatedCounter value={stats.expiringSoon} />
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
                      <AnimatedCounter value={stats.filledToday} />
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
                Prescription Database ({prescriptions.length} prescriptions)
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
                      <TableHead className="min-w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription, index) => (
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
                            {prescription.medications.slice(0, 2).map((med: any, idx: number) => (
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
                              onClick={() => handleEditClick(prescription)}
                              className="w-full sm:w-auto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {prescription.status === "Active" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleFillPrescription(prescription.id)}
                                className="w-full sm:w-auto text-green-600 hover:text-green-700"
                              >
                                Fill
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelPrescription(prescription.id)}
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
                    {viewingPrescription.medications.map((med: any, index: number) => (
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

        {/* Edit Prescription Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Prescription</DialogTitle>
            </DialogHeader>
            {editingPrescription && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPatientName">Patient Name</Label>
                    <Input
                      id="editPatientName"
                      value={editingPrescription.patientName || ""}
                      onChange={(e) => setEditingPrescription({...editingPrescription, patientName: e.target.value})}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDoctorName">Doctor Name</Label>
                    <Input
                      id="editDoctorName"
                      value={editingPrescription.doctorName || ""}
                      onChange={(e) => setEditingPrescription({...editingPrescription, doctorName: e.target.value})}
                      placeholder="Enter doctor name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editingPrescription.notes || ""}
                    onChange={(e) => setEditingPrescription({...editingPrescription, notes: e.target.value})}
                    placeholder="Enter any special notes or instructions"
                  />
                </div>
                
                <Button onClick={handleEditPrescription} className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  Update Prescription
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};