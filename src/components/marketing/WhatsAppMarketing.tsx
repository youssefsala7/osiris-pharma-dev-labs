import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StandardCard } from "@/components/ui/standard-card";
import { PageContainer } from "@/components/ui/page-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { StatCard } from "@/components/ui/stat-card";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MessageSquare, Lock, Send } from "lucide-react";
import type { WhatsAppConfig } from "./types";

export const WhatsAppMarketing = () => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: "Twilio",
    phoneNumber: "",
    apiKeyMasked: "••••••••••••••••",
    connected: false,
  });

  return (
    <PageContainer
      title="WhatsApp Marketing"
      subtitle="Engage customers on WhatsApp with campaigns, reminders, and delivery updates"
      headerActions={
        <Badge variant="secondary" className="animate-pulse">Coming soon</Badge>
      }
    >
      <ResponsiveGrid cols={3}>
        <StatCard title="Opted-in Contacts" value={0} icon={<MessageSquare className="h-8 w-8 text-green-600" />} />
        <StatCard title="Campaigns (Beta)" value={0} icon={<Send className="h-8 w-8 text-blue-600" />} />
        <StatCard title="Provider Status" value={config.connected ? "Connected" : "Disconnected"} icon={<Lock className="h-8 w-8 text-gray-600" />} animated={false} />
      </ResponsiveGrid>

      <FadeIn delay={100}>
        <StandardCard title="Provider Configuration (Preview)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Provider</Label>
              <Select
                value={config.provider}
                onValueChange={(v) => setConfig({ ...config, provider: v as any })}
                disabled
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Twilio">Twilio</SelectItem>
                  <SelectItem value="360Dialog">360Dialog</SelectItem>
                  <SelectItem value="MetaCloud">Meta Cloud (WA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Business Phone Number</Label>
              <Input value={config.phoneNumber} onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })} disabled placeholder="+971 50 000 0000" />
            </div>
            <div>
              <Label>API Key</Label>
              <Input value={config.apiKeyMasked} disabled />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button disabled>Connect</Button>
            <Button variant="outline" disabled>Test Message</Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Credentials are managed securely on the server (hidden in this preview). This feature will be enabled after provider approval.
          </p>
        </StandardCard>
      </FadeIn>

      <FadeIn delay={200}>
        <StandardCard title="Templates Preview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Refill Reminder</CardTitle></CardHeader>
              <CardContent className="text-sm whitespace-pre-wrap">
                Hi {{`{{customer_name}`}}}, your prescription for {{`{{medicine_name}`}} is ready for refill at {{`{{pharmacy_name}`}}. Reply YES to confirm.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Order Ready for Pickup</CardTitle></CardHeader>
              <CardContent className="text-sm whitespace-pre-wrap">
                Hello {{`{{customer_name}`}}}, your order is ready for pickup at {{`{{pharmacy_name}`}}. Show this code at the counter: {{`{{order_code}`}}}
              </CardContent>
            </Card>
          </div>
        </StandardCard>
      </FadeIn>

      <FadeIn delay={300}>
        <Card className="border-dashed border-2">
          <CardContent className="p-6 text-center">
            <div className="text-2xl">🚧</div>
            <div className="font-medium mt-2">Automations, Broadcasts, and Opt‑in tools arriving soon</div>
            <div className="text-sm text-gray-600">We’re finishing compliance and provider onboarding flows.</div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageContainer>
  );
};

export default WhatsAppMarketing;