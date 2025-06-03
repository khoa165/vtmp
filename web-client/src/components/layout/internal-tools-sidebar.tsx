import { useEffect, useMemo } from 'react';
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
import { UserRole } from '@vtmp/common/constants';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { Link } from 'react-router-dom';

export const InternalToolsSidebar = () => {
  interface IUser {
    role: UserRole;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  const rawUser = localStorage.getItem('user');
  const user: IUser | null = rawUser && JSON.parse(rawUser);

  const navigate = useNavigatePreserveQueryParams();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const items = [
    {
      title: 'Users',
      url: '/user-invitation',
      icon: ShieldUser,
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Links',
      url: '/link-sharing',
      icon: ExternalLink,
      roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
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
                  <Link
                    to="/application-tracker"
                    className="w-full"
                    aria-label="Home"
                  >
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
