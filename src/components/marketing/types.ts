export type CampaignStatus = "Draft" | "Scheduled" | "Sent" | "Failed";

export type EmailCampaign = {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: CampaignStatus;
  createdAt: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
};

export type DeliveryStatus =
  | "Label Created"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

export type DeliveryStep = {
  time: string;
  location: string;
  status: DeliveryStatus;
  notes?: string;
};

export type DeliveryOrder = {
  id: string;
  customer: string;
  carrier: "Emirates Post" | "Aramex" | "DHL" | "FedEx";
  trackingNumber: string;
  status: DeliveryStatus;
  lastUpdate: string;
  steps: DeliveryStep[];
  notifyVia: Array<"Email" | "WhatsApp" | "SMS">;
};

export type WhatsAppProvider = "Twilio" | "360Dialog" | "MetaCloud";

export type WhatsAppConfig = {
  provider: WhatsAppProvider;
  phoneNumber: string;
  apiKeyMasked: string; // masked preview for UI only
  connected: boolean;
};