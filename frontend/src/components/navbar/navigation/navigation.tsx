import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useNavigate } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/components/mode-toggle/mode-toggle';

export function Navigation() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const pages = [
    {
      url: '/declarations',
      name: 'Declarações',
    },

    {
      url: '/users',
      name: 'Usuários',
    },
    {
      url: '/account',
      name: 'Conta',
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`${
          isMobile &&
          'flex flex-col h-[80vh] gap-5 w-[17.5rem] items-start justify-start px-5'
        }`}
      >
        {pages.map((e) => (
          <NavigationMenuItem onClick={() => navigate(e.url)}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {e.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <ModeToggle />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
