import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Settings } from 'lucide-react';

export const OrganizationSelector = () => {
  const { organizations, switchOrganization, profile } = useAuth();
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSwitch = async (orgId: string) => {
    setSwitching(orgId);
    await switchOrganization(orgId);
    setSwitching(null);
  };

  if (organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>No Organizations</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have access to any pharmacy organizations yet.
            </p>
            <p className="text-sm text-gray-500">
              Contact your administrator to be invited.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (organizations.length === 1) {
    // Quick auto-switch handled in Sidebar dropdown on first render; nothing to show here
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Pharmacy
          </h1>
          <p className="text-gray-600">
            Choose which pharmacy you'd like to access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card 
              key={org.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSwitch(org.id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {org.logo_url ? (
                    <img 
                      src={org.logo_url as string} 
                      alt={org.name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {org.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {org.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Multiple locations</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Team member</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" disabled={switching === org.id}>
                  {switching === org.id ? 'Switching...' : 'Access Pharmacy'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {profile?.role === 'platform_owner' && (
          <div className="text-center mt-8">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Platform Administration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};