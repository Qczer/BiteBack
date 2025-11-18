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

export default function AddPointScreen() {
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

    console.log({
      name,
      description,
      zip,
      street,
      number,
      city,
      location,
    });
    // Here you could send data to API/backend
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Intro banner */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>Add a New Donation Point</Text>
          <Text style={styles.subtitle}>
            If your donation point is missing on the map, you can add it here.
            Once submitted, it will be reviewed by our administrators before
            appearing publicly.
          </Text>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <FormInput
            label="Name"
            placeholder="e.g. Food Store Radlin"
            setVal={setName}
            leftIcon="business-outline"
          />
          <FormInput
            label="Description"
            placeholder="Short description of the point"
            setVal={setDescription}
            leftIcon="document-text-outline"
          />
          <FormInput
            label="Zip Code"
            placeholder="e.g. 44-310"
            setVal={setZip}
            leftIcon="mail-outline"
          />
          <FormInput
            label="Street"
            placeholder="e.g. Młyńska"
            setVal={setStreet}
            leftIcon="navigate-outline"
          />
          <FormInput
            label="Number"
            placeholder="e.g. 12A"
            setVal={setNumber}
            leftIcon="home-outline"
          />
          <FormInput
            label="City"
            placeholder="e.g. Radlin"
            setVal={setCity}
            leftIcon="location-outline"
          />
          <FormInput
            label="Coordinates"
            placeholder="e.g. 50.058  N, 18.495 E"
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
          <Text style={styles.submitText}>Submit for Verification</Text>
        </TouchableOpacity>

        {/* Info note */}
        <Text style={styles.infoNote}>
          ⚠️ Your submission will be verified by an administrator before it
          becomes visible to others.
        </Text>
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
