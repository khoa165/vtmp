import {
  LayoutDashboard,
  LogOut,
  MailPlus,
  Link2,
  SquareCheckBig,
  Share2,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { SystemRole } from '@vtmp/common/constants';

import { Avatar } from '#vtmp/web-client/components/base/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '#vtmp/web-client/components/base/sidebar';
import { TreverseFullLogo } from '#vtmp/web-client/components/base/treverse-full-logo';
import { TreverseLogo } from '#vtmp/web-client/components/base/treverse-logo';
import { useCurrentUser } from '#vtmp/web-client/hooks/useCurrentUser';
import { useLogout } from '#vtmp/web-client/hooks/useLogout';

export const InternalToolsSidebar = () => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  const items = [
    {
      title: 'Invitations',
      url: '/admin/invitations',
      icon: MailPlus,
      roles: [SystemRole.ADMIN],
    },
    {
      title: 'Pending Links',
      url: '/admin/links',
      icon: Link2,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR],
    },
    {
      title: 'Jobs',
      url: '/jobs',
      icon: LayoutDashboard,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
    {
      title: 'Applications',
      url: '/applications',
      icon: SquareCheckBig,
      roles: [SystemRole.USER],
    },
    {
      title: 'Share Link',
      url: '/links',
      icon: Share2,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
  ];

  const visibleItems = useMemo(
    () =>
      user
        ? items.filter((item) =>
            item.roles.some((role) => user.role.includes(role))
          )
        : [],
    [user, items]
  );

  const { logout } = useLogout();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/jobs" className="w-full" aria-label="Home">
                    {state === 'collapsed' ? (
                      <TreverseLogo />
                    ) : (
                      <TreverseFullLogo />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} aria-label={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {state !== 'collapsed' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/login" aria-label="Log out" onClick={logout}>
                      <LogOut />
                      <span>Log out</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Avatar />
              <SidebarTrigger />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
