import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { setLanguage, setTheme } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import i18n from '../../config/i18n';

export default function Settings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, language } = useSelector((state) => state.settings);
  const colors = useTheme();
  const isDark = colors.bg === '#0d0d0d';

  const handleLanguage = (lang) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    Toast.show({ type: 'success', text1: t('settings.saved'), text2: t('settings.savedMessage') });
  };

  const handleTheme = (value) => {
    dispatch(setTheme(value));
    Toast.show({ type: 'success', text1: t('settings.saved'), text2: t('settings.savedMessage') });
  };

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Glow decorativo */}
      <View style={[s.glowTop, { backgroundColor: colors.accent }]} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[s.backButton, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={s.titleSection}>
        <Text style={[s.title, { color: colors.text }]}>{t('settings.title')}</Text>
        <Text style={[s.subtitle, { color: colors.textMuted }]}>
          Customize your experience
        </Text>
      </View>

      {/* Idioma */}
      <Text style={[s.sectionLabel, { color: colors.textMuted }]}>
        {t('settings.language')}
      </Text>
      <View style={[s.card, { backgroundColor: colors.surface }]}>
        {[
          { value: 'en', label: t('settings.english'), emoji: '🇺🇸', sub: 'English' },
          { value: 'es', label: t('settings.spanish'), emoji: '🇲🇽', sub: 'Español' },
        ].map((item, index, arr) => (
          <View key={item.value}>
            <TouchableOpacity
              style={s.option}
              onPress={() => handleLanguage(item.value)}
              activeOpacity={0.7}
            >
              <View style={[s.optionIconBox, { backgroundColor: colors.bg }]}>
                <Text style={s.optionEmoji}>{item.emoji}</Text>
              </View>
              <View style={s.optionInfo}>
                <Text style={[s.optionText, { color: colors.text }]}>{item.label}</Text>
                <Text style={[s.optionSub, { color: colors.textMuted }]}>{item.sub}</Text>
              </View>
              {language === item.value
                ? <View style={[s.checkBox, { backgroundColor: colors.accentSoft }]}>
                    <Ionicons name="checkmark" size={14} color={colors.accent} />
                  </View>
                : <View style={[s.checkBoxEmpty, { borderColor: colors.border }]} />
              }
            </TouchableOpacity>
            {index < arr.length - 1 && <View style={[s.divider, { backgroundColor: colors.bg }]} />}
          </View>
        ))}
      </View>

      {/* Tema */}
      <Text style={[s.sectionLabel, { color: colors.textMuted }]}>
        {t('settings.appearance')}
      </Text>
      <View style={[s.card, { backgroundColor: colors.surface }]}>
        {[
          { value: 'dark', label: t('settings.dark'), icon: 'moon', sub: 'Easy on the eyes' },
          { value: 'light', label: t('settings.light'), icon: 'sunny', sub: 'Classic look' },
          { value: 'system', label: t('settings.system'), icon: 'phone-portrait', sub: 'Follows your device' },
        ].map((item, index, arr) => (
          <View key={item.value}>
            <TouchableOpacity
              style={s.option}
              onPress={() => handleTheme(item.value)}
              activeOpacity={0.7}
            >
              <View style={[s.optionIconBox, { backgroundColor: theme === item.value ? colors.accentSoft : colors.bg }]}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={theme === item.value ? colors.accent : colors.textMuted}
                />
              </View>
              <View style={s.optionInfo}>
                <Text style={[s.optionText, { color: colors.text }]}>{item.label}</Text>
                <Text style={[s.optionSub, { color: colors.textMuted }]}>{item.sub}</Text>
              </View>
              {theme === item.value
                ? <View style={[s.checkBox, { backgroundColor: colors.accentSoft }]}>
                    <Ionicons name="checkmark" size={14} color={colors.accent} />
                  </View>
                : <View style={[s.checkBoxEmpty, { borderColor: colors.border }]} />
              }
            </TouchableOpacity>
            {index < arr.length - 1 && <View style={[s.divider, { backgroundColor: colors.bg }]} />}
          </View>
        ))}
      </View>

      {/* Version */}
      <Text style={[s.version, { color: colors.textMuted }]}>
        risca<Text style={{ color: colors.accent }}>tap</Text> · v1.0.0
      </Text>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 60 },

  glowTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.07,
  },

  header: {
    paddingTop: 60,
    marginBottom: 28,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleSection: {
    marginBottom: 36,
    gap: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    borderRadius: 18,
    marginBottom: 28,
    overflow: 'hidden',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionSub: {
    fontSize: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
  },

  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  version: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
  },
});