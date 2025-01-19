import  { useState, createContext, useEffect, useContext, ReactNode } from "react";
import { User } from "../types/User";
import { api } from "../api/api";
import { toast } from "react-toastify";

interface AuthContextInterface {
  token: string;
  signIn: (myToken: string, user: User) => void;
  login: (email: string, password: string) => Promise<any>;
  editUserPassword: (userId: string, data: { password: string; confirmPassword: string }) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  api: typeof api;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);


interface AuthProviderInterface{
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    const storagedToken: string | null = sessionStorage.getItem("@ir-simulator:token");
    const storagedUser = sessionStorage.getItem("@ir-simulator:user");

    if (storagedToken && storagedUser) {
      setToken(storagedToken);
      setUser(JSON.parse(storagedUser));
    }
  }, []);


  const signIn = async (myToken: string, user: User ) => {
    const userStringfy = JSON.stringify(user);
    setToken(myToken);
    setUser(user);
    sessionStorage.setItem("@ir-simulator:user", userStringfy);
    sessionStorage.setItem("@ir-simulator:token", myToken);
  };

  const signOut = () => {
    setToken('');
    sessionStorage.removeItem("@ir-simulator:user");
    sessionStorage.removeItem("@ir-simulator:token");
  };

  async function login(email: string, password: string) {
      try {
        const response = await api.post("/auth/authenticate", { email, password });
        // console.warn(response.status)
        if (response.status === 200) {
          signIn(response.data.token, response.data);
        }
        return response
      } catch (error: any) {
        console.error(error)
        toast.error(`${error.response.data.message}`)
      }
  }

  const editUserPassword = async (userId: string, data: { password: string, confirmPassword: string}) => {
    try {
      await api.put(`/user/${userId}/update-password/${userId}`, data);

      return;
    } catch (error) {
      console.error(error)
      return;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        signIn,
        login,
        editUserPassword,
        signOut,
        user,
        setUser,
        api, // Forneça a instância do Axios configurada para uso em componentes filhos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Função para usar o contexto de autenticação em componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};