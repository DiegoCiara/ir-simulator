import '@/App.css';
import Loading from '@/components/loading/loading';
import { AuthProvider } from '@/context/auth-context';
import { DeclarationProvider } from '@/context/declaration-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { UserProvider } from '@/context/user-context';
import { AppRoute } from '@/routes/app.routes';

function App() {
  return (
    <ThemeProvider defaultTheme='light'>
      <LoadingProvider>
        <AuthProvider>
          <UserProvider>
            <DeclarationProvider>
              <Loading />
              <AppRoute />
            </DeclarationProvider>
          </UserProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
