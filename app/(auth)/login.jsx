import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, StatusBar, Dimensions,
} from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { setCredentials } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';

const { height } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.bg === '#0d0d0d';

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    dispatch(setCredentials({
      user: { id: '1', name: 'Juan Pérez', email: 'juan@risca.mx', role: 'client' },
      token: 'mock-token-123',
    }));
    router.replace('/(app)/home');
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Glow sutil en esquina superior */}
      <View style={[s.glowTop, { backgroundColor: theme.accent }]} />

      {/* Logo */}
      <View style={s.logoSection}>
        <View style={[s.logoMark, { backgroundColor: theme.accent }]}>
          <Text style={s.logoMarkText}>R</Text>
        </View>
        <Text style={[s.logoText, { color: theme.text }]}>
          risca<Text style={{ color: theme.accent }}>tap</Text>
        </Text>
      </View>

      {/* Hero text */}
      <View style={s.heroSection}>
        <Text style={[s.heroTitle, { color: theme.text }]}>
          {t('auth.tagline')}
        </Text>
        <Text style={[s.heroSub, { color: theme.textMuted }]}>
          Sign in to manage your NFC cards
        </Text>
      </View>

      {/* Form */}
      <View style={s.form}>
        <TextInput
          style={[
            s.input,
            {
              backgroundColor: theme.surface,
              borderColor: focusedInput === 'email' ? theme.accent : 'transparent',
              color: theme.text,
            },
          ]}
          placeholder={t('auth.email')}
          placeholderTextColor={theme.textMuted}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[
            s.input,
            {
              backgroundColor: theme.surface,
              borderColor: focusedInput === 'password' ? theme.accent : 'transparent',
              color: theme.text,
            },
          ]}
          placeholder={t('auth.password')}
          placeholderTextColor={theme.textMuted}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
          secureTextEntry
        />

        <TouchableOpacity style={s.forgotPassword}>
          <Text style={[s.forgotText, { color: theme.accent }]}>
            {t('auth.forgot')}
          </Text>
        </TouchableOpacity>

        {/* Botón principal — el 10% violeta */}
        <TouchableOpacity
          style={[s.button, { backgroundColor: theme.accent }]}
          onPress={handleLogin}
          activeOpacity={0.88}
        >
          <Text style={s.buttonText}>{t('auth.login')}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[s.footerText, { color: theme.textMuted }]}>
        {t('auth.powered')}
      </Text>

    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  // Glow decorativo
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.08,
  },

  // Logo
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 70,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoMarkText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  // Hero
  heroSection: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  heroSub: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Form
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Footer
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});