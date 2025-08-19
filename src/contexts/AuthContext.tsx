import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Profile = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: 'platform_owner' | 'user';
  current_organization_id?: string | null;
  current_location_id?: string | null;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo_url?: string | null;
  status: string;
};

type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'pharmacist' | 'cashier' | 'inventory_manager';
  permissions: Record<string, boolean>;
  location_ids: string[];
  status: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  organization: Organization | null;
  membership: OrganizationMember | null;
  organizations: Organization[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<OrganizationMember | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileBundle = async (userId: string) => {
    // Profile
    const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!p) return;
    setProfile(p);

    // Memberships + orgs
    const { data: members } = await supabase
      .from('organization_members')
      .select('*, organizations(*)')
      .eq('user_id', userId)
      .eq('status', 'active');

    const orgs: Organization[] = (members || [])
      .map((m: any) => m.organizations)
      .filter(Boolean);
    setOrganizations(orgs);

    // Choose current org
    let currentOrg: Organization | null = null;
    let currentMembership: OrganizationMember | null = null;

    if (p.current_organization_id) {
      currentOrg = orgs.find((o) => o.id === p.current_organization_id) || null;
      currentMembership = (members || []).find((m: any) => m.organization_id === p.current_organization_id) || null;
    } else if (orgs.length > 0) {
      currentOrg = orgs[0];
      currentMembership = (members || [])[0] || null;
    }

    setOrganization(currentOrg);
    setMembership(currentMembership || null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfileBundle(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfileBundle(session.user.id);
      } else {
        setProfile(null);
        setOrganization(null);
        setMembership(null);
        setOrganizations([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, data?: Record<string, any>) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data } });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const switchOrganization = async (orgId: string) => {
    if (!user) return;
    await supabase.from('profiles').update({ current_organization_id: orgId }).eq('id', user.id);
    await fetchProfileBundle(user.id);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfileBundle(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        organization,
        membership,
        organizations,
        loading,
        signIn,
        signUp,
        signOut,
        switchOrganization,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};