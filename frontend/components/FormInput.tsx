import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
export default function FormInput({
  placeholder = "Wpisz tekst...",
  leftIcon = "person-outline",
  rightIcon = "eye-outline",
  secure = false, // czy input ma być hasłem
}) {
  const [secureText, setSecureText] = useState(secure);

  return (
    <View style={styles.inputBox}>
      {/* Ikona po lewej */}
      {leftIcon && (
        <Ionicons
          name={leftIcon as IoniconName}
          size={24}
          color="lightgray"
          style={styles.leftIcon}
        />
      )}

      {/* Pole tekstowe */}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        secureTextEntry={secureText}
      />

      {/* Ikona po prawej (np. pokaz/ukryj hasło) */}
      {rightIcon && secure && (
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? (rightIcon as IoniconName) : "eye-off-outline"}
            size={24}
            color="#555"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  leftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
