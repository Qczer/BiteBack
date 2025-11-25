import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import LanguageSelector from "@/components/LanguageSelector";
import LogoutModal from "@/components/LogoutModal";
import toastConfig from "@/components/ToastConfig";
import { useUser } from "@/contexts/UserContext";
import translate from "@/locales/i18n";
import { handleLogout } from "@/services/Storage";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    swipeable: true,
  });
};

export default function SettingsScreen() {
  const { clearUser } = useUser();

  const tURI = "screens.settings.";
  const trURI = "cards.settings.";
  const t = (key: string) => translate(tURI + key);
  const tr = (key: string) => translate(trURI + key);

  const [showConfirm, setShowConfirm] = useState(false);

  // przykładowa implementacja – możesz podpiąć własną logikę
  const replayTutorial = async () => {
    try {
      // np. reset flagi w AsyncStorage
      // await AsyncStorage.removeItem("@hasSeenHomeTutorial");
      console.log("Replay tutorial triggered");
      showToast(tr("replay"));
    } catch (err) {
      console.error("Error replaying tutorial", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Language Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={22} color={GreenVar} />
          <Text style={styles.sectionTitle}>{t("language")}</Text>
        </View>
        <Text style={styles.sectionDescription}>{t("languageInfo")}</Text>
        <LanguageSelector />
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="log-out-outline" size={22} color={GreenVar} />
          <Text style={styles.sectionTitle}>{t("logout")}</Text>
        </View>
        <Text style={styles.sectionDescription}>{t("logoutInfo")}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowConfirm(true)}
        >
          <Ionicons name="exit-outline" size={20} color={WhiteVar} />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔁 Replay Tutorial Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="reload-circle" size={22} color={GreenVar} />
          <Text style={styles.sectionTitle}>{t("replayTutorial")}</Text>
        </View>
        <Text style={styles.sectionDescription}>{t("replayTutorialInfo")}</Text>
        <TouchableOpacity style={styles.button} onPress={replayTutorial}>
          <Text style={styles.buttonText}>{t("replayTutorial")}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BiteBack © 2025</Text>
      </View>

      <LogoutModal
        showConfirm={showConfirm}
        cancelOnPress={() => setShowConfirm(false)}
        acceptOnPress={async () => {
          setShowConfirm(false);
          clearUser();
          await handleLogout();
        }}
      />
      <Toast config={toastConfig}></Toast>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteVar,
    padding: 20,
  },
  section: {
    backgroundColor: "snow",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    color: GreenVar,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionDescription: {
    color: "#555",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: GreenVar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: GreenVar,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 15,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    color: "#777",
    fontSize: 13,
  },
});
