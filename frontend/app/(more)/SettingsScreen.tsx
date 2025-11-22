import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import ConfirmModal from "@/components/ConfirmModal"; // import modala
import LanguageSelector from "@/components/LanguageSelector";
import { handleLogout } from "@/services/Storage";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import translate from "@/locales/i18n";
import LogoutModal from "@/components/LogoutModal";
import { useUser } from "@/contexts/UserContext";

export default function SettingsScreen() {
  const { clearUser } = useUser();

  const tURI = "screens.settings.";
  const t = (key: string) => translate(tURI + key);

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View style={styles.container}>
      {/* Language Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={22} color={GreenVar} />
          <Text style={styles.sectionTitle}>{t("language")}</Text>
        </View>
        <Text style={styles.sectionDescription}>{t("langaugeInfo")}</Text>
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
          onPress={() => setShowConfirm(true)} // zamiast handleLogout od razu
        >
          <Ionicons name="exit-outline" size={20} color={WhiteVar} />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Stacked © 2025</Text>
      </View>

      <LogoutModal showConfirm={showConfirm} cancelOnPress={() => setShowConfirm(false)} acceptOnPress={async () => { setShowConfirm(false); clearUser(); await handleLogout(); }} />
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
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    color: "#777",
    fontSize: 13,
  },
});
