import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SystemRole } from '@vtmp/common/constants';

import { useCurrentUser } from '#vtmp/web-client/hooks/useCurrentUser';

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
