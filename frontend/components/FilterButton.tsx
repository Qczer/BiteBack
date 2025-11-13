import { GreenVar } from "@/assets/colors/colors";
import { Pressable, StyleSheet, Text } from "react-native";

interface FilterButtonProps {
    text: string;
    active?: boolean;
    onPress?: () => void;
    disabled?: boolean;
}

export default function FilterButton({ text, active, onPress, disabled }: Readonly<FilterButtonProps>) {
    return (
        <Pressable disabled={disabled} style={({pressed}) => [styles.filterButton, active && styles.activeFilterButton, pressed && styles.pressedFilterButton]} onPress={() => onPress?.()}>
            {({pressed}) => (
                <Text style={[styles.filterText, active && styles.activeFilterText, pressed && styles.pressedFilterText]}>{text}</Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    filterButton: {
        borderRadius: 10,
        padding: 10,
        outlineWidth: 1,
        outlineColor: '#BFBFBD',
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: {
        color: GreenVar
    },
    pressedFilterButton: {
        backgroundColor: "#16533fcc"
    },
    pressedFilterText: {
        color: "#ffffffcc"
    },
    activeFilterText: {
        color: "#fff"
    },
    activeFilterButton: {
        backgroundColor: GreenVar,
        outlineWidth: 0,
    },
})