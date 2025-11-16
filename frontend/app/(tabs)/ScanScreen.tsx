import HeaderBar from "@/components/HeaderBar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// 📸 Obsługa zdjęcia w ScanScreen
//
// 1. Gdy użytkownik naciśnie przycisk "Take Picture", wywoływana jest funkcja `takePicture`.
//    - Kamera robi zdjęcie i zwraca obiekt z informacjami o zdjęciu (m.in. `uri`).
//    - `uri` to lokalna ścieżka do pliku w pamięci urządzenia.
//
// 2. Ten `uri` zapisujemy w stanie komponentu (`setUri(photo.uri)`).
//    - Dzięki temu możemy wyświetlić zdjęcie w aplikacji (np. przez komponent <Image />).
//    - Możemy też przekazać ten `uri` dalej, np. do serwera, albo zapisać w galerii.
//
// 3. Jeśli `uri` jest ustawione, zamiast kamery pokazujemy podgląd zdjęcia.
//    - Użytkownik widzi zrobione zdjęcie.
//    - Może kliknąć "Take another picture", żeby wyczyścić `uri` i wrócić do kamery.
//
// 👉 W praktyce:
// - `uri` = lokalny adres zdjęcia, np. "file:///data/.../photo.jpg"
// - Możesz użyć go w <Image source={{ uri }} /> do wyświetlenia.
// - Możesz wysłać go na backend (np. przez fetch z FormData).
// - Możesz też zapisać w pamięci urządzenia albo w bazie danych aplikacji.

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderBar />
        <View style={styles.center}>
          <Text>We need your permission to use the camera</Text>
          <Button onPress={requestPermission} title="Grant permission" />
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) setUri(photo.uri);
  };

  if (!showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderBar />
        <View style={styles.center}>
          <Button title="Open Camera" onPress={() => setShowCamera(true)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        facing="back"
        mode="picture"
      />
      {/* Grid overlay */}
      <View style={styles.gridOverlay}>
        {[...Array(2)].map((_, i) => (
          <View
            key={i}
            style={[styles.gridLine, { top: `${(i + 1) * 33}%` }]}
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <View
            key={i}
            style={[styles.gridLineVertical, { left: `${(i + 1) * 33}%` }]}
          />
        ))}
      </View>
      <View style={styles.controls}>
        <Button title="Take Picture" onPress={takePicture} />
        {uri && <Text style={{ color: "white" }}>Saved: {uri}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  gridOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
