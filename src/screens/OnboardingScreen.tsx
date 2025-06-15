import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const AnimatedStep = ({ source }) => (
  <View style={styles.lottieContainer}>
    <LottieView
      source={source}
      autoPlay
      loop
      style={{ width: width * 0.7, height: width * 0.7 }}
    />
  </View>
);

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: "#fff",
        image: <AnimatedStep source={require("../assets/lottie-qr.json")} />,
        title: "Generate QR Codes",
        subtitle:
          "Create QR codes for links, text, Wi-Fi, contacts, and images.",
      },
      {
        backgroundColor: "#f8f9fa",
        image: <AnimatedStep source={require("../assets/lottie-scan.json")} />,
        title: "Scan Instantly",
        subtitle: "Scan any QR code and get smart actions for each type.",
      },
      {
        backgroundColor: "#e9f7ef",
        image: (
          <AnimatedStep source={require("../assets/lottie-history.json")} />
        ),
        title: "History & Favorites",
        subtitle:
          "Access your QR code history and mark favorites for quick access.",
      },
      {
        backgroundColor: "#e3e0f7",
        image: (
          <AnimatedStep source={require("../assets/lottie-settings.json")} />
        ),
        title: "Settings & Customization",
        subtitle:
          "Personalize QR colors, backgrounds, and manage your app settings.",
      },
    ]}
    bottomBarHighlight={false}
    titleStyles={{ fontWeight: "bold", fontSize: 24 }}
    subTitleStyles={{ fontSize: 16 }}
  />
);

const styles = StyleSheet.create({
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default OnboardingScreen;
