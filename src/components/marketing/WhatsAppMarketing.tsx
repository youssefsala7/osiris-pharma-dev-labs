import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Settings, Send, Users, TrendingUp, Clock, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export const WhatsAppMarketing = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <FadeIn>
        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4 relative animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Business Integration</h2>
            <p className="text-gray-600 mb-4">Connect with your customers through WhatsApp Business API</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                Beta Access Available
              </Badge>
            </div>
            <Button 
              onClick={() => setIsConfiguring(!isConfiguring)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure WhatsApp Business
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Preview Stats */}
      <FadeIn delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={0} suffix=" (Preview)" />
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={0} suffix=" (Preview)" />
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">0% (Preview)</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-gray-900">0 (Preview)</p>
                </div>
                <Send className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Configuration Panel */}
      {isConfiguring && (
        <FadeIn delay={300}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                WhatsApp Business API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Beta Feature</h4>
                    <p className="text-sm text-yellow-700">
                      WhatsApp Business API integration is currently in development. 
                      Configure your settings now to be ready when it launches.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessId">Business Account ID</Label>
                  <Input
                    id="businessId"
                    placeholder="Enter your WhatsApp Business Account ID"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number ID</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your Phone Number ID"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your WhatsApp Business API Access Token"
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="webhookToken">Webhook Verification Token</Label>
                <Input
                  id="webhookToken"
                  placeholder="Enter your webhook verification token"
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="welcomeMessage">Welcome Message Template</Label>
                <Textarea
                  id="welcomeMessage"
                  placeholder="Hello {{customer_name}}, welcome to {{pharmacy_name}}! We're here to help with all your healthcare needs."
                  rows={3}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Configuration will be saved for when the feature launches
                </div>
                <Button disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Feature Preview */}
      <FadeIn delay={400}>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium mb-1">Automated Messages</h4>
                <p className="text-sm text-gray-600">Send order confirmations, delivery updates, and reminders automatically.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-medium mb-1">Customer Segmentation</h4>
                <p className="text-sm text-gray-600">Target specific customer groups with personalized messages.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-medium mb-1">Analytics Dashboard</h4>
                <p className="text-sm text-gray-600">Track message delivery, read rates, and customer engagement.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};