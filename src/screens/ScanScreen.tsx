import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Clipboard,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { addToHistory } from "../utils/history";
import { QrHistoryItem } from "../types/QrHistory";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");
  const [scannedType, setScannedType] = useState<string>("");
  const isFocused = useIsFocused();

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const detectQRType = (data: string): string => {
    if (data.startsWith("http://") || data.startsWith("https://")) return "url";
    if (data.startsWith("WIFI:")) return "wifi";
    if (data.startsWith("BEGIN:VCARD")) return "vcard";
    if (data.startsWith("tel:")) return "phone";
    if (data.startsWith("mailto:")) return "email";
    if (data.startsWith("sms:")) return "sms";
    return "text";
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setScannedData(data);
    const type = detectQRType(data);
    setScannedType(type);

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
          title: "View Wi-Fi Details",
          icon: "wifi-outline",
          action: () => Alert.alert("Wi-Fi Details", scannedData),
        });
        break;
      case "vcard":
        actions.push({
          title: "View Contact",
          icon: "person-outline",
          action: () => Alert.alert("Contact Details", scannedData),
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
          title: "Send Email",
          icon: "mail-outline",
          action: () => Linking.openURL(scannedData),
        });
        break;
      case "sms":
        actions.push({
          title: "Send SMS",
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

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={80} color="#ccc" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={getBarCodeScannerPermissions}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          flashMode={flashOn ? "torch" : "off"}
        />
      )}

      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <Text style={styles.scanTitle}>Scan QR Code</Text>
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
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultType}>{scannedType.toUpperCase()}</Text>
              <TouchableOpacity onPress={resetScanner}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText} numberOfLines={3}>
              {scannedData}
            </Text>
            <View style={styles.actionButtons}>
              {getSmartActions().map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionButton}
                  onPress={action.action}
                >
                  <Ionicons name={action.icon as any} size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>{action.title}</Text>
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
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scanTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  flashButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 50,
  },
  scanFrame: {
    alignSelf: "center",
    width: 250,
    height: 250,
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
  resultContainer: {
    backgroundColor: "rgba(0,0,0,0.9)",
    margin: 20,
    borderRadius: 12,
    padding: 20,
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
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
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
});

export default ScanScreen;
