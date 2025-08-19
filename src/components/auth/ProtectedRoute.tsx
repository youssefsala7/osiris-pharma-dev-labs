import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { OrganizationSelector } from './OrganizationSelector';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, profile, organization, membership, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // If not platform owner and no org selected, show selector
  if (profile?.role !== 'platform_owner' && !organization) {
    return <OrganizationSelector />;
  }

  if (requiredRoles.length > 0 && membership && !requiredRoles.includes(membership.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don’t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};