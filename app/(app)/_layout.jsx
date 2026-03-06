import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { View, StyleSheet } from 'react-native';

export default function AppLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarIcon: ({ color, size, focused }) => ({ color, size, focused }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.cards'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[s.iconBox, focused && { backgroundColor: theme.accentSoft }]}>
              <Ionicons
                name={focused ? 'card' : 'card-outline'}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: t('tabs.configure'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[s.iconBox, focused && { backgroundColor: theme.accentSoft }]}>
              <Ionicons
                name={focused ? 'wifi' : 'wifi-outline'}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[s.iconBox, focused && { backgroundColor: theme.accentSoft }]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});