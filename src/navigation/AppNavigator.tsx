import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import GenerateScreen from "../screens/GenerateScreen";
import ScanScreen from "../screens/ScanScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import QrDetailScreen from "../screens/QrDetailScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const HistoryStack = createStackNavigator();

const HistoryStackScreen = () => (
  <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
    <HistoryStack.Screen name="HistoryMain" component={HistoryScreen} />
    <HistoryStack.Screen name="QrDetail" component={QrDetailScreen} />
  </HistoryStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "qr-code-outline";
        if (route.name === "Generate") iconName = "qr-code-outline";
        else if (route.name === "Scan") iconName = "camera-outline";
        else if (route.name === "History") iconName = "time-outline";
        else if (route.name === "Settings") iconName = "settings-outline";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Generate" component={GenerateScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="History" component={HistoryStackScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <MainTabs />
  </NavigationContainer>
);

export default AppNavigator;
