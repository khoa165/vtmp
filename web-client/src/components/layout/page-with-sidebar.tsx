import { useEffect } from 'react';
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

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast('Please login to your account to continue');
    }
  }, [token]);

  return (
    <SidebarProvider defaultOpen={state}>
      <InternalToolsSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
