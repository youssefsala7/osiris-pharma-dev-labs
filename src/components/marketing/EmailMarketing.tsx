import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Send, Users, TrendingUp, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { showSuccess, showError } from "@/utils/toast";
import { EmailCampaign } from "./types";

export const EmailMarketing = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: "EML-001",
      name: "Monthly Health Newsletter",
      subject: "Your Monthly Health Update from Al Kindi Pharmacy",
      content: "Dear {{customer_name}}, here are this month's health tips and special offers...",
      recipients: ["all_customers"],
      status: "Sent",
      sentAt: "2024-01-15T10:00:00Z",
      openRate: 68.5,
      clickRate: 12.3,
      createdAt: "2024-01-14T15:30:00Z"
    },
    {
      id: "EML-002",
      name: "Prescription Reminder",
      subject: "Time to Refill Your Prescription",
      content: "Hello {{customer_name}}, your prescription for {{medicine_name}} is ready for refill...",
      recipients: ["prescription_customers"],
      status: "Draft",
      createdAt: "2024-01-16T09:00:00Z"
    }
  ]);

  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    recipients: []
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      showError("Please fill in all required fields");
      return;
    }

    const campaign: EmailCampaign = {
      id: `EML-${String(campaigns.length + 1).padStart(3, '0')}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipients: newCampaign.recipients || [],
      status: "Draft",
      createdAt: new Date().toISOString()
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ recipients: [] });
    setIsCreateDialogOpen(false);
    showSuccess("Email campaign created successfully!");
  };

  const sendCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: "Sent" as const, sentAt: new Date().toISOString() }
        : campaign
    ));
    showSuccess("Email campaign sent successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "default";
      case "Draft": return "secondary";
      case "Scheduled": return "outline";
      case "Failed": return "destructive";
      default: return "secondary";
    }
  };

  const totalSent = campaigns.filter(c => c.status === "Sent").length;
  const avgOpenRate = campaigns.filter(c => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length || 0;
  const avgClickRate = campaigns.filter(c => c.clickRate).reduce((sum, c) => sum + (c.clickRate || 0), 0) / campaigns.filter(c => c.clickRate).length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={campaigns.length} />
                  </p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Campaigns Sent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={totalSent} />
                  </p>
                </div>
                <Send className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{avgClickRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Campaign Management */}
      <FadeIn delay={200}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Campaigns ({campaigns.length})
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
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
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={newCampaign.subject || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      placeholder="Enter email subject line"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recipients">Target Audience</Label>
                    <Select onValueChange={(value) => setNewCampaign({...newCampaign, recipients: [value]})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_customers">All Customers</SelectItem>
                        <SelectItem value="prescription_customers">Prescription Customers</SelectItem>
                        <SelectItem value="frequent_customers">Frequent Customers</SelectItem>
                        <SelectItem value="inactive_customers">Inactive Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      value={newCampaign.content || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                      placeholder="Enter email content. Use {{customer_name}} for personalization."
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables like {{customer_name}}, {{pharmacy_name}}, {{medicine_name}} for personalization
                    </p>
                  </div>
                  
                  <Button onClick={handleCreateCampaign} className="w-full">
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge variant={getStatusColor(campaign.status) as any}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Recipients: {campaign.recipients.join(", ")}</span>
                        {campaign.openRate && (
                          <span>Open Rate: {campaign.openRate}%</span>
                        )}
                        {campaign.clickRate && (
                          <span>Click Rate: {campaign.clickRate}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === "Draft" && (
                        <Button 
                          size="sm" 
                          onClick={() => sendCampaign(campaign.id)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Email Templates */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <h4 className="font-medium mb-2">Prescription Reminder</h4>
                <p className="text-sm text-gray-600 mb-3">Remind customers about prescription refills</p>
                <Button size="sm" variant="outline">Use Template</Button>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <h4 className="font-medium mb-2">Health Newsletter</h4>
                <p className="text-sm text-gray-600 mb-3">Monthly health tips and pharmacy updates</p>
                <Button size="sm" variant="outline">Use Template</Button>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <h4 className="font-medium mb-2">Special Offers</h4>
                <p className="text-sm text-gray-600 mb-3">Promotional campaigns and discounts</p>
                <Button size="sm" variant="outline">Use Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};