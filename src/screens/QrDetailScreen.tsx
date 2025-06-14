import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { RouteProp, useRoute } from "@react-navigation/native";

// Adjust this type according to your navigator's param list
type QrDetailScreenRouteProp = RouteProp<
  {
    QrDetail: {
      value: string;
      color: string;
      bgColor: string;
      type: string;
    };
  },
  "QrDetail"
>;

const QrDetailScreen = () => {
  const route = useRoute<QrDetailScreenRouteProp>();
  const { value, color, bgColor, type } = route.params;
  const viewShotRef = useRef<ViewShot>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type.toUpperCase()} QR Code</Text>
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
          <QRCode
            value={value}
            size={200}
            color={color}
            backgroundColor={bgColor}
          />
        </View>
      </ViewShot>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={saveQrToGallery}>
          <Text style={styles.actionButtonText}>Save to Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={shareQrCode}>
          <Text style={styles.actionButtonText}>Share QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
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

export default QrDetailScreen;
