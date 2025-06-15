import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

const GradientStep = ({ icon, colors, title, accent }) => (
  <LinearGradient colors={colors} style={styles.gradient}>
    <Animatable.View
      animation="zoomIn"
      duration={900}
      style={styles.iconWrap}
      useNativeDriver
    >
      <Ionicons name={icon} size={width * 0.38} color={accent} />
    </Animatable.View>
    <Animatable.Text
      animation="fadeInDown"
      delay={400}
      duration={900}
      style={[styles.title, { color: accent }]}
      useNativeDriver
    >
      {title}
    </Animatable.Text>
  </LinearGradient>
);

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: "#fff",
        image: (
          <GradientStep
            icon="qr-code-outline"
            colors={["#fff", "#e3f2fd"]}
            title="Generate QR Codes"
            accent="#1976d2"
          />
        ),
        title: "",
        subtitle:
          "Create stylish QR codes for links, text, Wi-Fi, contacts, and images.",
      },
      {
        backgroundColor: "#fff",
        image: (
          <GradientStep
            icon="camera-outline"
            colors={["#f8f9fa", "#e0f7fa"]}
            title="Scan Instantly"
            accent="#00bfae"
          />
        ),
        title: "",
        subtitle:
          "Scan any QR code with lightning speed and get smart actions.",
      },
      {
        backgroundColor: "#fff",
        image: (
          <GradientStep
            icon="time-outline"
            colors={["#fffde7", "#ffe082"]}
            title="History & Favorites"
            accent="#ff8f00"
          />
        ),
        title: "",
        subtitle: "Access your QR history and mark favorites for quick access.",
      },
      {
        backgroundColor: "#fff",
        image: (
          <GradientStep
            icon="settings-outline"
            colors={["#ede7f6", "#b39ddb"]}
            title="Personalize Everything"
            accent="#7c4dff"
          />
        ),
        title: "",
        subtitle:
          "Customize QR colors, backgrounds, and manage your app settings.",
      },
    ]}
    bottomBarHighlight={false}
    titleStyles={{ fontWeight: "bold", fontSize: 26, letterSpacing: 1 }}
    subTitleStyles={{
      fontSize: 17,
      color: "#222",
      marginTop: 10,
      lineHeight: 23,
    }}
    containerStyles={{ backgroundColor: "#fff" }}
    imageContainerStyles={{ marginBottom: 0, marginTop: 10 }}
  />
);

const styles = StyleSheet.create({
  gradient: {
    width: width,
    height: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    marginTop: 0,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrap: {
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: width * 0.22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});

export default OnboardingScreen;
