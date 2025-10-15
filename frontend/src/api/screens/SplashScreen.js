import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet } from "react-native";
import client from "../client"; // make sure you have your Axios client imported

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (token) {
          // Validate token with backend
          await client.get("http://127.0.0.1:8000/api/people", {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Token is valid → go to main screen
          navigation.replace("MainScreen");
        } else {
          // No token → go to login
          navigation.replace("LoginScreen");
        }
      } catch (err) {
        // Token invalid or request failed → remove token & go to login
        await AsyncStorage.removeItem("userToken");
        navigation.replace("LoginScreen");
      }
    };

    const timer = setTimeout(checkAuth, 2000); // splash delay
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={["#fe3c72", "#ff7854"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fe3c72" />
      <Image
        source={require("../../../assets/images/tinu.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 150, height: 150 },
});
