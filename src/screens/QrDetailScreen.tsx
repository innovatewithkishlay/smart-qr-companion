import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

const QrDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "QrDetail">>();
  const { value, color, bgColor, type, resolvedImageUri } = route.params as any;
  const viewShotRef = useRef<ViewShot>(null);

  const saveQrToGallery = async () => {
    try {
      if (type === "image") {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) return;
        if (resolvedImageUri) {
          await MediaLibrary.saveToLibraryAsync(resolvedImageUri);
          Alert.alert("Success", "Image saved to gallery!");
        } else {
          Alert.alert("Error", "Image not found.");
        }
        return;
      }
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR code saved to gallery!");
    } catch {
      Alert.alert("Error", "Could not save to gallery.");
    }
  };

  const shareQrCode = async () => {
    try {
      if (type === "image") {
        if (resolvedImageUri) {
          await Sharing.shareAsync(resolvedImageUri);
        } else {
          Alert.alert("Error", "Image not found.");
        }
        return;
      }
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert("Error", "Could not share.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type.toUpperCase()} {type === "image" ? "Preview" : "QR Code"}
      </Text>

      {type === "image" ? (
        resolvedImageUri ? (
          <Image
            source={{ uri: resolvedImageUri }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.imagePreview,
              {
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons name="image-outline" size={60} color="#bbb" />
            <Text style={{ color: "#bbb", marginTop: 8 }}>Image not found</Text>
          </View>
        )
      ) : (
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
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
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={saveQrToGallery}>
          <Text style={styles.actionButtonText}>
            {type === "image" ? "Save Image" : "Save QR Code"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={shareQrCode}>
          <Text style={styles.actionButtonText}>
            {type === "image" ? "Share Image" : "Share QR Code"}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginVertical: 20,
  },
  qrContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  qrWrapper: {
    padding: 20,
    borderRadius: 12,
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
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default QrDetailScreen;
