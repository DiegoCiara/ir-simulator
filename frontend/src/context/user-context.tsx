// src/contexts/UserContext.js
import { api } from '@/api/api';
import { User } from '@/types/User';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface UserContextInterface {
  createUser: (data: User) => Promise<AxiosResponse>;
  getUser: (id: string) => Promise<AxiosResponse>;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {

  async function getUser(id: string) {
    const response = await api.get(`/user/${id}`);
    return response;
  }

  async function createUser(data: User) {
    const response = await api.post('/user', data);
    return response;
  }

  return (
    <UserContext.Provider value={{  createUser, getUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};
