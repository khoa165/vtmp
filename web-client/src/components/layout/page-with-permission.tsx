import React from 'react';
import { SystemRole } from '@vtmp/common/constants';
import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const PageWithPermission = ({ roles }: { roles: SystemRole[] }) => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
};
