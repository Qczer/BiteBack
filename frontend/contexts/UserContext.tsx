import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { getItem, getToken, removeItem, removeToken } from '@/services/Storage'; 
import { auth, getUser } from '@/api/endpoints/user';
import User from '@/types/User';

interface UserContextType {
  user: User | null;
  userId: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        setToken(token ?? "");

        if (token) {
          const res = await auth(token);
  
          if (res.success)
            setUserId(res.data.userId);
          else {
            removeItem("userId")
            removeToken();
            return;
          }

          const userRes = await getUser(res.data.userId);

          if (userRes.success)
            setUser(userRes.data)
        }
      }
      catch (error) {
        console.error("Failed to load User from storage", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token])

  const clearUser = () => {
    setUserId("");
    setUser(null);
  }

  const value = useMemo(() => {
    return {
      user,
      userId,
      token,
      setToken,
      clearUser
    };
  }, [user, userId]);

  if (isLoading)
    return null; 

  return (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};