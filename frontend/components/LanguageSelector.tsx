import { useLanguage } from "@/contexts/LanguageContext";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

const languageNames: Record<string, string> = {
  en: "English",
  pl: "Polski",
};

export default function LanguageSelector() {
  const { setLang, lang, availableLangs } = useLanguage();

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={lang}
        onValueChange={(itemValue) => setLang(itemValue)}
      >
        {availableLangs.map((langCode) => (
          <Picker.Item
            key={langCode}
            label={languageNames[langCode] || langCode}
            value={langCode}
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
