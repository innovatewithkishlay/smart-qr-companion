import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { QrHistoryItem } from "../types/QrHistory";
import { addToHistory } from "../utils/history";

const QR_TYPES = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
  { label: "Wi-Fi", value: "wifi" },
  { label: "Contact", value: "vcard" },
  { label: "Image", value: "image" },
];

const COLOR_PRESETS = [
  "#000000",
  "#007bff",
  "#e83e8c",
  "#28a745",
  "#ffc107",
  "#ffffff",
];
const BG_COLOR_PRESETS = [
  "#ffffff",
  "#f8f9fa",
  "#343a40",
  "#ffeb3b",
  "#e0f7fa",
  "#ffcccb",
];
const MAX_QR_CAPACITY = 2953;
const MAX_IMAGE_SIZE_MB = 5;

const GenerateScreen = () => {
  const [qrType, setQrType] = useState("url");
  const [input, setInput] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [processing, setProcessing] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "Enter URL (https://...)";
      case "text":
        return "Enter text";
      default:
        return "";
    }
  };

  const getCompressionQuality = (fileSizeMB: number) => {
    if (fileSizeMB <= 1) return 0.7;
    if (fileSizeMB <= 3) return 0.5;
    return 0.3;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProcessing(true);
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

        if (!fileInfo.exists || typeof fileInfo.size !== "number") {
          Alert.alert("Error", "Could not get image information");
          setProcessing(false);
          return;
        }

        const fileSizeMB = fileInfo.size / (1024 * 1024);

        if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
          Alert.alert(
            "Large Image",
            `This image is ${fileSizeMB.toFixed(
              1
            )}MB (max ${MAX_IMAGE_SIZE_MB}MB). Processing may take longer.`,
            [{ text: "Continue" }]
          );
        }

        const quality = getCompressionQuality(fileSizeMB);
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 512 } }],
          {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        if (!manipulated.base64) {
          Alert.alert("Error", "Failed to process image");
          setProcessing(false);
          return;
        }

        const base64Data = `data:image/jpeg;base64,${manipulated.base64}`;

        if (base64Data.length > MAX_QR_CAPACITY) {
          Alert.alert(
            "Image Too Large",
            "Could not fit image into QR code even after compression",
            [{ text: "OK" }]
          );
          setProcessing(false);
          return;
        }

        setSelectedImage(manipulated.uri);
        setImageBase64(base64Data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process image");
    } finally {
      setProcessing(false);
    }
  };

  const buildQRValue = () => {
    if (qrType === "url" || qrType === "text") return input;
    if (qrType === "wifi")
      return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`;
    if (qrType === "vcard") {
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${vcardName}`,
        ...(vcardPhone ? [`TEL:${vcardPhone}`] : []),
        ...(vcardEmail ? [`EMAIL:${vcardEmail}`] : []),
        "END:VCARD",
      ].join("\n");
    }
    if (qrType === "image") return imageBase64;
    return "";
  };

  const handleGenerate = async () => {
    try {
      const value = buildQRValue();
      if (!value) {
        Alert.alert("Error", "Please enter valid content");
        return;
      }
      if (value.length > MAX_QR_CAPACITY) {
        Alert.alert(
          "Data Too Large",
          `QR code can only hold up to ${MAX_QR_CAPACITY} characters.\nCurrent size: ${value.length}`,
          [{ text: "OK" }]
        );
        return;
      }
      setQrValue(value);
      const newItem: QrHistoryItem = {
        id: Date.now().toString(),
        type: qrType,
        value,
        color: qrColor,
        bgColor,
        date: Date.now(),
        favorite: false,
      };
      await addToHistory(newItem);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to generate QR code. Data might be too large."
      );
      setQrValue("");
    }
  };

  const saveQrToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR code saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Could not save QR code");
    }
  };

  const shareQrCode = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not share QR code");
    }
  };

  React.useEffect(() => {
    setInput("");
    setWifiSSID("");
    setWifiPassword("");
    setWifiType("WPA");
    setVcardName("");
    setVcardPhone("");
    setVcardEmail("");
    setSelectedImage("");
    setImageBase64("");
    setQrValue("");
  }, [qrType]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {processing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Processing Image...</Text>
          </View>
        </View>
      )}
      <Text style={styles.title}>Generate QR Code</Text>
      <View style={styles.typeSelector}>
        {QR_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeButton,
              qrType === type.value && styles.typeButtonActive,
            ]}
            onPress={() => setQrType(type.value)}
          >
            <Text
              style={[
                styles.typeButtonText,
                qrType === type.value && styles.typeButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {(qrType === "url" || qrType === "text") && (
        <TextInput
          style={styles.input}
          placeholder={getPlaceholder()}
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      {qrType === "wifi" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Wi-Fi SSID"
            value={wifiSSID}
            onChangeText={setWifiSSID}
          />
          <TextInput
            style={styles.input}
            placeholder="Wi-Fi Password"
            value={wifiPassword}
            onChangeText={setWifiPassword}
          />
          <View style={styles.typeSelector}>
            {["WPA", "WEP", "nopass"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  wifiType === type && styles.typeButtonActive,
                ]}
                onPress={() => setWifiType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    wifiType === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {qrType === "vcard" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={vcardName}
            onChangeText={setVcardName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={vcardPhone}
            onChangeText={setVcardPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={vcardEmail}
            onChangeText={setVcardEmail}
            keyboardType="email-address"
          />
        </>
      )}
      {qrType === "image" && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {selectedImage ? "Change Image" : "Pick Image"}
              </Text>
            )}
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
        </>
      )}
      <Text style={styles.sectionLabel}>QR Code Color</Text>
      <View style={styles.colorRow}>
        {COLOR_PRESETS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorSwatch,
              { backgroundColor: color },
              qrColor === color && styles.selectedSwatch,
            ]}
            onPress={() => setQrColor(color)}
          />
        ))}
      </View>
      <Text style={styles.sectionLabel}>Background Color</Text>
      <View style={styles.colorRow}>
        {BG_COLOR_PRESETS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorSwatch,
              { backgroundColor: color },
              bgColor === color && styles.selectedSwatch,
            ]}
            onPress={() => setBgColor(color)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerate}
        disabled={
          (qrType === "url" && !input.trim()) ||
          (qrType === "text" && !input.trim()) ||
          (qrType === "wifi" && (!wifiSSID.trim() || !wifiPassword.trim())) ||
          (qrType === "vcard" && !vcardName.trim()) ||
          (qrType === "image" && !imageBase64)
        }
      >
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={styles.qrContainer}
      >
        <View style={[styles.qrWrapper, { backgroundColor: bgColor }]}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={200}
              color={qrColor}
              backgroundColor={bgColor}
              onError={() => {
                Alert.alert(
                  "Error",
                  "Failed to generate QR code. Data too large."
                );
                setQrValue("");
              }}
            />
          ) : (
            <Text style={styles.placeholder}>
              Your QR code will appear here
            </Text>
          )}
        </View>
      </ViewShot>
      {qrValue && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={saveQrToGallery}
          >
            <Text style={styles.actionButtonText}>Save to Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={shareQrCode}>
            <Text style={styles.actionButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: "#007bff",
  },
  typeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  colorRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#eee",
  },
  selectedSwatch: {
    borderColor: "#007bff",
    borderWidth: 3,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 8,
    borderRadius: 12,
  },
  qrContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  qrWrapper: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    minWidth: 240,
  },
  placeholder: {
    color: "#aaa",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GenerateScreen;
