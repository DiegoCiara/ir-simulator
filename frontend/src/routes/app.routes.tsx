import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/home.tsx';
import Login from '@/pages/login.tsx';
import PrivateRoute from './private.routes.tsx';
import { useTheme } from '@/context/theme-context.tsx';
import { ToastContainer } from 'react-toastify';
import { Navbar } from '@/components/navbar/navbar.tsx';
import Users from '@/pages/users.tsx';
import Account from '@/pages/account.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/navbar/app-sidebar/app-sidebar.tsx';
import Declarations from '@/pages/declarations.tsx';

export const AppRoute = () => {
  const { theme } = useTheme();

  const pages = [
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/users',
      component: Users,
    },
    {
      path: '/declarations',
      component: Declarations,
    },
    {
      path: '/account',
      component: Account,
    },
  ];

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/*'} element={<Login />} />
          {pages.map((e) => (
            <Route
              path={e.path}
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <SidebarInset>
                      <Navbar />
                      <AppSidebar side="right" />
                      <e.component />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </>
  );
};
