import translate from "@/locales/i18n";
import { useEffect, useState } from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";

export default function FeedbackScreen() {
  const tURL = "screens.feedback.";
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    Linking.openURL("https://forms.gle/HKMDwhppKtJU8o4G9");

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000); // 🕒 2 sekundy opóźnienia

    return () => clearTimeout(timer);
  }, []);
  const t = (key: string) => translate(tURL + key);

  return (
    <View style={styles.container}>
      {showContent && (
        <>
          <Image
            source={require("@/assets/images/people/thanks.png")}
            style={{ width: 250, height: 250 }}
            width={300}
            height={300}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>
        </>
      )}
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
