import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { InternalToolsSidebar } from '@/components/layout/internal-tools-sidebar';
import { SidebarProvider } from '@/components/base/sidebar';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
export const PageWithSidebar = () => {
  const open = document.cookie.split('=')[1];
  const state = open === 'true';

  const token = localStorage.getItem('token');
  const navigate = useNavigatePreserveQueryParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to login');
      setIsRedirecting(true);
      navigate('/login');
    }
  }, [token]);

  // if (isRedirecting) {
  //   return (
  //     <h1
  //       className="text-center text-white app-flex"
  //       style={{ height: '100vh' }}
  //     >
  //       Redirecting...
  //     </h1>
  //   );
  // }

  return isRedirecting ? (
    <h1 className="text-center text-white app-flex" style={{ height: '100vh' }}>
      Redirecting...
    </h1>
  ) : (
    <SidebarProvider defaultOpen={state}>
      <InternalToolsSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
