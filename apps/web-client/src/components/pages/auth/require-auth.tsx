import { useCurrentUser } from '@/hooks/useCurrentUser';
import React from 'react';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }
  return <>{children}</>;
};
