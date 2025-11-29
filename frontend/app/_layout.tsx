import { useFonts } from "expo-font";
import {Slot, usePathname, useRouter, useSegments} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, {useEffect, useState} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { getItem } from "@/services/Storage";
import * as Notifications from "expo-notifications";
import { useNotificationObserver } from "@/hooks/useNotifications";
import CustomSplashScreen from "@/components/SplashScreen";
import {LanguageProvider, useLanguage} from "@/contexts/LanguageContext";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import translate from "@/locales/i18n";
import toastConfig from "@/components/ToastConfig";

SplashScreen.preventAutoHideAsync();

let hasAppNavigatedOnce = false;

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <LanguageProvider>
        <StatusBar style="dark" hidden={false} backgroundColor="transparent" />
        <InitialLayout />
      </LanguageProvider>
    </UserProvider>
  );
}

function InitialLayout() {
  const { userID, isLoading: isUserLoading, isConnected } = useUser();
  const { isLoading: isLangLoading } = useLanguage();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [launchedByNotification, setLaunchedByNotification] = useState(false);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useNotificationObserver(userID);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      !launchedByNotification
    ) {
      setLaunchedByNotification(true);
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (!isConnected) {
      Toast.show({
        type: "error",
        text1: translate("common.noInternetConnection"),
        position: "top",
        autoHide: false,
        swipeable: false,
      });
    }
    else
      Toast.hide();
  }, [isConnected]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeen = await getItem("hasSeenWelcomeScreen");
        setIsFirstLaunch(!hasSeen);
      }
      catch {
        setIsFirstLaunch(false);
      }
      finally {
        setIsStorageLoading(false);
      }
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isUserLoading || isLangLoading || isStorageLoading || hasAppNavigatedOnce) return;

    hasAppNavigatedOnce = true;

    const inAuthGroup = segments[0] === "(auth)";
    const atRoot = !pathname || pathname === "/";

    if (userID) {
      if (launchedByNotification)
        return;

      if (inAuthGroup || atRoot) {
        router.replace("/(tabs)/HomeScreen");
      }
    }
    else {
      if (!inAuthGroup) {
        const routeName = isFirstLaunch ? "WelcomeScreen" : "LoginScreen";
        router.replace(`/(auth)/${routeName}`);
      }
    }
  }, [userID, isUserLoading, isLangLoading, isStorageLoading, segments, isFirstLaunch, launchedByNotification]);

  if (!hasAppNavigatedOnce && (pathname === "/" || isUserLoading || isLangLoading || isStorageLoading))
    return <CustomSplashScreen />;

  return (
    <>
      <Slot />
      <Toast config={toastConfig} />
    </>
  );
}