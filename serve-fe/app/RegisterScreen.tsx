import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { apiUtils } from '../utils/apiClients';
import { ENDPOINTS } from '@/constants/constants'; 
const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleRegister = async () => {
  setLoading(true);
  
  try {
    await apiUtils.post(ENDPOINTS.AUTH.REGISTER, {
      username,
      email,
      password,
      role: 'HIGH',} 
    );
    Alert.alert('Registrazione completata', 'Ora puoi accedere con le tue credenziali.');
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    Alert.alert('Errore', 'Si è verificato un errore durante la registrazione. Riprova più tardi.');
  } finally {
    console.log(username, email, password);
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrazione</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Attendi...' : 'Registrati'} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});

export default RegisterScreen;
