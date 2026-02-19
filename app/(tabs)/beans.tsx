import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bean, BeanService } from '@/services/bean-service';

export default function BeansScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchBeans = useCallback(async () => {
    setRefreshing(true);
    const data = await BeanService.getAllBeans();
    setBeans(data);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBeans();
    }, [fetchBeans])
  );

  const renderItem = ({ item }: { item: Bean }) => (
    <View className="px-4 mb-4 overflow-hidden rounded-[32px] border border-white/5 bg-white/5">
      <BlurView intensity={30} tint="dark">
        <TouchableOpacity
          className="p-6 flex-row justify-between items-center"
          onPress={() => router.push({ pathname: '/add-bean', params: { id: item.id } })}
        >
          <View className="flex-1 pr-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-white font-black text-lg tracking-tight">{item.name}</Text>
              <View className="bg-white/10 px-3 py-1 rounded-full ml-3 border border-white/5">
                <Text className="text-coffee-300 text-[9px] font-black uppercase tracking-widest">{item.process}</Text>
              </View>
            </View>
            <Text className="text-coffee-500 text-sm font-bold mb-3">{item.origin} • {item.variety}</Text>
            <Text className="text-coffee-600 text-[10px] font-black uppercase tracking-wider">
              {item.altitude}
            </Text>
          </View>

          <View className="items-end">
            <View className="bg-coffee-900/40 p-3 rounded-2xl border border-coffee-800/20">
              <IconSymbol name="leaf.fill" size={20} color="#a18072" />
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  return (
    <View className="flex-1 bg-coffee-950 items-center">
      <View className="absolute top-[100] left-[-50] w-[300] h-[300] bg-coffee-900 rounded-full blur-[100px] opacity-15" />
      <View className="absolute bottom-[200] right-[-30] w-[250] h-[250] bg-coffee-800 rounded-full blur-[80px] opacity-10" />

      <View className="w-full max-w-5xl flex-1">
        <View className="pt-20 px-6 pb-6 flex-row justify-between items-center">
          <Text className="text-white text-3xl font-black tracking-tighter">Granos</Text>
          <TouchableOpacity
            className="overflow-hidden rounded-2xl border border-white/10 bg-coffee-800 shadow-xl"
            onPress={() => router.push('/add-bean')}
          >
            <View className="flex-row items-center px-6 py-3">
              <IconSymbol name="leaf.fill" size={18} color="#fff" />
              <Text className="text-white font-black ml-2 text-sm tracking-tight">Nuevo</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlashList
          data={beans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchBeans} tintColor="#a18072" />
          }
          ListEmptyComponent={
            <View className="mt-32 items-center px-10">
              <View className="bg-white/5 p-10 rounded-full mb-8 border border-white/5">
                <IconSymbol name="leaf.fill" size={60} color="#43302b" />
              </View>
              <Text className="text-white text-xl font-black text-center tracking-tight">Sin granos</Text>
              <Text className="text-coffee-500 text-center mt-3 leading-relaxed font-bold text-xs uppercase tracking-widest">
                Agrega tus semillas favoritas para registrar tuestes.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
