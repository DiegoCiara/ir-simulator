import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useLocation, useNavigate } from 'react-router-dom';

import { LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formats';

export function Navigation() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { onLoading, offLoading } = useLoading();
  const { user, signOut } = useAuth();
  const pages = [
    {
      url: '/declarations',
      name: 'Declarações',
    },
  ];

  const location = useLocation()

  async function logout() {
    await onLoading();
    try {
      await signOut();
      navigate('/login');
      await offLoading();
    } catch (error) {
      console.error(error);
    } finally {
      await offLoading();
    }
  }

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`${
          isMobile
            ? 'flex flex-col h-[80vh] gap-5 w-[17.5rem] items-start justify-start px-5'
            : 'flex gap-2'
        }`}
      >
        {pages.map((e) => (
          <NavigationMenuItem onClick={() => navigate(e.url)}>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname === e.url && 'underline'}`}>
              {e.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <ModeToggle />
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>{getInitials(user!.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={'bottom'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user!.name}</span>
                    <span className="truncate text-xs">{user!.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
