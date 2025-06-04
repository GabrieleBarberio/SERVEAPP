import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiPost } from '@/utils/apiClient';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/store/slices/userSlice';
import { User } from '@/types/User';
import { useRouter } from 'expo-router';
import { verifyInstallation } from 'nativewind';

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



  useEffect(() => {
    if (profile && profile.isAuthenticated) {
      router.replace('/');
    }
  }, [profile, router]);
  verifyInstallation();

  return (
<View className="flex-1 justify-center items-center bg-gray-100 px-4">
  <View className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 items-center">
    <Text className="text-2xl font-bold mb-8 text-center">Login</Text>
    <TextInput
      className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <TextInput
      className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
    <TouchableOpacity
      className="w-full bg-blue-600 rounded py-3"
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
</View>
  );
}
