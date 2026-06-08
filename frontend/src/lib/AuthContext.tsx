import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './api';

export type UserData = {
  id: string;
  email: string;
  display_name: string;
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.getToken().then((storedToken) => {
      setTokenState(storedToken);
      setIsLoading(false);
    });
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
