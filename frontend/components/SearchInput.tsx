import { GrayVar, GreenVar } from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import t from "@/locales/i18n"

interface SearchInputProps {
    onInput?: (text: string) => void;
    addStyle?: StyleProp<ViewStyle>;
}

export default function SearchInput({ onInput, addStyle }: SearchInputProps) {
    const inputRef = useRef<TextInput>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <Pressable onPress={focusInput}>
            <View style={[styles.search, addStyle]}>
                <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder={t("common.searchFood")}
                    placeholderTextColor="#888"
                    onChangeText={(text) => onInput?.(text)}
                />
                <Ionicons name="search" size={22} color={GreenVar} style={styles.searchButton} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    search: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#e0ded9"
    },
    searchInput: {
        fontSize: 16,
        color: GrayVar,
    },
    searchButton: {
        marginRight: 15,
        color: GreenVar
    },
})