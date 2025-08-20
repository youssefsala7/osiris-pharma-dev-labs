import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { MessageCircle, Mail, Truck, TrendingUp, Users, Send, Package } from "lucide-react";
import { WhatsAppMarketing } from "./WhatsAppMarketing";
import { EmailMarketing } from "./EmailMarketing";
import { DeliveryTracking } from "./DeliveryTracking";
import { FadeIn } from "@/components/ui/fade-in";

export const MarketingDashboard = () => {
  return (
    <PageContainer
      title="Marketing & Communications"
      subtitle="Manage customer communications, campaigns, and delivery tracking"
    >
      {/* Overview Stats */}
      <FadeIn>
        <ResponsiveGrid cols={4}>
          <StatCard
            title="WhatsApp Contacts"
            value={0}
            icon={<MessageCircle className="h-8 w-8 text-green-600" />}
            trend={{ value: 0, isPositive: true }}
            suffix=" (Coming Soon)"
          />
          <StatCard
            title="Email Campaigns"
            value={2}
            icon={<Mail className="h-8 w-8 text-blue-600" />}
            trend={{ value: 100, isPositive: true }}
          />
          <StatCard
            title="Active Deliveries"
            value={2}
            icon={<Truck className="h-8 w-8 text-orange-600" />}
            trend={{ value: 25, isPositive: true }}
          />
          <StatCard
            title="Engagement Rate"
            value={68.5}
            icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
            suffix="%"
            trend={{ value: 12, isPositive: true }}
          />
        </ResponsiveGrid>
      </FadeIn>

      {/* Marketing Tabs */}
      <FadeIn delay={200}>
        <Tabs defaultValue="whatsapp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Marketing
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Campaigns
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Delivery Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp">
            <WhatsAppMarketing />
          </TabsContent>

          <TabsContent value="email">
            <EmailMarketing />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryTracking />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </PageContainer>
  );
};