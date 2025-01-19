// src/contexts/UserContext.js
import { api } from '@/api/api';
import { User } from '@/types/User';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface UserContextInterface {
  createUser: (data: User) => Promise<AxiosResponse>; // Update to accept a User argument
  getUsers: () => Promise<AxiosResponse>;
  getUser: (id: string) => Promise<AxiosResponse>;
  deleteUser: (id: string) => Promise<AxiosResponse>;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  async function getUsers() {
    const response = await api.get('/user');
    return response;
  }

  async function getUser(id: string) {
    const response = await api.get(`/user/${id}`);
    return response;
  }

  async function createUser(data: User) {
    const response = await api.post('/user', data);
    return response;
  }

  async function deleteUser(id: string) {
    const response = await api.delete(`/user/${id}`);
    return response;
  }

  return (
    <UserContext.Provider value={{ getUsers, createUser, getUser, deleteUser }}>
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
