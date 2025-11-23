import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import FormInput from "@/components/FormInput";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import toastConfig from "@/components/ToastConfig";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import translate from "@/locales/i18n";

export default function AddPointScreen() {
  const tURL = "cards.addPoint.";
  const t = (key: string) => translate(tURL + key);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");

  const showToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      swipeable: true,
    });
  };

  const allFilled =
    name && description && zip && street && number && city && location;

  const handleSubmit = () => {
    if (!allFilled) {
      showToast("Please fill in all fields.");
      return;
    }

    //console.log({ name, description, zip, street, number, city, location });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Intro banner */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>{t("headerText")}</Text>
          <Text style={styles.subtitle}>{t("subheaderText")}</Text>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <FormInput
            label={translate("common.name")}
            placeholder={t("nameEG")}
            setVal={setName}
            leftIcon="business-outline"
          />
          <FormInput
            label={translate("common.description")}
            placeholder={t("descEG")}
            setVal={setDescription}
            leftIcon="document-text-outline"
          />
          <FormInput
            label={translate("common.zipCode")}
            placeholder={t("zipEG")}
            setVal={setZip}
            leftIcon="mail-outline"
          />
          <FormInput
            label={translate("common.street")}
            placeholder={t("streetEG")}
            setVal={setStreet}
            leftIcon="navigate-outline"
          />
          <FormInput
            label={translate("common.number")}
            placeholder={t("numberEG")}
            setVal={setNumber}
            leftIcon="home-outline"
          />
          <FormInput
            label={translate("common.city")}
            placeholder={t("cityEG")}
            setVal={setCity}
            leftIcon="location-outline"
          />
          <FormInput
            label={translate("common.coordinates")}
            placeholder={t("coordsEG")}
            setVal={setLocation}
            leftIcon="map-outline"
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !allFilled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>{t("submit")}</Text>
        </TouchableOpacity>

        {/* Info note */}
        <Text style={styles.infoNote}>⚠️ {t("infoNote")}</Text>
      </ScrollView>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhiteVar,
    padding: 20,
  },
  headerBox: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GreenVar,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 340,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: GreenVar,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc", // szary, gdy nie wszystkie pola wypełnione
  },
  submitText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoNote: {
    marginTop: 12,
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
});
