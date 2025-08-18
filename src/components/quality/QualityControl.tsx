import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Plus } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { QualityStats } from "./QualityStats";
import { ComplianceMetrics } from "./ComplianceMetrics";
import { QualityFilters } from "./QualityFilters";
import { QualityCheckList } from "./QualityCheckList";
import { QualityCheckForm } from "./QualityCheckForm";
import { QualityCheckDetails } from "./QualityCheckDetails";
import { useQualityControl } from "./hooks/useQualityControl";
import { QualityCheck, QualityCheckFormData } from "./types";

export const QualityControl = () => {
  const {
    qualityChecks,
    complianceMetrics,
    filters,
    setFilters,
    stats,
    isLoading,
    addQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
    exportQualityReport
  } = useQualityControl();

  // Dialog states
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [newCheckData, setNewCheckData] = useState<QualityCheckFormData>({
    status: "pending",
    priority: "medium"
  });
  const [editingCheck, setEditingCheck] = useState<QualityCheck | null>(null);
  const [viewingCheck, setViewingCheck] = useState<QualityCheck | null>(null);

  const handleAddCheck = async () => {
    const success = await addQualityCheck(newCheckData);
    if (success) {
      setNewCheckData({ status: "pending", priority: "medium" });
      setIsAddCheckOpen(false);
    }
  };

  const handleEditCheck = async () => {
    if (editingCheck) {
      const success = await updateQualityCheck(editingCheck);
      if (success) {
        setEditingCheck(null);
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleViewCheck = (check: QualityCheck) => {
    setViewingCheck(check);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (check: QualityCheck) => {
    setEditingCheck(check);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCheck = (checkId: string) => {
    deleteQualityCheck(checkId);
  };

  const handleExportReport = () => {
    exportQualityReport();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quality Control</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage quality assurance and regulatory compliance</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExportReport} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export Report
              </Button>
              
              <Dialog open={isAddCheckOpen} onOpenChange={setIsAddCheckOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    New Quality Check
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Add Quality Check</DialogTitle>
                  </DialogHeader>
                  <QualityCheckForm
                    formData={newCheckData}
                    onFormDataChange={setNewCheckData}
                    onSubmit={handleAddCheck}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </FadeIn>

        <QualityStats stats={stats} />

        <ComplianceMetrics metrics={complianceMetrics} delay={200} />

        <QualityFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
          delay={300} 
        />

        <QualityCheckList
          checks={qualityChecks}
          onView={handleViewCheck}
          onEdit={handleEditClick}
          onDelete={handleDeleteCheck}
          isLoading={isLoading}
          delay={400}
        />

        {/* View Quality Check Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Quality Check Details</DialogTitle>
            </DialogHeader>
            {viewingCheck && <QualityCheckDetails check={viewingCheck} />}
          </DialogContent>
        </Dialog>

        {/* Edit Quality Check Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit Quality Check</DialogTitle>
            </DialogHeader>
            {editingCheck && (
              <QualityCheckForm
                formData={editingCheck}
                onFormDataChange={(data) => setEditingCheck({ ...editingCheck, ...data })}
                onSubmit={handleEditCheck}
                isLoading={isLoading}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};