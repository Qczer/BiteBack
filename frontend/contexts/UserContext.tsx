import { getFridge } from "@/api/endpoints/fridge";
import { auth, getUser } from "@/api/endpoints/user";
import { getToken, removeItem, removeToken } from "@/services/Storage";
import Food from "@/types/Food";
import User from "@/types/User";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserContextType {
  user: User | null;
  userID: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userFood: Food[];
  setUserFood: React.Dispatch<React.SetStateAction<Food[]>>;
  getNotifications: () => Promise<number>;
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

          if (authRes.success) setuserID(authRes.data.userID);
          else {
            removeItem("userID");
            removeToken();
            return;
          }

          const userRes = await getUser(authRes.data.userID);

          if (userRes.success) setUser(userRes.data);

          const fetchData = async () => {
            const fridgeRes = await getFridge(authRes.data.userID);
            if (fridgeRes?.data) setUserFood(fridgeRes.data.fridge);
          };

          fetchData();
        }
      } catch (error) {
        console.error("Failed to load User from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const clearUser = () => {
    setuserID("");
    setUser(null);
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
      getNotifications,
      clearUser,
    };
  }, [
    user,
    userID,
    token,
    setToken,
    userFood,
    setUserFood,
    getNotifications,
    clearUser,
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
