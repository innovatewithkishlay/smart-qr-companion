import React from "react";
import { View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";

const IconStep = ({ name, color }) => (
  <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
    <Ionicons name={name} size={120} color={color} />
  </View>
);

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: "#fff",
        image: <IconStep name="qr-code-outline" color="#007bff" />,
        title: "Generate QR Codes",
        subtitle:
          "Create QR codes for links, text, Wi-Fi, contacts, and images.",
      },
      {
        backgroundColor: "#f8f9fa",
        image: <IconStep name="camera-outline" color="#28a745" />,
        title: "Scan Instantly",
        subtitle: "Scan any QR code and get smart actions for each type.",
      },
      {
        backgroundColor: "#e9f7ef",
        image: <IconStep name="time-outline" color="#fd7e14" />,
        title: "History & Favorites",
        subtitle:
          "Access your QR code history and mark favorites for quick access.",
      },
      {
        backgroundColor: "#e3e0f7",
        image: <IconStep name="settings-outline" color="#6f42c1" />,
        title: "Settings & Customization",
        subtitle:
          "Personalize QR colors, backgrounds, and manage your app settings.",
      },
    ]}
  />
);

export default OnboardingScreen;
