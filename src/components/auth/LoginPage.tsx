import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Mail, Lock, User } from 'lucide-react';

export const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setErr(error.message);
    } else {
      const { error } = await signUp(email, password, { first_name, last_name });
      setErr(error ? error.message : 'Check your email for the confirmation link!');
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Pharmacy Management Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Invitation-only access
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input className="pl-9" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
                      </div>
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={last_name} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {err && (
              <Alert className="mt-4">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};