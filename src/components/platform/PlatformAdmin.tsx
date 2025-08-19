import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Plus, Users, Settings, MapPin } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

type Organization = {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  created_at: string;
  member_count?: number;
};

export const PlatformAdmin = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', slug: '', type: 'pharmacy' });

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('id,name,slug,type,status,created_at')
      .order('created_at', { ascending: false });

    if (error) return showError('Failed to fetch organizations');
    setOrganizations(data || []);
  };

  const createOrganization = async () => {
    if (!newOrg.name || !newOrg.slug) return showError('Please fill all fields');
    const slug = newOrg.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const { error } = await supabase.from('organizations').insert([{ name: newOrg.name, slug, type: newOrg.type }]);
    if (error) return showError(error.message);

    showSuccess('Organization created!');
    setIsCreateDialogOpen(false);
    setNewOrg({ name: '', slug: '', type: 'pharmacy' });
    fetchOrganizations();
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
          <p className="text-gray-600">Manage pharmacy organizations and access</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Pharmacy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Pharmacy Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Pharmacy Name</Label>
                <Input id="name" value={newOrg.name} onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" value={newOrg.slug} onChange={(e) => setNewOrg({ ...newOrg, slug: e.target.value })} />
                <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces. Used to identify the organization.</p>
              </div>
              <Button onClick={createOrganization} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pharmacies</p>
                <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Pharmacies</p>
                <p className="text-2xl font-bold text-gray-900">{organizations.filter(o => o.status === 'active').length}</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations Support</p>
                <p className="text-2xl font-bold text-gray-900">{organizations.filter(o => o.type === 'chain').length}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Members (est.)</p>
                <p className="text-2xl font-bold text-gray-900">—</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pharmacy Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="font-mono text-sm">{org.slug}</TableCell>
                  <TableCell><Badge variant="outline">{org.type}</Badge></TableCell>
                  <TableCell><Badge variant={org.status === 'active' ? 'default' : 'secondary'}>{org.status}</Badge></TableCell>
                  <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};