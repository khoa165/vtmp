import { Navbar } from './navigation-bar';
import { Outlet } from 'react-router-dom';

export const PageWithNavigation = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
