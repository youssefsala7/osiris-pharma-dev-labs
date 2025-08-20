import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StandardCard } from "@/components/ui/standard-card";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Mail, Truck, MessageSquare, Megaphone } from "lucide-react";

export const MarketingDashboard = () => {
  // Lightweight overview numbers; in a real app these would come from analytics
  const overview = {
    emailCampaigns: 2,
    deliveriesActive: 3,
    whatsappComing: true,
  };

  return (
    <PageContainer
      title="Marketing Hub"
      subtitle="Central place for your campaigns, deliveries, and customer engagement"
    >
      <ResponsiveGrid cols={3}>
        <StatCard title="Email Campaigns" value={overview.emailCampaigns} icon={<Mail className="h-8 w-8 text-blue-600" />} />
        <StatCard title="Active Deliveries" value={overview.deliveriesActive} icon={<Truck className="h-8 w-8 text-green-600" />} />
        <StatCard title="WhatsApp (Beta)" value={overview.whatsappComing ? "Soon" : "Active"} icon={<MessageSquare className="h-8 w-8 text-emerald-600" />} animated={false} />
      </ResponsiveGrid>

      <FadeIn delay={150}>
        <StandardCard title="Get Started">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Mail className="h-6 w-6 mb-2" />
              <span className="font-medium">Email Campaigns</span>
              <span className="text-xs text-gray-600">Create and send updates</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Truck className="h-6 w-6 mb-2" />
              <span className="font-medium">Delivery Tracking</span>
              <span className="text-xs text-gray-600">Monitor shipments</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="font-medium">WhatsApp Marketing</span>
              <span className="text-xs text-gray-600">Coming soon</span>
            </Button>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Use the Marketing section in the sidebar to navigate to each module.
          </p>
        </StandardCard>
      </FadeIn>
    </PageContainer>
  );
};

export default MarketingDashboard;