import { GreenVar, WhiteVar } from "@/assets/colors/colors";
import HeaderBar from "@/components/HeaderBar";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  if (!permission) return null;

  // 1️⃣ Brak zgody na kamerę
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: WhiteVar }}>
        <HeaderBar />
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color={GreenVar} />
          <Text style={styles.title}>We need your permission</Text>
          <Text style={styles.description}>
            Please allow access to your camera to continue.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2️⃣ Podgląd zdjęcia (jeśli zrobione)
  if (uri) {
    return (
      <View style={{ flex: 1, backgroundColor: WhiteVar }}>
        <HeaderBar />
        <View style={styles.center}>
          <Image source={{ uri }} style={styles.preview} />
          <Text style={styles.description}>Here is your photo</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setUri(null);
              setShowCamera(true);
            }}
          >
            <Text style={styles.buttonText}>Take another picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3️⃣ Kamera
  if (showCamera) {
    const takePicture = async () => {
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) setUri(photo.uri);
    };

    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing="back"
          mode="picture"
        />

        {/* Overlay grid */}
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

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={28} color={WhiteVar} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4️⃣ Ekran startowy (przycisk otwarcia kamery)
  return (
    <View style={{ flex: 1, backgroundColor: WhiteVar }}>
      <HeaderBar />
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color={GreenVar} />
        <Text style={styles.title}>Camera</Text>
        <Text style={styles.description}>
          Open the camera to take a picture
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: GreenVar,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    backgroundColor: GreenVar,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: WhiteVar,
    fontWeight: "600",
    fontSize: 16,
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
  captureButton: {
    backgroundColor: GreenVar,
    padding: 16,
    borderRadius: 40,
  },
  preview: {
    width: "80%",
    height: "60%",
    borderRadius: 12,
    marginBottom: 20,
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
