import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const QrDetailScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, "QrDetail">>();
  const { value, color, bgColor, type, resolvedImageUri } = route.params as any;
  const viewShotRef = useRef<ViewShot>(null);

  const saveQrToGallery = async () => {
    try {
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
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert("Error", "Could not share.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {type.toUpperCase()} {type === "image" ? "QR & Preview" : "QR Code"}
      </Text>

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

      {type === "image" &&
        (resolvedImageUri ? (
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
        ))}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={saveQrToGallery}>
          <Text style={styles.actionButtonText}>Save QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={shareQrCode}>
          <Text style={styles.actionButtonText}>Share QR Code</Text>
        </TouchableOpacity>
      </View>
      {type === "image" && resolvedImageUri && (
        <>
          <View style={styles.divider} />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                try {
                  const permission =
                    await MediaLibrary.requestPermissionsAsync();
                  if (!permission.granted) return;
                  await MediaLibrary.saveToLibraryAsync(resolvedImageUri);
                  Alert.alert("Success", "Image saved to gallery!");
                } catch {
                  Alert.alert("Error", "Could not save image.");
                }
              }}
            >
              <Text style={styles.actionButtonText}>Save Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                try {
                  await Sharing.shareAsync(resolvedImageUri);
                } catch {
                  Alert.alert("Error", "Could not share image.");
                }
              }}
            >
              <Text style={styles.actionButtonText}>Share Image</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
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
  divider: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 18,
  },
});

export default QrDetailScreen;
