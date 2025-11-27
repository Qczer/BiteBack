import { useLanguage } from "@/contexts/LanguageContext";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";
import { changeLanguage } from "@/api/endpoints/user";
import { useUser } from "@/contexts/UserContext";

const languageNames: Record<string, string> = {
  en: "English",
  pl: "Polski",
};

export default function LanguageSelector() {
  const { setLang, lang, availableLangs } = useLanguage();
  const { user, token } = useUser();

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={lang}
        onValueChange={async (itemValue) => { setLang(itemValue); if(user) await changeLanguage(user._id, token, itemValue); }}
        dropdownIconColor="#000"
        style={{ color: "#000" }}
        itemStyle={{ color: "#000", fontSize: 16 }}
      >
        {availableLangs.map((langCode) => (
          <Picker.Item
            key={langCode}
            label={languageNames[langCode] || langCode}
            value={langCode}
            color="#000"
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
});
