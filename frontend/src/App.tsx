import './App.css';
import Loading from './components/loading/loading';
import { AuthProvider } from './context/auth-context';
import { LoadingProvider } from './context/loading-context';
import { ThemeProvider } from './context/theme-context';
import { UserProvider } from './context/user-context';
import { AppRoute } from './routes/app.routes';

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <UserProvider>
            <Loading />
            <AppRoute />
          </UserProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
