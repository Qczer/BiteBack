import {Link, Stack, usePathname} from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import t from "@/locales/i18n"
import {useEffect} from "react";

export default function NotFoundScreen() {
  const pathname = usePathname();

  useEffect(() => {
    // Logujemy błędną ścieżkę zaraz po wejściu na ten ekran
    console.warn(`[404] Użytkownik próbował wejść na: ${pathname}`);
  }, [pathname]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t("screens.notFound.title")}</Text>

        <Link href="/(auth)/LoginScreen" style={styles.link}>
          <Text style={styles.linkText}>{t("screens.notFound.goToHomeScreen")}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
