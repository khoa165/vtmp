import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { InternalToolsSidebar } from '@/components/layout/internal-tools-sidebar';
import { SidebarProvider } from '@/components/base/sidebar';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { toast } from 'sonner';
export const PageWithSidebar = () => {
  const open = document.cookie.split('=')[1];
  const state = open === 'true';

  const token = localStorage.getItem('token');
  const navigate = useNavigatePreserveQueryParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsRedirecting(true);
      navigate('/login');
      toast('Please login to your account to continue');
    }
  }, [token]);

  if (isRedirecting) {
    return (
      <h1
        className="text-center text-white text-4xl app-flex"
        style={{ height: '100vh' }}
      >
        Redirecting...
      </h1>
    );
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
