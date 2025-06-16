import { useMemo } from 'react';
import {
  ShieldUser,
  ExternalLink,
  LayoutDashboard,
  BriefcaseBusiness,
  MessageSquareQuote,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/base/sidebar';
import { VTMPLogo } from '@/components/base/vtmp-logo';
import { Avatar } from '@/components/base/avatar';
import { JobTrackrLogo } from '@/components/base/jobtrackr-logo';
import { UserRole } from '@vtmp/common/constants';
import { Link, Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const InternalToolsSidebar = () => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  const items = [
    {
      title: 'Users',
      url: '/user-invitation',
      icon: ShieldUser,
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Pending Links',
      url: '/admin/links',
      icon: BriefcaseBusiness,
      roles: [UserRole.ADMIN, UserRole.MODERATOR],
    },
    {
      title: 'Jobs',
      url: '/job-postings',
      icon: LayoutDashboard,
      roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    },
    {
      title: 'Applications',
      url: '/application-tracker',
      icon: BriefcaseBusiness,
      roles: [UserRole.USER],
    },
    {
      title: 'Interview Feed',
      url: '/interview-feed',
      icon: MessageSquareQuote,
      roles: [UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR],
    },
    {
      title: 'Share Link',
      url: '/link-sharing',
      icon: ExternalLink,
      roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
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

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/job-postings" className="w-full" aria-label="Home">
                    <VTMPLogo />
                    <JobTrackrLogo />
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
