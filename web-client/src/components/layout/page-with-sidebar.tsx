import React from 'react';
import { Outlet } from 'react-router-dom';
import { InternalToolsSidebar } from '@/components/layout/internal-tools-sidebar';
import { SidebarProvider } from '@/components/base/sidebar';
export const PageWithSidebar = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <InternalToolsSidebar />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
