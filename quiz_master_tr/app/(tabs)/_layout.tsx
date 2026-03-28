import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { HapticTab } from '@/components/haptic-tab';
import Icon from '@/components/icons/Icon';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  const tabBarStyle = Platform.select<any>({
    web: {
      display: 'none',
    },
    default: {
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#f1f5f9',
      height: 64 + (bottomInset > 0 ? bottomInset - 10 : 0),
      paddingBottom: bottomInset > 0 ? bottomInset : 10,
      paddingTop: 6,
      ...Platform.select<any>({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        android: {
          elevation: 12, // Increased elevation to ensure it's in front
        },
        web: {
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        }
      })
    }
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0058be',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sınavlar',
          tabBarLabel: 'SINAVLAR',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
          tabBarIcon: ({ color, focused }) => (
            <Icon name="school" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="subject_tree"
        options={{
          title: 'Konular',
          tabBarLabel: 'KONULAR',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
          tabBarIcon: ({ color, focused }) => (
            <Icon name="menu-book" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'İstatistikler',
          tabBarLabel: 'STATS',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
          tabBarIcon: ({ color, focused }) => (
            <Icon name="leaderboard" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
