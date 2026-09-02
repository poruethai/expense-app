import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { tabsColors, tabsStyles } from '@/styles/tabs';
import { useSettings } from '@/contexts/SettingsContext';

export default function TabLayout() {
  const { t } = useSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: tabsColors.active,
        tabBarInactiveTintColor: tabsColors.inactive,

        tabBarLabelStyle: tabsStyles.tabBarLabel,
        tabBarStyle: tabsStyles.tabBar,
        tabBarItemStyle: tabsStyles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.transactions,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
            
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: t.tabs.wallet,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: t.tabs.reports,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: t.tabs.more,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}