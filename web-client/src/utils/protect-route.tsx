import React, { useEffect } from 'react';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { UserRole } from '@vtmp/common/constants';

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) => {
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const navigate = useNavigatePreserveQueryParams();

  useEffect(() => {
    if (!roles.some((role) => user.role.includes(role))) {
      navigate('/404');
    }
  }, [roles, user]);

  return children;
};
