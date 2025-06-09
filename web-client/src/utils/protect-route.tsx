import React, { useEffect } from 'react';
import { z } from 'zod';

import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { UserRole } from '@vtmp/common/constants';

const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
  email: z.string().email(),
});

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
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
