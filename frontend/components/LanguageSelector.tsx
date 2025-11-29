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
  const { token, userID } = useUser();

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={lang}
        onValueChange={async (itemValue) => { setLang(itemValue); if(userID) await changeLanguage(userID, token, itemValue); }}
        dropdownIconColor="#000"
        mode="dropdown"
        style={ styles.picker }
        itemStyle={{ color: "#000", fontSize: 16 }}
      >
        {availableLangs.map((langCode) => (
          <Picker.Item
            key={langCode}
            label={languageNames[langCode] || langCode}
            value={langCode}
            color="#000"
            style={{ backgroundColor: "#fff" }}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: 55,
  },
  picker: {
    width: "100%",
    color: "#000",
    backgroundColor: "transparent",
    marginTop: -2,
  }
});
