import RealButton from "@/components/RealButton";
import translate from "@/locales/i18n";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ReportBugScreen() {
  const tURL = "screens.feedback.";

  const t = (key: string) => translate(tURL + key);
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/people/thanks.png")}
        style={{ width: 250, height: 250 }}
        width={300}
        height={300}
        resizeMode="contain"
      />
      <Text style={styles.title}>{t("title")}</Text>
      <Text style={styles.subtitle}>{t("subtitle")}</Text>
      <RealButton text={t("goBack")} onPress={() => {router.replace("/(tabs)/HomeScreen")}}></RealButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    padding: 5,
    textAlign: "center",
  },
});
