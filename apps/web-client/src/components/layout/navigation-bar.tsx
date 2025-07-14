import { Menu } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useGate } from 'statsig-react';

import { Button } from '#vtmp/web-client/components/base/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '#vtmp/web-client/components/base/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '#vtmp/web-client/components/base/sheet';

export const Navbar = () => {
  const { value: show_experimental_features, isLoading } = useGate(
    'show_experimental_features'
  );

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/summary', label: 'Summary' },
    { href: '/people', label: 'People' },
    { href: '/resources', label: 'Resources' },
    ...(!isLoading && show_experimental_features
      ? [{ href: '/projects', label: 'Projects' }]
      : []),
    { href: '/stats', label: 'Stats' },
  ];

  return (
    <nav className="w-full border-b border-white/10 bg-transparent">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <img
            alt="Viet Tech logo"
            src="https://res.cloudinary.com/khoa165/image/upload/v1718192551/viettech/VTMP_logo.png"
            className="h-10 w-10"
          />
          <span className="hidden font-bold text-white sm:inline-block">
            Viet Tech Mentorship Program
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu className="bg-transparent">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/10"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-white hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#05162d] border-l border-white/10 p-0"
            >
              <div className="flex flex-col px-6 py-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex w-full items-center py-4 text-base font-medium text-white hover:text-viettech-green transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
