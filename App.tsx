import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./screens/OnboardingScreen";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      setShowOnboarding(!hasLaunched);
    })();
  }, []);

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem("hasLaunched", "true");
    setShowOnboarding(false);
  };

  if (showOnboarding === null) return null;

  return showOnboarding ? (
    <OnboardingScreen onDone={handleOnboardingDone} />
  ) : (
    <AppNavigator />
  );
};

export default App;
