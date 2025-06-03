import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiPost } from '@/utils/apiClient';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/store/slices/userSlice';
import { User } from '@/types/User';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.user.profile);
  const router = useRouter();

const handleLogin = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await apiPost<{ user: User, serveToken: string }>('/auth/login', { email, password });
    if (res && res.serveToken) {
      dispatch(login(res));
    } else {
      setError('Token non ricevuto');
    }
  } catch (err: any) {
    setError(err.message || 'Errore di login');
  } finally {
    setLoading(false);
  }
};


  React.useEffect(() => {
    if (profile && profile.isAuthenticated) {
      router.replace('/'); // oppure router.replace('(tabs)/index') se serve
    }
  }, [profile, router]);


  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-1xl font-bold mb-8 text-center">Login</Text>
       <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded px-4 py-2 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      <TouchableOpacity
        className="bg-blue-600 rounded py-3"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold">Accedi</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}