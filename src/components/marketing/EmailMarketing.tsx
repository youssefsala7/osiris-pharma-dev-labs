import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EmailCampaign } from "./types";
import { showSuccess, showError } from "@/utils/toast";
import { useAppSettings } from "@/providers/AppSettingsProvider";

type TemplateData = {
  customerName?: string;
  pharmacyName?: string;
  medicineName?: string;
};

// Safe placeholder replacement to avoid runtime errors when data is missing
const fillPlaceholders = (template: string, data: TemplateData = {}) => {
  const d = data || {};
  let result = template ?? "";
  result = result.replace(/{{customer_name}}/g, d.customerName ?? "Customer");
  result = result.replace(/{{pharmacy_name}}/g, d.pharmacyName ?? "");
  result = result.replace(/{{medicine_name}}/g, d.medicineName ?? "");
  return result;
};

export const EmailMarketing = () => {
  const { settings } = useAppSettings();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: "EML-001",
      name: "Monthly Health Newsletter",
      subject: "Your Monthly Health Update from Al Kindi Pharmacy",
      content: "Dear {{customer_name}}, here are this month's health tips and special offers from {{pharmacy_name}}.",
      recipients: ["all_customers"],
      status: "Draft",
      createdAt: new Date().toISOString(),
    },
    {
      id: "EML-002",
      name: "Prescription Reminder",
      subject: "Time to Refill Your Prescription",
      content: "Hello {{customer_name}}, your prescription for {{medicine_name}} is ready for refill at {{pharmacy_name}}.",
      recipients: ["prescription_customers"],
      status: "Draft",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({ recipients: [] });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      showError("Please fill in all required fields");
      return;
    }

    const campaign: EmailCampaign = {
      id: `EML-${String(campaigns.length + 1).padStart(3, "0")}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipients: (newCampaign.recipients as string[]) ?? [],
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ recipients: [] });
    setIsCreateDialogOpen(false);
    showSuccess("Email campaign created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Sent":
        return "default";
      case "Scheduled":
        return "outline";
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const renderContent = (template: string) => {
    // Include a safe fallback for placeholders
    return fillPlaceholders(template, {
      customerName: "",
      pharmacyName: settings?.pharmacyName ?? "Pharmacy",
      medicineName: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600">Create and manage email campaigns to communicate with customers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Email Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name || ""}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject || ""}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newCampaign.content || ""}
                    onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                    placeholder="Email body with placeholders like {{customer_name}}"
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Campaigns list with safe rendering of placeholders */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">{campaign.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(campaign.status) as any}>{campaign.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2 text-sm text-gray-700">{campaign.subject}</div>
              <div className="text-sm text-gray-800 mb-2">{renderContent(campaign.content)}</div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>Created: {new Date(campaign.createdAt).toLocaleString()}</span>
                {campaign.sentAt && <span>Sent: {new Date(campaign.sentAt).toLocaleString()}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};