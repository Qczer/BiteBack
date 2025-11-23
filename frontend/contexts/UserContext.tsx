import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { getToken, removeItem, removeToken } from '@/services/Storage';
import { auth, getUser } from '@/api/endpoints/user';
import User from '@/types/User';
import Food from '@/types/Food';
import { getFridge } from '@/api/endpoints/fridge';

interface UserContextType {
  user: User | null;
  userID: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userFood: Food[];
  setUserFood: React.Dispatch<React.SetStateAction<Food[]>>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [userID, setuserID] = useState<string>("");
  const [userFood, setUserFood] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        setToken(token ?? "");

        if (token) {
          const authRes = await auth(token);
  
          if (authRes.success)
            setuserID(authRes.data.userID);
          else {
            removeItem("userID")
            removeToken();
            return;
          }

          const userRes = await getUser(authRes.data.userID);

          if (userRes.success)
            setUser(userRes.data)

          const fetchData = async () => {
            const fridgeRes = await getFridge(authRes.data.userID);
            if (fridgeRes?.data) setUserFood(fridgeRes.data.fridge);
          };
    
          fetchData();
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
    setuserID("");
    setUser(null);
  }

  const value = useMemo(() => {
    return {
      user,
      userID,
      token,
      setToken,
      userFood,
      setUserFood,
      clearUser
    };
  }, [user, userID, token, setToken, userFood, setUserFood, clearUser]);

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