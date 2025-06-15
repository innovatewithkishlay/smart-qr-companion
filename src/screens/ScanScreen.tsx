import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Clipboard,
  Modal,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { addToHistory } from "../utils/history";
import { QrHistoryItem } from "../types/QrHistory";

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [scannedType, setScannedType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const isFocused = useIsFocused();

  const detectQRType = (data: string): string => {
    if (data.startsWith("http://") || data.startsWith("https://")) return "url";
    if (data.startsWith("WIFI:")) return "wifi";
    if (data.startsWith("BEGIN:VCARD")) return "vcard";
    if (data.startsWith("tel:")) return "phone";
    if (data.startsWith("mailto:")) return "email";
    if (data.startsWith("sms:")) return "sms";
    return "text";
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setScannedData(data);
    const type = detectQRType(data);
    setScannedType(type);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);

    const historyItem: QrHistoryItem = {
      id: Date.now().toString(),
      type,
      value: data,
      color: "#000000",
      bgColor: "#ffffff",
      date: Date.now(),
      favorite: false,
    };
    await addToHistory(historyItem);
  };

  const getSmartActions = () => {
    const actions = [];
    switch (scannedType) {
      case "url":
        actions.push({
          title: "Open URL",
          icon: "open-outline",
          action: () => Linking.openURL(scannedData),
        });
        break;
      case "wifi":
        actions.push({
          title: "View Details",
          icon: "wifi-outline",
          action: () => Alert.alert("Wi-Fi Details", scannedData),
        });
        break;
      case "vcard":
        actions.push({
          title: "View Contact",
          icon: "person-outline",
          action: () => Alert.alert("Contact Info", scannedData),
        });
        break;
      case "phone":
        actions.push({
          title: "Call",
          icon: "call-outline",
          action: () => Linking.openURL(scannedData),
        });
        break;
      case "email":
        actions.push({
          title: "Email",
          icon: "mail-outline",
          action: () => Linking.openURL(scannedData),
        });
        break;
      case "sms":
        actions.push({
          title: "SMS",
          icon: "chatbox-outline",
          action: () => Linking.openURL(scannedData),
        });
        break;
    }
    actions.push({
      title: "Copy Text",
      icon: "copy-outline",
      action: () => {
        Clipboard.setString(scannedData);
        Alert.alert("Copied", "Text copied to clipboard");
      },
    });
    return actions;
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData("");
    setScannedType("");
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Requesting camera access...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={40} color="#ff4444" />
        <Text style={styles.permissionText}>Camera access denied</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          flash={flashOn ? "torch" : "off"}
          facing="back"
        >
          {showSuccess && (
            <Animatable.View
              animation="bounceIn"
              duration={800}
              style={styles.successOverlay}
            >
              <Ionicons name="checkmark-circle" size={120} color="#28a745" />
              <Text style={styles.successText}>Scan Successful!</Text>
            </Animatable.View>
          )}

          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.title}>Scan QR Code</Text>
              <TouchableOpacity
                style={styles.flashButton}
                onPress={() => setFlashOn(!flashOn)}
              >
                <Ionicons
                  name={flashOn ? "flash" : "flash-outline"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            {scanned && (
              <View style={styles.resultPanel}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultType}>
                    {scannedType.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={resetScanner}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultText} numberOfLines={3}>
                  {scannedData}
                </Text>
                <View style={styles.actionRow}>
                  {getSmartActions().map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.actionButton}
                      onPress={action.action}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={20}
                        color="#fff"
                      />
                      <Text style={styles.actionText}>{action.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={resetScanner}
                >
                  <Text style={styles.scanAgainText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: "#666",
    marginVertical: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  flashButton: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    alignSelf: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  resultPanel: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultType: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scanAgainButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  successText: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
  },
});

export default ScanScreen;
