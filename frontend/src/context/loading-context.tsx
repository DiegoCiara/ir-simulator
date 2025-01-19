import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingContextInterface {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onLoading: () => Promise<void>;
  offLoading: () => Promise<void>;
}

const LoadingContext = createContext<LoadingContextInterface | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoading] = useState(false);

  async function onLoading() {
    await setLoading(true);
  }

  async function offLoading() {
    await setLoading(false)
  }

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading, onLoading, offLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an LoadingProvider");
  }
  return context;
};
