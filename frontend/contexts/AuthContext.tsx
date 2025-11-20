import React, { createContext, useState, useContext, useEffect } from 'react';
import { setItem, getItem, removeItem } from '@/services/Storage'; 
import Food, { FoodCategory } from '@/types/Food';

interface AuthContextType {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

const food: Food[] = [
  { name: "apple", icon: "🍎", amount: 2, category: FoodCategory.Fruit },
  { name: "banana", icon: "🍌", amount: 1, category: FoodCategory.Fruit },
  { name: "broccoli", icon: "🥦", amount: 3, category: FoodCategory.Vegetable },
  { name: "meat", icon: "🥩", amount: 8, category: FoodCategory.Meat },
  { name: "baguette", icon: "🥖", amount: 5, category: FoodCategory.Junk },
  { name: "cheese", icon: "🍪", amount: 4, category: FoodCategory.Snack },
  { name: "cookie", icon: "🧀", amount: 3, category: FoodCategory.Snack },
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await getItem('userToken');
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