import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { registerUser } from "../auth";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const result = await registerUser({ name, email, password, password_confirmation: confirmPassword });
    if (!result.error) {
      navigation.replace("MainScreen", { auth: { token: result.token, user: result.user } });
    } else {
      setMessage(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      
      <TouchableOpacity onPress={handleRegister} style={styles.btn}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.registerText} onPress={() => navigation.navigate("LoginScreen")}>
        Already have an account? Login
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
