import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../auth";

export default function LoginScreen({ navigation }) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("demo@tinderapp.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = async () => {
    const result = await loginUser({ email, password });
    if (!result.error) {
      navigation.replace("MainScreen", { auth: { token: result.token, user: result.user } });
    } else {
      setMessage(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registerText} onPress={() => navigation.navigate("RegisterScreen")}>
        Don't have an account? Register
      </Text>

      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, marginBottom: 12 },
  btn: { backgroundColor: '#16A34A', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  error: { marginTop: 10, color: 'red', textAlign: 'center' },
  registerText: { marginTop: 20, color: "#fe3c72", textAlign: "center" },
});
