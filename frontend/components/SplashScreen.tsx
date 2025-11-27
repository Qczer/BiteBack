import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import translate from "@/locales/i18n"

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />

      {/* TEKST */}
      <Text style={styles.text}>{translate("common.fetchingYourInfo")}...</Text>

      {/* SPINNER */}
      <ActivityIndicator
        size="large"
        color={GreenVar}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteVar,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  text: {
    color: GreenVar,
    fontSize: 18,
    fontWeight: "500",
  },
});
