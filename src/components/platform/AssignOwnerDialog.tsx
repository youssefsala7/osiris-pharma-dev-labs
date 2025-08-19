import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { showError, showSuccess } from '@/utils/toast';

interface AssignOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | null;
  defaultRole?: 'owner' | 'admin' | 'manager' | 'pharmacist' | 'cashier' | 'inventory_manager';
  onAssigned?: () => void;
}

export const AssignOwnerDialog = ({
  open,
  onOpenChange,
  organizationId,
  defaultRole = 'owner',
  onAssigned,
}: AssignOwnerDialogProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!organizationId) return;
    if (!email) return showError('Please enter an email');

    setSubmitting(true);
    const { error } = await supabase.rpc('add_org_member_by_email', {
      p_org_id: organizationId,
      p_email: email,
      p_role: role,
    });

    if (error) {
      showError(error.message);
      setSubmitting(false);
      return;
    }
    showSuccess(`Assigned ${email} as ${role}`);
    setSubmitting(false);
    setEmail('');
    onAssigned?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Member by Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={submit} disabled={submitting || !organizationId}>
            {submitting ? 'Assigning…' : 'Assign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};