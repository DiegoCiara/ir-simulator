import './App.css';
import Loading from './components/loading';
import { AuthProvider } from './context/auth-context';
import { LoadingProvider } from './context/loading-context';
import { ThemeProvider } from './context/theme-context';
import { AppRoute } from './routes/app.routes';

function App() {

  return (
    <>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <Loading/>
            <AppRoute />
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
