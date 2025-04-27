import React from 'react';
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
import { UserLogo } from '@/components/base/user-logo';
import { JobTrackrLogo } from '@/components/base/jobtrackr-logo';
export const InternalToolsSidebar = () => {
  const items = [
    {
      title: 'Users',
      url: '/user-management',
      icon: ShieldUser,
    },
    {
      title: 'Links',
      url: '/link-sharing',
      icon: ExternalLink,
    },
    {
      title: 'Jobs',
      url: '/job-postings',
      icon: LayoutDashboard,
    },
    {
      title: 'Applications',
      url: '/application-tracker',
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-no-hover
                  className="[data-no-hover]:hover:bg-transparent"
                >
                  <a href="/application-tracker" className="w-full">
                    <VTMPLogo />
                    <JobTrackrLogo />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {items.map((item) => (
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
              <UserLogo />
              <SidebarTrigger />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
