import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <View className="flex-1 flex-row bg-coffee-950">
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#a18072',
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
              backgroundColor: 'transparent',
              height: 90,
              paddingBottom: 30,
              maxWidth: 600,
              alignSelf: 'center',
              width: '100%',
              bottom: 10,
              borderRadius: 40,
              marginHorizontal: 'auto',
            },
            tabBarBackground: () => (
              <BlurView intensity={40} tint="dark" style={{ flex: 1 }} />
            ),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Panel',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="beans"
            options={{
              title: 'Granos',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="leaf.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="roasts"
            options={{
              title: 'Registros',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
            }}
          />
          <Tabs.Screen
            name="inventory"
            options={{
              title: 'Inventario',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="archivebox.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{ href: null }}
          />
        </Tabs>
      </View>
    </View>
  );
}
