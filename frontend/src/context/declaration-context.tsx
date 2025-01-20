import { api } from '@/api/api';
import { Declaration } from '@/types/Declaration';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface DeclarationContextInterface {
  createDeclaration: (data: Declaration) => Promise<AxiosResponse>;
  rectifiedDeclaration: (
    id: string,
    data: Declaration,
  ) => Promise<AxiosResponse>;
  getDeclarations: () => Promise<AxiosResponse>;
  getDeclaration: (id: string) => Promise<AxiosResponse>;
  deleteDeclaration: (id: string) => Promise<AxiosResponse>;
  updateDeclaration: (id: string, data: Declaration) => Promise<AxiosResponse>;
}

const DeclarationContext = createContext<
  DeclarationContextInterface | undefined
>(undefined);

interface DeclarationProviderProps {
  children: ReactNode;
}

export const DeclarationProvider = ({ children }: DeclarationProviderProps) => {
  async function getDeclarations() {
    const response = await api.get('/declaration');
    return response;
  }

  async function getDeclaration(id: string) {
    const response = await api.get(`/declaration/${id}`);
    return response;
  }

  async function createDeclaration(data: Declaration) {
    const response = await api.post('/declaration', data);
    return response;
  }

  async function rectifiedDeclaration(id: string, data: Declaration) {
    const response = await api.post(`/declaration/rectified/${id}`, data);
    return response;
  }

  async function deleteDeclaration(id: string) {
    const response = await api.delete(`/declaration/${id}`);
    return response;
  }

  async function updateDeclaration(id: string, data: Declaration) {
    const response = await api.put(`/declaration/${id}`, data);
    return response;
  }

  return (
    <DeclarationContext.Provider
      value={{
        getDeclarations,
        createDeclaration,
        getDeclaration,
        deleteDeclaration,
        updateDeclaration,
        rectifiedDeclaration,
      }}
    >
      {children}
    </DeclarationContext.Provider>
  );
};

export const useDeclaration = () => {
  const context = useContext(DeclarationContext);
  if (!context) {
    throw new Error(
      'useDeclaration must be used within an DeclarationProvider',
    );
  }
  return context;
};
