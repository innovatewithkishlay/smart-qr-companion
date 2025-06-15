import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const AnimatedIconStep = ({ icon, color }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={1000}
    style={styles.iconContainer}
    useNativeDriver
  >
    <Ionicons name={icon} size={width * 0.38} color={color} />
  </Animatable.View>
);

const AnimatedTextStep = ({ text, color }) => (
  <Animatable.Text
    animation="fadeIn"
    duration={1200}
    style={[styles.animatedText, { color }]}
    useNativeDriver
  >
    {text}
  </Animatable.Text>
);

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: "#fff",
        image: (
          <View style={styles.stepContainer}>
            <AnimatedIconStep icon="qr-code-outline" color="#007bff" />
            <AnimatedTextStep text="Generate QR Codes" color="#007bff" />
          </View>
        ),
        title: "",
        subtitle:
          "Create QR codes for links, text, Wi-Fi, contacts, and images.",
      },
      {
        backgroundColor: "#f8f9fa",
        image: (
          <View style={styles.stepContainer}>
            <AnimatedIconStep icon="camera-outline" color="#28a745" />
            <AnimatedTextStep text="Scan Instantly" color="#28a745" />
          </View>
        ),
        title: "",
        subtitle: "Scan any QR code and get smart actions for each type.",
      },
      {
        backgroundColor: "#e9f7ef",
        image: (
          <View style={styles.stepContainer}>
            <AnimatedIconStep icon="time-outline" color="#fd7e14" />
            <AnimatedTextStep text="History & Favorites" color="#fd7e14" />
          </View>
        ),
        title: "",
        subtitle:
          "Access your QR code history and mark favorites for quick access.",
      },
      {
        backgroundColor: "#e3e0f7",
        image: (
          <View style={styles.stepContainer}>
            <AnimatedIconStep icon="settings-outline" color="#6f42c1" />
            <AnimatedTextStep text="Settings & Customization" color="#6f42c1" />
          </View>
        ),
        title: "",
        subtitle:
          "Personalize QR colors, backgrounds, and manage your app settings.",
      },
    ]}
    bottomBarHighlight={false}
    titleStyles={{ fontWeight: "bold", fontSize: 24 }}
    subTitleStyles={{ fontSize: 16, color: "#333" }}
  />
);

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 30,
  },
  iconContainer: {
    marginBottom: 10,
  },
  animatedText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
});

export default OnboardingScreen;
