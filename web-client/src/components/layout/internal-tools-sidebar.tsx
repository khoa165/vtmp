import React, { useMemo } from 'react';
import {
  ShieldUser,
  ExternalLink,
  LayoutDashboard,
  BriefcaseBusiness,
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
import { SystemRole } from '@vtmp/common/constants';
export const InternalToolsSidebar = () => {
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const items = [
    {
      title: 'Users',
      url: '/user-invitation',
      icon: ShieldUser,
      roles: [SystemRole.ADMIN],
    },
    {
      title: 'Links',
      url: '/link-sharing',
      icon: ExternalLink,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
    {
      title: 'Jobs',
      url: '/job-postings',
      icon: LayoutDashboard,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
    {
      title: 'Applications',
      url: '/application-tracker',
      icon: BriefcaseBusiness,
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
  ];

  const visibleItems = useMemo(
    () =>
      items.filter((item) =>
        item.roles.some((role) => user.role.includes(role))
      ),
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
                  <a href="/application-tracker" className="w-full">
                    <VTMPLogo />
                    <JobTrackrLogo />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
