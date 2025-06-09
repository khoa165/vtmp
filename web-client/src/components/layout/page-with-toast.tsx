import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/base/sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';

export const PageWithToast = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="bg-background dark:bg-background">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};
