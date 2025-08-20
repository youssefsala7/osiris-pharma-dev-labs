export interface WhatsAppCredentials {
  businessId: string;
  accessToken: string;
  phoneNumberId: string;
  webhookToken: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: "Draft" | "Scheduled" | "Sent" | "Failed";
  scheduledAt?: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

export interface DeliveryTracking {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  trackingNumber: string;
  carrier: string;
  status: "Pending" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed";
  estimatedDelivery: string;
  actualDelivery?: string;
  location?: string;
  notifications: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  updates: DeliveryUpdate[];
}

export interface DeliveryUpdate {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "Marketing" | "Utility" | "Authentication";
  language: string;
  status: "Approved" | "Pending" | "Rejected";
  content: string;
  variables: string[];
}

export interface MarketingStats {
  whatsappMessages: number;
  emailsSent: number;
  deliveriesTracked: number;
  engagementRate: number;
}