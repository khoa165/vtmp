import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/base/sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';

export const ApplicationTrackerWrapper = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Outlet />
    </ThemeProvider>
  );
};
