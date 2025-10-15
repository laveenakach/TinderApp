import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

// Register
export const registerUser = async (data) => {
  try {
    const response = await client.post("http://127.0.0.1:8000/api/register", data);
    const { token, user } = response.data;

    // Save token for persistent login
    if (token) await AsyncStorage.setItem("userToken", token);

    return { error: false, token, user, message: "Registration successful" };
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    return { error: true, message };
  }
};

// Login
export const loginUser = async (credentials) => {
  try {
    const response = await client.post("http://127.0.0.1:8000/api/login", credentials);
    const { token, user } = response.data;

    if (token) await AsyncStorage.setItem("userToken", token);

    return { error: false, token, user, message: "Login successful" };
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    return { error: true, message };
  }
};

// Logout
export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("LoginScreen");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Get token for auth checks
export const getToken = async () => {
  return await AsyncStorage.getItem("userToken");
};