import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LikedScreen from "../src/api/screens/LikedScreen";
import LoginScreen from "../src/api/screens/LoginScreen";
import MainScreen from "../src/api/screens/MainScreen";
import RegisterScreen from "../src/api/screens/RegisterScreen";
import SplashScreen from "../src/api/screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="LikedScreen" component={LikedScreen} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}
