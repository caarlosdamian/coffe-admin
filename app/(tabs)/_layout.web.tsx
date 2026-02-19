import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { SideNavigation } from '@/components/side-navigation';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#111' }}>
      <SideNavigation />
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}>
          <Tabs.Screen name="index" options={{ title: 'Panel' }} />
          <Tabs.Screen name="beans" options={{ title: 'Granos' }} />
          <Tabs.Screen name="roasts" options={{ title: 'Registros' }} />
          <Tabs.Screen name="inventory" options={{ title: 'Inventario' }} />
          <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
      </View>
    </View>
  );
}
