import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText } from "lucide-react";

interface PrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<boolean>;
  isLoading: boolean;
}

export const PrescriptionDialog = ({ open, onOpenChange, onSubmit, isLoading }: PrescriptionDialogProps) => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientName: "",
    doctorName: "",
    details: ""
  });

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) {
      setPrescriptionData({ patientName: "", doctorName: "", details: "" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Prescription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Patient Name</Label>
            <Input 
              placeholder="Enter patient name" 
              value={prescriptionData.patientName}
              onChange={(e) => setPrescriptionData({...prescriptionData, patientName: e.target.value})}
            />
          </div>
          <div>
            <Label>Doctor Name</Label>
            <Input 
              placeholder="Enter doctor name" 
              value={prescriptionData.doctorName}
              onChange={(e) => setPrescriptionData({...prescriptionData, doctorName: e.target.value})}
            />
          </div>
          <div>
            <Label>Prescription Details</Label>
            <Input 
              placeholder="Enter prescription details" 
              value={prescriptionData.details}
              onChange={(e) => setPrescriptionData({...prescriptionData, details: e.target.value})}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
            Create Prescription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};