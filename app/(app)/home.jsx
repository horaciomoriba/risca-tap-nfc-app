import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const MOCK_CARDS = [
  { id: '1', label: 'Main Branch Card', status: 'active', url: 'https://risca.mx/main' },
  { id: '2', label: 'May Event Card', status: 'active', url: 'https://risca.mx/event' },
  { id: '3', label: 'New Card', status: 'unconfigured', url: '' },
];

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={[s.container, { backgroundColor: theme.bg }]}>
      <Text style={[s.greeting, { color: theme.text }]}>{t('home.greeting')}, {user?.name} 👋</Text>
      <Text style={[s.subtitle, { color: theme.textMuted }]}>{t('home.subtitle')}</Text>

      <FlatList
        data={MOCK_CARDS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={s.cardHeader}>
              <View style={[s.cardIconBox, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name="card-outline" size={18} color={theme.accent} />
              </View>
              <Text style={[s.cardLabel, { color: theme.text }]}>{item.label}</Text>
              <View style={[s.badge, { backgroundColor: item.status === 'active' ? '#22c55e22' : '#ef444422' }]}>
                <Text style={[s.badgeText, { color: item.status === 'active' ? '#22c55e' : '#ef4444' }]}>
                  {item.status === 'active' ? t('home.active') : t('home.unconfigured')}
                </Text>
              </View>
            </View>
            <View style={s.cardFooter}>
              <Ionicons name={item.url ? 'link-outline' : 'alert-circle-outline'} size={13} color={item.url ? theme.textMuted : theme.error} />
              <Text style={[s.cardUrl, { color: item.url ? theme.textMuted : theme.error }]}>
                {item.url || t('home.noUrl')}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  greeting: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  card: { borderRadius: 16, padding: 18, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  cardIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { fontSize: 15, fontWeight: '600', flex: 1 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardUrl: { fontSize: 13 },
});