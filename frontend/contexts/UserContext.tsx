import { getFridge } from "@/api/endpoints/fridge";
import { auth, getUser } from "@/api/endpoints/user";
import { getToken, removeItem, removeToken } from "@/services/Storage";
import Food from "@/types/Food";
import User, {UserFriendsInterface} from "@/types/User";
import React, {
  createContext,
  ReactNode, useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {getFriends} from "@/api/endpoints/friends";

interface UserContextType {
  user: User | null;
  userID: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userFood: Food[];
  userFriends: UserFriendsInterface | null;
  setUserFood: React.Dispatch<React.SetStateAction<Food[]>>;
  setUserFriends: React.Dispatch<React.SetStateAction<UserFriendsInterface | null>>;
  getNotifications: () => Promise<number>;
  clearUser: () => void;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [userFood, setUserFood] = useState<Food[]>([]);
  const [userFriends, setUserFriends] = useState<UserFriendsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const token = await getToken();
      setToken(token ?? "");

      if (token) {
        const authRes = await auth(token);

        if (authRes.success)
          setUserID(authRes.data.userID);
        else {
          removeToken();
          return;
        }

        const userRes = await getUser(authRes.data.userID);

        const friendsRes = await getFriends(authRes.data.userID, token);

        if (userRes.success)
          setUser(userRes.data);
        if (friendsRes.data)
          setUserFriends(friendsRes.data);

        const fetchData = async () => {
          const fridgeRes = await getFridge(authRes.data.userID);
          if (fridgeRes?.data)
            setUserFood(fridgeRes.data.fridge);
        };

        fetchData();
      }
    } catch (error) {
      console.error("Failed to load User from storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    const intervalId = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [refreshData]);

  const clearUser = () => {
    setUserID("");
    setUser(null);
    setUserFriends(null);
  };

  const getNotifications = async () => {
    // jedzenie
    const rottingFood = userFood.filter((item) => {
      const now = new Date();
      const expiryDate = new Date(item.expDate!);
      const timeDiff = expiryDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff <= 1;
    });

    const amount = rottingFood.length;

    // zaproszenia
    return amount;
  };
  const value = useMemo(() => {
    return {
      user,
      userID,
      token,
      setToken,
      userFood,
      setUserFood,
      userFriends,
      setUserFriends,
      getNotifications,
      clearUser,
      refreshData
    };
  }, [
    user,
    userID,
    token,
    setToken,
    userFood,
    setUserFood,
    userFriends,
    setUserFriends,
    getNotifications,
    clearUser,
    refreshData
  ]);

  if (isLoading) return null;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
