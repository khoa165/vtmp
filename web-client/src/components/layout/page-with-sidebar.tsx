import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { SidebarProvider } from '#vtmp/web-client/components/base/sidebar';
import { InternalToolsSidebar } from '#vtmp/web-client/components/layout/internal-tools-sidebar';

export const PageWithSidebar = () => {
  const open = document.cookie.split('=')[1];
  const state = open === 'true';

  const token = localStorage.getItem('token');

  if (!token) {
    toast.warning('Please login to your account to continue');
    return <Navigate to="/login?redirected=true" />;
  }

  return (
    <SidebarProvider defaultOpen={state}>
      <InternalToolsSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
