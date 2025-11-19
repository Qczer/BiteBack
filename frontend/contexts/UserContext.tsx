import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { setItem, getItem } from '@/services/AuthService'; 
import User from '@/classes/User';
import Food, { FoodCategory } from '@/classes/Food';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  addFoodToFridge: (newFood: Food) => void;
  removeFoodFromFridge: (food: Food) => void;
  addToBiteScore: (points: number) => void;
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

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!user)
      return;
    setUser({ ...user, fridge: food })
  }, [])

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  }

  const addFoodToFridge = (newFood: Food) => {
    if (!user)
      return;

    const updatedFridge = [...user.fridge, newFood];
    setUser({ ...user, fridge: updatedFridge });
  }

  const removeFoodFromFridge = (food: Food) => {
    if (!user)
      return;

    const updatedFridge = user.fridge.filter(f => f !== food);
    setUser({ ...user, fridge: updatedFridge });
  }

  const addToBiteScore = (points: number) => {
    if (!user)
      return;
    
    setUser({ ...user, biteScore: user.biteScore + points });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        addFoodToFridge,
        removeFoodFromFridge,
        addToBiteScore
      }}
    >
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