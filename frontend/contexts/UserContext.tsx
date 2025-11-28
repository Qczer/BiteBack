import { getFridge } from "@/api/endpoints/fridge";
import {
  addPushToken,
  auth,
  getNotifications,
  getUnreadNotifications,
  getUser,
  removePushToken
} from "@/api/endpoints/user";
import {getToken, removeToken} from "@/services/Storage";
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
import { registerForPushNotificationsAsync } from "@/hooks/useNotifications";
import {axiosClient} from "@/api/axiosClient";
import NotificationClass from "@/types/Notification";

interface UserContextType {
  isLoading: boolean;
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
  refreshData: (manualToken?: string) => Promise<void>;
  expoPushToken: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [userFood, setUserFood] = useState<Food[]>([]);
  const [userFriends, setUserFriends] = useState<UserFriendsInterface | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationClass[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearUser = useCallback(async () => {
    try {
      if (token && expoPushToken && user?._id)
        removePushToken(token, expoPushToken).catch(err => console.log("Push remove error ignored", err));
      await removeToken();
    }
    catch (e) {
      console.log("Error clearing user", e);
    }
    finally {
      setUserID("");
      setToken("");
      setUser(null);
      setUserFriends(null);
      setNotifications([]);
      setExpoPushToken(null);
    }
  }, [token, expoPushToken, user?._id]);

  const refreshData = useCallback(async (manualToken?: string) => {
    try {
      let currentToken = manualToken || await getToken();

      if(!currentToken) {
        console.log("⚠️ [refreshData] Brak tokenu -> Stop.");
        setIsLoading(false);
        return;
      }

      setToken(currentToken);

      const authRes = await auth(currentToken);
      if (!authRes.success) {
        console.error("❌ [refreshData] Auth failed. Wylogowuję.");
        await clearUser();
        setIsLoading(false);
        return;
      }

      const realId = authRes.data.userID || (authRes.data as any).userId  || (authRes.data as any)._id;
      if (!realId) {
        console.error("❌ [refreshData] Auth OK, ale brak ID! Backend zwraca:", Object.keys(authRes.data));
        setIsLoading(false);
        return;
      }

      setUserID(realId);

      const [userRes, friendsRes, fridgeRes, notificationsRes, unreadNotificationsRes] = await Promise.all([
        getUser(realId, currentToken),
        getFriends(realId, currentToken),
        getFridge(realId, currentToken),
        getNotifications(realId, currentToken),
        getUnreadNotifications(realId, currentToken)
      ]);

      if (userRes.success) setUser(userRes.data);
      if (friendsRes.data) setUserFriends(friendsRes.data);
      if (fridgeRes?.data) setUserFood(fridgeRes.data.fridge);
      if (notificationsRes) setNotifications(notificationsRes);
      if (unreadNotificationsRes) setUnreadNotifications(unreadNotificationsRes);
    }
    catch (error) {
      console.error("❌ [refreshData] CRITICAL ERROR:", error);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const registerPushToken = async () => {
      if (!token || !userID)
        return;

      try {
        const tokenExpo = await registerForPushNotificationsAsync();
        if (!tokenExpo || tokenExpo === expoPushToken)
          return;

        setExpoPushToken(tokenExpo);
        await addPushToken(token, tokenExpo);
      }
      catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          await clearUser();
        }
        console.error("Error sending push token:", err);
      }
    };

    registerPushToken();
  }, [token, userID]);

  useEffect(() => {
    refreshData();

    const intervalId = setInterval(refreshData, 10000);
    return () => clearInterval(intervalId);
  }, [refreshData]);

  const value = useMemo(() => {
    return {
      isLoading,
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
  }, [isLoading, user, token, setToken, setUserFood, setUserFriends, expoPushToken, refreshData, notifications, unreadNotifications, clearUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};