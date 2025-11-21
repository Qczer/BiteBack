import React, { createContext, useState, useContext, useEffect } from 'react';
import { setItem, removeItem, getToken as getStorageToken } from '@/services/Storage'; 
import { auth } from '@/api/endpoints/users';

interface AuthContextType {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await getStorageToken();
      setToken(userToken);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const authContext = {
    token,
    isLoading,
    signIn: async (newToken: string) => {
      setToken(newToken);
      await setItem('userToken', newToken);
    },
    signOut: async () => {
      setToken(null);
      await removeItem('userToken');
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);