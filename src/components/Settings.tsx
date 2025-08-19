import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/ui/page-container";
import { StandardCard } from "@/components/ui/standard-card";
import {
  Settings as SettingsIcon,
  Store,
  Bell,
  Shield,
  Database,
  Printer,
  Mail,
  Save,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useAppSettings } from "@/providers/AppSettingsProvider";

export const Settings = () => {
  const { settings, setSettings, updateSettings } = useAppSettings();

  const [pharmacySettings, setPharmacySettings] = useState({
    name: settings.pharmacyName || "Al Kindi Pharmacy",
    address: "",
    phone: "+971 00 000 0000",
    email: "info@alkindi.ae",
    license: "PHARM-12345",
    taxId: "TAX-67890",
    operatingHours: "Mon-Sun: 8AM-10PM",
    location: settings.location || "Sharjah",
    logoUrl: settings.logoUrl || "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    expiryAlerts: true,
    salesReports: true,
    customerUpdates: false,
    systemMaintenance: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [systemSettings, setSystemSettings] = useState({
    currency: settings.currency.code || "AED",
    timezone: "Asia/Dubai",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    autoBackup: true,
    backupFrequency: "daily",
    sessionTimeout: "30"
  });

  useEffect(() => {
    // keep in sync if context changes externally
    setPharmacySettings((prev) => ({
      ...prev,
      name: settings.pharmacyName,
      location: settings.location,
      logoUrl: settings.logoUrl || "",
    }));
    setSystemSettings((prev) => ({
      ...prev,
      currency: settings.currency.code,
    }));
  }, [settings]);

  const handleSavePharmacySettings = () => {
    updateSettings({
      pharmacyName: pharmacySettings.name,
      location: pharmacySettings.location,
      logoUrl: pharmacySettings.logoUrl,
    });
    showSuccess("Pharmacy settings saved successfully!");
  };

  const handleSaveNotificationSettings = () => {
    showSuccess("Notification settings saved successfully!");
  };

  const handleSaveSystemSettings = () => {
    // Update currency mapping
    const currencyMap: Record<string, { symbol: string; locale: string }> = {
      AED: { symbol: "AED", locale: "en-AE" },
      USD: { symbol: "$", locale: "en-US" },
      EUR: { symbol: "€", locale: "de-DE" },
      GBP: { symbol: "£", locale: "en-GB" },
      SAR: { symbol: "SAR", locale: "ar-SA" },
    };
    const map = currencyMap[systemSettings.currency] || currencyMap["AED"];

    setSettings((prev) => ({
      ...prev,
      currency: {
        code: systemSettings.currency,
        symbol: map.symbol,
        position: "prefix",
        locale: map.locale,
      },
    }));
    showSuccess("System settings saved successfully!");
  };

  return (
    <PageContainer
      title="Settings"
      subtitle="Manage your pharmacy system configuration and preferences"
    >
      <Tabs defaultValue="pharmacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pharmacy" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            Pharmacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pharmacy">
          <StandardCard title="Pharmacy Information">
            <div className="space-y-6">
              {/* Branding block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input
                      id="pharmacyName"
                      value={pharmacySettings.name}
                      onChange={(e) => setPharmacySettings({...pharmacySettings, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location (City)</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Input
                        id="location"
                        value={pharmacySettings.location}
                        onChange={(e) => setPharmacySettings({...pharmacySettings, location: e.target.value})}
                        placeholder="Sharjah"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={pharmacySettings.logoUrl}
                      onChange={(e) => setPharmacySettings({...pharmacySettings, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use a square image (PNG/SVG), 256–512px recommended.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-2">Logo Preview</div>
                  {pharmacySettings.logoUrl ? (
                    <img
                      src={pharmacySettings.logoUrl}
                      alt="Logo preview"
                      className="w-24 h-24 rounded-lg object-cover border bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-white border flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={pharmacySettings.phone}
                    onChange={(e) => setPharmacySettings({...pharmacySettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={pharmacySettings.email}
                    onChange={(e) => setPharmacySettings({...pharmacySettings, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={pharmacySettings.address}
                  onChange={(e) => setPharmacySettings({...pharmacySettings, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={pharmacySettings.license}
                    onChange={(e) => setPharmacySettings({...pharmacySettings, license: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={pharmacySettings.taxId}
                    onChange={(e) => setPharmacySettings({...pharmacySettings, taxId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    value={pharmacySettings.operatingHours}
                    onChange={(e) => setPharmacySettings({...pharmacySettings, operatingHours: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSavePharmacySettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Pharmacy Settings
              </Button>
            </div>
          </StandardCard>
        </TabsContent>

        <TabsContent value="notifications">
          <StandardCard title="Notification Preferences">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStock">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified when inventory is running low</p>
                  </div>
                  <Switch
                    id="lowStock"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowStockAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="expiry">Expiry Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified about medicines nearing expiry</p>
                  </div>
                  <Switch
                    id="expiry"
                    checked={notificationSettings.expiryAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, expiryAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="salesReports">Sales Reports</Label>
                    <p className="text-sm text-gray-600">Receive daily and weekly sales summaries</p>
                  </div>
                  <Switch
                    id="salesReports"
                    checked={notificationSettings.salesReports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, salesReports: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <div>
                      <Label htmlFor="email">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    id="email"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via text message</p>
                  </div>
                  <Switch
                    id="sms"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotificationSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </StandardCard>
        </TabsContent>

        <TabsContent value="system">
          <StandardCard title="System Configuration">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - United Arab Emirates Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={"Asia/Dubai"} onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Gulf Standard Time (Dubai)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <p className="text-sm text-gray-600">Automatically backup system data</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={"daily"} onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </div>
          </StandardCard>
        </TabsContent>

        <TabsContent value="security">
          <StandardCard title="Security Settings">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <p className="text-sm text-gray-600">Configure password requirements for user accounts</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="minLength">Minimum Password Length</Label>
                    <Input id="minLength" type="number" defaultValue="8" />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Control</h3>
                <p className="text-sm text-gray-600">Manage user permissions and access levels</p>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage User Roles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Audit Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Security Report
                  </Button>
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </StandardCard>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};