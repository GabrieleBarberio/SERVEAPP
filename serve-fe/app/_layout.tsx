import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store'; // Update the path to your actual store file
import "../global.css"

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}