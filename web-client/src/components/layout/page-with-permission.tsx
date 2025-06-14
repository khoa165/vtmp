import React, { useEffect } from 'react';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { UserRole } from '@vtmp/common/constants';
import { Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const PageWithPermission = ({ roles }: { roles: UserRole[] }) => {
  const user = useCurrentUser();
  const navigate = useNavigatePreserveQueryParams();
  useEffect(() => {
    if (!roles.some((role) => user?.role.includes(role))) {
      navigate('/404');
    }
  }, [roles, user]);

  return <Outlet />;
};
