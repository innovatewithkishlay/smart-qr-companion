import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { QrHistoryItem } from "../types/QrHistory";
import { addToHistory } from "../utils/history";

const QR_TYPES = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
  { label: "Wi-Fi", value: "wifi" },
  { label: "Contact", value: "vcard" },
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

const GenerateScreen = () => {
  const [qrType, setQrType] = useState("url");
  const [input, setInput] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
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

  const buildQRValue = () => {
    if (qrType === "url" || qrType === "text") return input;
    if (qrType === "wifi") {
      return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`;
    }
    if (qrType === "vcard") {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
    }
    return "";
  };

  const handleGenerate = async () => {
    const value = buildQRValue();
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
  };

  const saveQrToGallery = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please grant media library permissions to save images."
        );
        return;
      }
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR code saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Could not save QR code.");
    }
  };

  const shareQrCode = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error("Capture failed");
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not share QR code.");
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
    setQrValue("");
  }, [qrType]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          ((qrType === "url" || qrType === "text") && !input.trim()) ||
          (qrType === "wifi" && !wifiSSID.trim()) ||
          (qrType === "vcard" &&
            (!vcardName.trim() || (!vcardPhone.trim() && !vcardEmail.trim())))
        }
      >
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "png",
          quality: 1.0,
          result: "tmpfile",
        }}
        style={styles.qrContainer}
      >
        <View style={[styles.qrWrapper, { backgroundColor: bgColor }]}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={200}
              color={qrColor}
              backgroundColor={bgColor}
            />
          ) : (
            <Text style={styles.placeholder}>
              Your QR code will appear here
            </Text>
          )}
        </View>
      </ViewShot>
      {qrValue ? (
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
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
  typeSelector: { flexDirection: "row", marginBottom: 12 },
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
  colorRow: { flexDirection: "row", marginBottom: 8 },
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  placeholder: { color: "#aaa", fontSize: 16 },
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
