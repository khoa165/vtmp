import { Outlet } from 'react-router-dom';

import { Navbar } from './navigation-bar';

export const PageWithNavigation = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
