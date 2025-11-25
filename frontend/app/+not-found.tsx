import { Link, Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import t from "@/locales/i18n"

export default function NotFoundScreen() {
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
