'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Navigation } from './navigation';
import { useAuth } from '@/context/auth-context';
import { NavUser } from './nav-user';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <h1 className='text-[2rem] text-center
          '>IR Simulator</h1>
        </SidebarHeader>
        <SidebarContent>
          <Navigation />
          {/* <NavMain items={data.navMain} /> */}
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user!} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
}
