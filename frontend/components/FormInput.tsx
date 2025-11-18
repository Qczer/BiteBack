import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HelpPopover from "./HelpPopover";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
export default function FormInput({
  placeholder = "Wpisz tekst...",
  leftIcon = "person-outline",
  rightIcon = "eye-outline",
  secure = false, // czy input ma być hasłem
  label = "",
  alertText = "",
  showHelp = false, // <-- nowy props
  // onValueChange = () => {},
  setVal = (text: string) => {},
}) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const [secureText, setSecureText] = useState(secure);

  return (
    <View style={{ margin: 10 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.labelText}>{label}</Text>
          {secure && showHelp && (
            <HelpPopover
              isVisible={isPopoverVisible}
              from={
                <TouchableOpacity onPress={() => setIsPopoverVisible(true)}>
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color="gray"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              }
              onRequestClose={() => setIsPopoverVisible(false)}
              text={
                "Each password should contain at least 7 characters, one uppercase letter, and one special character."
              }
            />
          )}
        </View>
      </View>
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
          onChangeText={(text) => {
            setVal(text);
            // onValueChange(); // możesz przekazać wartości
          }}
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
      <Text style={styles.warningText}>{alertText}</Text>
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
    marginTop: 10,
  },
  leftIcon: {
    marginRight: 8,
  },
  labelText: {
    textTransform: "uppercase",
    color: "gray",
    fontSize: 12,
    marginLeft: 5,
  },
  warningText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
    height: 14,
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    color: "black",
    paddingVertical: 8,
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
