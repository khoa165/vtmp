import {
  ShieldUser,
  ExternalLink,
  LayoutDashboard,
  BriefcaseBusiness,
  UserRoundPlus,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { SystemRole } from '@vtmp/common/constants';

import { JobTrackrLogo } from '@/components/base/jobtrackr-logo';
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
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/base/tooltip';
import { VTMPLogo } from '@/components/base/vtmp-logo';
import { LogoutButton } from '@/components/base/logout-button';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const InternalToolsSidebar = () => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  const items = [
    {
      title: 'Manage Users',
      url: '/admin/invitations',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <ShieldUser />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Manage Users</h3>
          </TooltipContent>
        </Tooltip>
      ),
      roles: [SystemRole.ADMIN],
    },
    {
      title: 'Send Invites',
      url: '/admin/send-invitation',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <UserRoundPlus />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Send Invites</h3>
          </TooltipContent>
        </Tooltip>
      ),
      roles: [SystemRole.ADMIN],
    },
    {
      title: 'Review Links',
      url: '/admin/links',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <BriefcaseBusiness />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Review Links</h3>
          </TooltipContent>
        </Tooltip>
      ),
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR],
    },
    {
      title: 'Job Postings',
      url: '/job-postings',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <LayoutDashboard />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Job Postings</h3>
          </TooltipContent>
        </Tooltip>
      ),
      roles: [SystemRole.ADMIN, SystemRole.MODERATOR, SystemRole.USER],
    },
    {
      title: 'Applications',
      url: '/application-tracker',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <BriefcaseBusiness />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Applications</h3>
          </TooltipContent>
        </Tooltip>
      ),
      roles: [SystemRole.USER],
    },
    {
      title: 'Share Links',
      url: '/link-sharing',
      icon: (
        <Tooltip>
          <TooltipTrigger asChild>
            <ExternalLink />
          </TooltipTrigger>
          <TooltipContent>
            <h3>Share Links</h3>
          </TooltipContent>
        </Tooltip>
      ),
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
                      {item.icon}
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
              <LogoutButton
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Logout
              </LogoutButton>
              <SidebarTrigger />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
