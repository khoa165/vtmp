import React, { useEffect } from 'react';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { SystemRole } from '@vtmp/common/constants';
import { z } from 'zod';

const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(SystemRole),
  email: z.string().email(),
});

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: SystemRole[];
}) => {
  let rawUser = localStorage.getItem('user');
  const navigate = useNavigatePreserveQueryParams();

  if (!rawUser) {
    rawUser = '';
    navigate('/login');
  }

  const user = UserSchema.parse(JSON.parse(rawUser));

  useEffect(() => {
    if (!roles.some((role) => user.role.includes(role))) {
      navigate('/404');
    }
  }, [roles, user]);

  return children;
};
