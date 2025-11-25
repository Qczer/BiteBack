import { getFridge } from "@/api/endpoints/fridge";
import {auth, getNotifications, getUnreadNotifications, getUser} from "@/api/endpoints/user";
import { getToken } from "@/services/Storage";
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
import {
  registerForPushNotificationsAsync,
  useNotificationObserver
} from "@/hooks/useNotifications";
import {axiosClient} from "@/api/axiosClient";
import NotificationClass from "@/types/Notification";

interface UserContextType {
  user: User | null;
  userID: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userFood: Food[];
  userFriends: UserFriendsInterface | null;
  setUserFood: React.Dispatch<React.SetStateAction<Food[]>>;
  setUserFriends: React.Dispatch<React.SetStateAction<UserFriendsInterface | null>>;
  notifications: NotificationClass[];
  unreadNotifications: NotificationClass[];
  clearUser: () => void;
  refreshData: () => Promise<void>;
  expoPushToken: string;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [userFood, setUserFood] = useState<Food[]>([]);
  const [userFriends, setUserFriends] = useState<UserFriendsInterface | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationClass[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const currentToken = await getToken();
      if(!currentToken)
        return;

      setToken(currentToken);

      const authRes = await auth(currentToken);
      if (!authRes.success)
        return;

      setUserID(authRes.data.userID);

      const [userRes, friendsRes, fridgeRes, notificationsRes, unreadNotificationsRes] = await Promise.all([
        getUser(authRes.data.userID, currentToken),
        getFriends(authRes.data.userID, currentToken),
        getFridge(authRes.data.userID, currentToken),
        getNotifications(authRes.data.userID, currentToken),
        getUnreadNotifications(authRes.data.userID, currentToken)
      ]);

      if (userRes.success) setUser(userRes.data);
      if (friendsRes.data) setUserFriends(friendsRes.data);
      if (fridgeRes?.data) setUserFood(fridgeRes.data.fridge);
      if (notificationsRes) setNotifications(notificationsRes);
      if (unreadNotificationsRes) setUnreadNotifications(unreadNotificationsRes);

      console.log(userRes.data);
    }
    catch (error) {
      console.error("Failed to load User from storage", error);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const registerPushToken = async () => {
      if (!token)
        return;

      try {
        const tokenExpo = await registerForPushNotificationsAsync();
        if (!tokenExpo || tokenExpo === expoPushToken)
          return;

        setExpoPushToken(tokenExpo);

        await axiosClient.post(
          "/user/push-token",
          { token: tokenExpo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      catch (err) {
        console.error("Error sending push token:", err);
      }
    };

    registerPushToken();
  }, [token]);

  useEffect(() => {
    refreshData();

    const intervalId = setInterval(refreshData, 60000);
    return () => clearInterval(intervalId);
  }, [refreshData]);

  useNotificationObserver();

  const clearUser = () => {
    setUserID("");
    setUser(null);
    setUserFriends(null);
    setNotifications([]);
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
      expoPushToken,
      clearUser,
      refreshData,
      notifications,
      unreadNotifications
    };
  }, [user, token, setToken, setUserFood, setUserFriends, expoPushToken, refreshData, notifications, unreadNotifications]);

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