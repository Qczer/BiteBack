import translate from "@/locales/i18n";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ReportBugScreen() {
  const tURL = "screens.feedback.";

  const t = (key: string) => translate(tURL + key);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Image
          source={require("@/assets/images/people/thanks2.png")}
          style={{ width: 250, height: 250 }}
          width={200}
          height={200}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/people/reportBug1.png")}
          style={{ width: 250, height: 250 }}
          width={200}
          height={200}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>{t("title")}</Text>
      <Text style={styles.subtitle}>{t("subtitle")}</Text>
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
