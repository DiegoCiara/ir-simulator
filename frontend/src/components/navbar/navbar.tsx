import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '../ui/sidebar';
import { Navigation } from './navigation/navigation';

export function Navbar() {
  const isMobile = useIsMobile();

  return (
    <header className="w-full h-[80px] flex items-center justify-between px-10">
      <h1 className="text-[2rem] text-center font-semibold">IR Simulator</h1>
      {isMobile ? <SidebarTrigger className="-ml-1" /> : <Navigation />}
    </header>
  );
}
