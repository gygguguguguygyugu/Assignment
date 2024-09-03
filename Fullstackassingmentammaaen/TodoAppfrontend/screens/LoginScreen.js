import React, { useState } from 'react';//Import React and the useState hook from the React library useState with an initial value. It returns an array with the current state and a function to update it.
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';//imports several components and utilities for a React Native application:
import axios from 'axios';//sed for making HTTP requests.

const apiUrl = 'http://192.168.1.3:4001/api/auth/login'; // Update if necessary
//`useState` manages email, password, loading, and password visibility states in the `LoginScreen` component.
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Email and password cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(apiUrl, { email, password });
      const { token } = response.data;
      // Save token and navigate
      navigation.navigate('AddProduct');
    } catch (error) {
      console.error(error.response || error.message);
      Alert.alert('Error', 'Invalid credentials or network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // this code sets up a text input field for users to enter their email
    // address, with styles and functionality to handle user inpu
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword} // Toggle visibility based on state
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePasswordButton}>
          <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, padding: 10, fontSize: 18 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  togglePasswordButton: { padding: 10 },
  togglePasswordText: { color: '#007bff', fontSize: 16 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  forgotPasswordButton: { marginTop: 10, alignItems: 'center' },
  forgotPasswordText: { color: '#007bff', fontSize: 16 },
});

export default LoginScreen;
