import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.bg === '#0d0d0d';

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      style={[s.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Glow */}
      <View style={[s.glowTop, { backgroundColor: theme.accent }]} />

      {/* Header */}
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>{t('profile.title')}</Text>
      </View>

      {/* Avatar section */}
      <View style={s.avatarSection}>
        <View style={[s.avatarRing, { borderColor: theme.accentSoft }]}>
          <View style={[s.avatar, { backgroundColor: theme.accent }]}>
            <Text style={s.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
        </View>
        <Text style={[s.name, { color: theme.text }]}>{user?.name}</Text>
        <View style={[s.emailBadge, { backgroundColor: theme.surface }]}>
          <Text style={[s.email, { color: theme.textMuted }]}>{user?.email}</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { value: '2', label: t('profile.activeCards') },
          { value: 'Basic', label: t('profile.plan') },
          { value: 'Client', label: t('profile.role') },
        ].map((item, index) => (
          <View
            key={item.label}
            style={[
              s.statBox,
              { backgroundColor: theme.surface },
              index === 1 && { borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.bg },
            ]}
          >
            <Text style={[s.statValue, { color: theme.text }]}>{item.value}</Text>
            <Text style={[s.statLabel, { color: theme.textMuted }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Account</Text>
      <View style={[s.card, { backgroundColor: theme.surface }]}>
        {[
          { icon: 'person-outline', label: 'Edit profile', sub: 'Name, photo, contact' },
          { icon: 'notifications-outline', label: 'Notifications', sub: 'Alerts and reminders' },
          { icon: 'lock-closed-outline', label: 'Security', sub: 'Password, 2FA' },
        ].map((item, index, arr) => (
          <View key={item.label}>
            <TouchableOpacity style={s.menuItem} activeOpacity={0.7}>
              <View style={[s.menuIconBox, { backgroundColor: theme.bg }]}>
                <Ionicons name={item.icon} size={18} color={theme.textMuted} />
              </View>
              <View style={s.menuInfo}>
                <Text style={[s.menuLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[s.menuSub, { color: theme.textMuted }]}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.border} />
            </TouchableOpacity>
            {index < arr.length - 1 && <View style={[s.divider, { backgroundColor: theme.bg }]} />}
          </View>
        ))}
      </View>

      <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Preferences</Text>
      <View style={[s.card, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={s.menuItem}
          onPress={() => router.push('/(app)/settings')}
          activeOpacity={0.7}
        >
          <View style={[s.menuIconBox, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="settings-outline" size={18} color={theme.accent} />
          </View>
          <View style={s.menuInfo}>
            <Text style={[s.menuLabel, { color: theme.text }]}>{t('settings.title')}</Text>
            <Text style={[s.menuSub, { color: theme.textMuted }]}>Theme, language</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.border} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[s.logoutButton, { backgroundColor: theme.surface }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={18} color={theme.error} />
        <Text style={[s.logoutText, { color: theme.error }]}>{t('profile.logout')}</Text>
      </TouchableOpacity>

      <Text style={[s.version, { color: theme.textMuted }]}>
        risca<Text style={{ color: theme.accent }}>tap</Text> · v1.0.0
      </Text>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 60 },

  glowTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.07,
  },

  header: {
    paddingTop: 60,
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emailBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  email: {
    fontSize: 13,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSub: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  logoutButton: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },

  version: {
    textAlign: 'center',
    fontSize: 13,
  },
});