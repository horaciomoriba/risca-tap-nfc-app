import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../hooks/useTheme';

export default function Config() {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();

  const handleSave = () => {
    if (!label || !url) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    Toast.show({ type: 'success', text1: t('config.savedTitle'), text2: t('config.savedMessage') });
    setUrl('');
    setLabel('');
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={[s.title, { color: theme.text }]}>{t('config.title')}</Text>
      <Text style={[s.subtitle, { color: theme.textMuted }]}>{t('config.subtitle')}</Text>

      <View style={[s.nfcBox, { backgroundColor: theme.surface, borderColor: theme.accentSoft }]}>
        <View style={[s.nfcIconBox, { backgroundColor: theme.accentDim }]}>
          <Ionicons name="wifi-outline" size={36} color={theme.accent} />
        </View>
        <Text style={[s.nfcText, { color: theme.accent }]}>{t('config.nfcPrompt')}</Text>
        <Text style={[s.nfcSub, { color: theme.textMuted }]}>{t('config.nfcSub')}</Text>
      </View>

      <Text style={[s.label, { color: theme.textMuted }]}>{t('config.labelField')}</Text>
      <TextInput
        style={[s.input, { backgroundColor: theme.surface, borderColor: focusedInput === 'label' ? theme.accent : theme.border, color: theme.text }]}
        placeholder={t('config.labelPlaceholder')}
        placeholderTextColor={theme.textMuted}
        value={label}
        onChangeText={setLabel}
        onFocus={() => setFocusedInput('label')}
        onBlur={() => setFocusedInput(null)}
      />

      <Text style={[s.label, { color: theme.textMuted }]}>{t('config.urlField')}</Text>
      <TextInput
        style={[s.input, { backgroundColor: theme.surface, borderColor: focusedInput === 'url' ? theme.accent : theme.border, color: theme.text }]}
        placeholder={t('config.urlPlaceholder')}
        placeholderTextColor={theme.textMuted}
        value={url}
        onChangeText={setUrl}
        onFocus={() => setFocusedInput('url')}
        onBlur={() => setFocusedInput(null)}
        keyboardType="url"
        autoCapitalize="none"
      />

      <TouchableOpacity style={[s.button, { backgroundColor: theme.accent }]} onPress={handleSave} activeOpacity={0.85}>
        <Ionicons name="save-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={s.buttonText}>{t('config.save')}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  nfcBox: { borderRadius: 16, borderWidth: 1, alignItems: 'center', padding: 32, marginBottom: 28 },
  nfcIconBox: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  nfcText: { fontSize: 16, fontWeight: '600' },
  nfcSub: { fontSize: 12, marginTop: 4 },
  label: { fontSize: 12, marginBottom: 8, marginTop: 16, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  button: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 28, flexDirection: 'row', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});