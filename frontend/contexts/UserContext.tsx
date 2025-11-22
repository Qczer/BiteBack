import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { getItem, getToken, setItem } from '@/services/Storage'; 
import { auth, getUser } from '@/api/endpoints/user';
import User from '@/types/User';

interface UserContextType {
  user: User | null;
  userId: string;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();

        if (token) {
          const res = await auth(token);
  
          if (res.success) {
            setItem("userId", res.data.userId)
            setUserId(res.data.userId);
          }
          else
            return;

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
  }, [])

  const value = useMemo(() => {
    return {
      user,
      userId
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