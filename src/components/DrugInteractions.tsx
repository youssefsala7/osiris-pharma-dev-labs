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
import { Search, Plus, AlertTriangle, Shield, Info, X } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: "Minor" | "Moderate" | "Major" | "Contraindicated";
  description: string;
  mechanism: string;
  clinicalEffects: string;
  management: string;
  references: string;
  dateAdded: string;
}

interface InteractionCheck {
  id: string;
  patientName: string;
  medications: string[];
  interactions: DrugInteraction[];
  checkDate: string;
  pharmacistNotes: string;
}

export const DrugInteractions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([
    {
      id: "INT-001",
      drug1: "Warfarin",
      drug2: "Aspirin",
      severity: "Major",
      description: "Increased risk of bleeding when warfarin is combined with aspirin",
      mechanism: "Additive anticoagulant effects and increased bleeding risk",
      clinicalEffects: "Increased INR, bleeding, bruising, hemorrhage",
      management: "Monitor INR closely, consider alternative analgesic, reduce warfarin dose if necessary",
      references: "Clinical Pharmacology Database 2024",
      dateAdded: "2024-01-01"
    },
    {
      id: "INT-002",
      drug1: "Metformin",
      drug2: "Contrast Media",
      severity: "Moderate",
      description: "Risk of lactic acidosis when metformin is used with iodinated contrast media",
      mechanism: "Contrast media may cause acute kidney injury, leading to metformin accumulation",
      clinicalEffects: "Lactic acidosis, kidney dysfunction",
      management: "Discontinue metformin 48 hours before and after contrast procedures",
      references: "FDA Drug Safety Communication 2024",
      dateAdded: "2024-01-02"
    },
    {
      id: "INT-003",
      drug1: "Digoxin",
      drug2: "Amiodarone",
      severity: "Major",
      description: "Amiodarone significantly increases digoxin levels",
      mechanism: "Amiodarone inhibits P-glycoprotein, reducing digoxin clearance",
      clinicalEffects: "Digoxin toxicity, arrhythmias, nausea, visual disturbances",
      management: "Reduce digoxin dose by 50%, monitor digoxin levels closely",
      references: "Cardiology Drug Interactions Manual 2024",
      dateAdded: "2024-01-03"
    }
  ]);

  const [interactionChecks, setInteractionChecks] = useState<InteractionCheck[]>([
    {
      id: "CHK-001",
      patientName: "John Doe",
      medications: ["Warfarin", "Aspirin", "Metoprolol"],
      interactions: [ { ...interactions[0] } ],
      checkDate: "2024-01-15",
      pharmacistNotes: "Patient counseled about bleeding risk. Advised to monitor for signs of bleeding."
    }
  ]);

  const [newCheck, setNewCheck] = useState<Partial<InteractionCheck>>({
    medications: []
  });
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);

  const availableMedications = [
    "Warfarin", "Aspirin", "Metformin", "Digoxin", "Amiodarone", "Lisinopril",
    "Metoprolol", "Atorvastatin", "Omeprazole", "Levothyroxine", "Amlodipine",
    "Hydrochlorothiazide", "Simvastatin", "Losartan", "Furosemide"
  ];

  const checkInteractions = (medications: string[]) => {
    const foundInteractions: DrugInteraction[] = [];
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = interactions.find(int => 
          (int.drug1 === medications[i] && int.drug2 === medications[j]) ||
          (int.drug1 === medications[j] && int.drug2 === medications[i])
        );
        if (interaction) foundInteractions.push(interaction);
      }
    }
    return foundInteractions;
  };

  const handleCheckInteractions = () => {
    if (newCheck.patientName && newCheck.medications && newCheck.medications.length >= 2) {
      const foundInteractions = checkInteractions(newCheck.medications);
      const check: InteractionCheck = {
        id: `CHK-${String(interactionChecks.length + 1).padStart(3, '0')}`,
        patientName: newCheck.patientName,
        medications: newCheck.medications,
        interactions: foundInteractions,
        checkDate: new Date().toISOString().split('T')[0],
        pharmacistNotes: newCheck.pharmacistNotes || ""
      };
      setInteractionChecks([check, ...interactionChecks]);
      setNewCheck({ medications: [] });
      setIsCheckDialogOpen(false);
      if (foundInteractions.length > 0) {
        showError(`Found ${foundInteractions.length} drug interaction(s)!`);
      } else {
        showSuccess("No drug interactions found.");
      }
    }
  };

  const severityClass = (severity: string) => {
    switch (severity) {
      case "Contraindicated":
      case "Major":
        return "status-major";
      case "Moderate":
        return "status-moderate";
      case "Minor":
      default:
        return "status-neutral";
    }
  };

  const filteredInteractions = interactions.filter(interaction =>
    interaction.drug1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interaction.drug2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInteractions = interactions.length;
  const majorInteractions = interactions.filter(i => i.severity === "Major" || i.severity === "Contraindicated").length;
  const recentChecks = interactionChecks.length;
  const interactionsFound = interactionChecks.reduce((sum, check) => sum + check.interactions.length, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Drug Interactions</h1>
          <p className="opacity-70">Check for drug interactions and manage interaction database</p>
        </div>
        
        <Dialog open={isCheckDialogOpen} onOpenChange={setIsCheckDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Check Interactions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Check Drug Interactions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newCheck.patientName || ""}
                  onChange={(e) => setNewCheck({...newCheck, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <Label>Select Medications (minimum 2)</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableMedications.map((med) => (
                    <div key={med} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={med}
                        checked={newCheck.medications?.includes(med) || false}
                        onChange={(e) => {
                          const medications = newCheck.medications || [];
                          if (e.target.checked) {
                            setNewCheck({...newCheck, medications: [...medications, med]});
                          } else {
                            setNewCheck({...newCheck, medications: medications.filter(m => m !== med)});
                          }
                        }}
                      />
                      <label htmlFor={med} className="text-sm">{med}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Pharmacist Notes</Label>
                <Textarea
                  id="notes"
                  value={newCheck.pharmacistNotes || ""}
                  onChange={(e) => setNewCheck({...newCheck, pharmacistNotes: e.target.value})}
                  placeholder="Enter any notes or observations"
                />
              </div>
              
              <Button 
                onClick={handleCheckInteractions} 
                className="w-full"
                disabled={!newCheck.patientName || !newCheck.medications || newCheck.medications.length < 2}
              >
                Check for Interactions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Interactions</p>
                <p className="text-2xl font-semibold">{totalInteractions}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Major/Critical</p>
                <p className="text-2xl font-semibold">{majorInteractions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Recent Checks</p>
                <p className="text-2xl font-semibold">{recentChecks}</p>
              </div>
              <Search className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Interactions Found</p>
                <p className="text-2xl font-semibold">{interactionsFound}</p>
              </div>
              <Info className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search interactions by drug name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactions Database */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Drug Interactions Database ({filteredInteractions.length} interactions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Drug Combination</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Clinical Effects</TableHead>
                <TableHead>Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={severityClass(interaction.severity)}>
                        {interaction.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{interaction.drug1}</p>
                      <p className="text-sm opacity-70">+ {interaction.drug2}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm opacity-90">{interaction.description}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm opacity-90">{interaction.clinicalEffects}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm opacity-90">{interaction.management}</p>
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