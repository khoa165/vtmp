import React from 'react';
import { Outlet } from 'react-router-dom';
import { InternalToolsSidebar } from '@/components/layout/internal-tools-sidebar';
import { SidebarProvider } from '@/components/base/sidebar';
export const PageWithSidebar = () => {
  const open = document.cookie.split('=')[1];
  const state = open === 'true';
  return (
    <SidebarProvider defaultOpen={state}>
      <InternalToolsSidebar />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
