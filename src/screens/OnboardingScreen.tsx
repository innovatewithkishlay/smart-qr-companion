import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const FrostedCard = ({ icon, accent, gradient }) => (
  <View style={styles.frostedWrap}>
    <LinearGradient colors={gradient} style={styles.gradientBg} />
    <View style={styles.glassCard}>
      <Animatable.View
        animation="zoomIn"
        duration={900}
        style={styles.iconWrap}
        useNativeDriver
      >
        <Ionicons name={icon} size={width * 0.33} color={accent} />
      </Animatable.View>
    </View>
  </View>
);

const AnimatedStep = ({ icon, gradient, title, accent }) => (
  <View style={styles.stepContainer}>
    <FrostedCard icon={icon} accent={accent} gradient={gradient} />
    <Animatable.Text
      animation="fadeInDown"
      delay={400}
      duration={900}
      style={[styles.title, { color: accent }]}
      useNativeDriver
    >
      {title}
    </Animatable.Text>
  </View>
);

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: "#f3f7fa",
        image: (
          <AnimatedStep
            icon="qr-code-outline"
            gradient={["#e3f2fd", "#fff"]}
            title="Generate QR Codes"
            accent="#1976d2"
          />
        ),
        title: "",
        subtitle:
          "Create stylish QR codes for links, text, Wi-Fi, contacts, and images.",
      },
      {
        backgroundColor: "#f8f9fa",
        image: (
          <AnimatedStep
            icon="camera-outline"
            gradient={["#e0f7fa", "#f8f9fa"]}
            title="Scan Instantly"
            accent="#00bfae"
          />
        ),
        title: "",
        subtitle:
          "Scan any QR code with lightning speed and get smart actions.",
      },
      {
        backgroundColor: "#fffde7",
        image: (
          <AnimatedStep
            icon="time-outline"
            gradient={["#fffde7", "#ffe082"]}
            title="History & Favorites"
            accent="#ff8f00"
          />
        ),
        title: "",
        subtitle: "Access your QR history and mark favorites for quick access.",
      },
      {
        backgroundColor: "#ede7f6",
        image: (
          <AnimatedStep
            icon="settings-outline"
            gradient={["#ede7f6", "#b39ddb"]}
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
    titleStyles={{ fontWeight: "bold", fontSize: 27, letterSpacing: 1 }}
    subTitleStyles={{
      fontSize: 17,
      color: "#222",
      marginTop: 10,
      lineHeight: 23,
      fontWeight: "500",
      textAlign: "center",
    }}
    containerStyles={{ backgroundColor: "#f3f7fa" }}
    imageContainerStyles={{ marginBottom: 0, marginTop: 10 }}
  />
);

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 30,
  },
  frostedWrap: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 8,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    opacity: 0.95,
  },
  glassCard: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backdropFilter: "blur(14px)",
  },
  iconWrap: {
    marginBottom: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: width * 0.2,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});

export default OnboardingScreen;
