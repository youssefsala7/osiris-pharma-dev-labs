import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Plus, Send, Eye, Trash2 } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { useAppSettings } from "@/providers/AppSettingsProvider";

type EmailCampaign = {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: "Draft" | "Scheduled" | "Sent" | "Failed";
  createdAt: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
};

type TemplateData = {
  customerName?: string;
  pharmacyName?: string;
  medicineName?: string;
};

// Safe template placeholder replacement
const fillPlaceholders = (template: string, data: TemplateData = {}) => {
  const safe = (v?: string) => (typeof v === "string" ? v : "");
  let result = String(template ?? "");
  result = result.replace(/{{\s*customer_name\s*}}/gi, safe(data.customerName));
  result = result.replace(/{{\s*pharmacy_name\s*}}/gi, safe(data.pharmacyName));
  result = result.replace(/{{\s*medicine_name\s*}}/gi, safe(data.medicineName));
  return result;
};

const getStatusColor = (status: EmailCampaign["status"]) => {
  switch (status) {
    case "Draft":
      return "secondary";
    case "Scheduled":
      return "outline";
    case "Sent":
      return "default";
    case "Failed":
      return "destructive";
    default:
      return "secondary";
  }
};

export const EmailMarketing = () => {
  const { settings } = useAppSettings();

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: "EML-001",
      name: "Monthly Health Newsletter",
      subject: "Your Monthly Health Update from {{pharmacy_name}}",
      content:
        "Dear {{customer_name}},\n\nHere are this month's health tips and special offers from {{pharmacy_name}}.\n\nStay healthy,\n{{pharmacy_name}}",
      recipients: ["all_customers"],
      status: "Sent",
      createdAt: "2024-01-14T15:30:00Z",
      sentAt: "2024-01-15T10:00:00Z",
      openRate: 68.5,
      clickRate: 12.3,
    },
    {
      id: "EML-002",
      name: "Prescription Reminder",
      subject: "Time to Refill Your Prescription",
      content:
        "Hello {{customer_name}},\n\nYour prescription for {{medicine_name}} is ready for refill at {{pharmacy_name}}.\n\nVisit us to avoid running out.",
      recipients: ["prescription_customers"],
      status: "Draft",
      createdAt: "2024-01-16T09:00:00Z",
    },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    recipients: [],
    status: "Draft",
  });

  const onCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      showError("Please fill in campaign name, subject, and content.");
      return;
    }

    const created: EmailCampaign = {
      id: `EML-${String(campaigns.length + 1).padStart(3, "0")}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipients: (newCampaign.recipients as string[]) || [],
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    setCampaigns((prev) => [created, ...prev]);
    setNewCampaign({ recipients: [], status: "Draft" });
    setIsCreateOpen(false);
    showSuccess("Email campaign created.");
  };

  const onSend = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Sent", sentAt: new Date().toISOString() } : c
      )
    );
    showSuccess("Campaign marked as sent.");
  };

  const onDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showSuccess("Campaign deleted.");
  };

  const renderPreview = (c: EmailCampaign) => {
    const previewSubject = fillPlaceholders(c.subject, {
      pharmacyName: settings.pharmacyName || "Your Pharmacy",
      customerName: "Customer",
      medicineName: "Medicine",
    });

    const previewBody = fillPlaceholders(c.content, {
      pharmacyName: settings.pharmacyName || "Your Pharmacy",
      customerName: "Customer",
      medicineName: "Medicine",
    });

    return (
      <div className="space-y-3">
        <div className="text-sm">
          <span className="font-medium">Subject:</span> {previewSubject}
        </div>
        <div className="bg-gray-50 border rounded p-3 whitespace-pre-wrap text-sm">
          {previewBody}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-7 w-7 text-blue-600" />
            Email Campaigns
          </h1>
          <p className="text-gray-600">
            Create and manage email campaigns. Placeholders like {"{{customer_name}}"} are safely handled.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={newCampaign.name || ""}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g., February Promo"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newCampaign.subject || ""}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="e.g., Your refill at {{pharmacy_name}}"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={newCampaign.content || ""}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  placeholder={"Hi {{customer_name}},\n\nYour {{medicine_name}} is ready at {{pharmacy_name}}.\n\nThanks!"}
                />
              </div>
              <Button className="w-full" onClick={onCreateCampaign}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns list */}
      <div className="space-y-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <Badge variant={getStatusColor(c.status) as any}>{c.status}</Badge>
              </div>
              <div className="text-sm text-gray-600">{fillPlaceholders(c.subject, { pharmacyName: settings.pharmacyName })}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
                {fillPlaceholders(c.content, { pharmacyName: settings.pharmacyName, customerName: "Customer", medicineName: "Medicine" })}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewId(c.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                {c.status !== "Sent" && (
                  <Button size="sm" onClick={() => onSend(c.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Mark as Sent
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => onDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                <span>Created: {new Date(c.createdAt).toLocaleString()}</span>
                {c.sentAt ? <span>Sent: {new Date(c.sentAt).toLocaleString()}</span> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!previewId} onOpenChange={() => setPreviewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Campaign Preview</DialogTitle>
          </DialogHeader>
          {previewId ? renderPreview(campaigns.find((x) => x.id === previewId)!) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailMarketing;