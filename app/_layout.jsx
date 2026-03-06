import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import '../config/i18n';
import Toast from 'react-native-toast-message';
import { useTheme } from '../hooks/useTheme';

function RootStack() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
        animation: 'none',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootStack />
      <Toast />
    </Provider>
  );
}