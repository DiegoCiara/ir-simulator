import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '@/pages/public/login.tsx';
import PrivateRoute from './private.routes.tsx';
import { useTheme } from '@/context/theme-context.tsx';
import { ToastContainer } from 'react-toastify';
import { Navbar } from '@/components/navbar/navbar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/navbar/app-sidebar/app-sidebar.tsx';
import Declarations from '@/pages/private/declarations.tsx';
import CreateDeclaration from '@/pages/private/create-declaration.tsx';
import SignUp from '@/pages/public/signup.tsx';
import QrCode2Fa from '@/pages/public/2fa-otp-qrcode.tsx';
import Otp from '@/pages/public/2fa-otp.tsx';
import RectifiedDeclaration from '@/pages/private/rectified-declaration.tsx';

export const AppRoute = () => {
  const { theme } = useTheme();

  const pages = [
    {
      path: '/declarations',
      component: Declarations,
    },
    {
      path: '/declarations/create',
      component: CreateDeclaration,
    },
    {
      path: '/declarations/retification/:id',
      component: RectifiedDeclaration,
    },
  ];

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/auth-2fa/:email'} element={<QrCode2Fa />} />
          <Route path={'/auth-2fa/otp/:email'} element={<Otp />} />
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
