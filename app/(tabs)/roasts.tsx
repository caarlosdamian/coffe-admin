import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Roast, RoastService } from '@/services/roast-service';

export default function RoastsScreen() {
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchRoasts = useCallback(async () => {
    setRefreshing(true);
    const data = await RoastService.getAllRoasts();
    setRoasts(data);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoasts();
    }, [fetchRoasts])
  );

  const renderItem = ({ item }: { item: Roast }) => (
    <View className="px-4 mb-4 overflow-hidden rounded-[32px] border border-white/5 bg-white/5">
      <BlurView intensity={30} tint="dark">
        <TouchableOpacity
          className="p-6 flex-row justify-between items-center"
          onPress={() => router.push({ pathname: '/add-roast', params: { id: item.id } })}
        >
          <View className="flex-1 pr-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-white font-black text-lg tracking-tight">{item.origin}</Text>
              <View className="bg-white/10 px-3 py-1 rounded-full ml-3 border border-white/5">
                <Text className="text-coffee-300 text-[9px] font-black uppercase tracking-widest">{item.process}</Text>
              </View>
            </View>
            <Text className="text-coffee-500 text-sm font-bold mb-3">{item.variety} • {item.batch}</Text>
            <Text className="text-coffee-600 text-[10px] font-black uppercase tracking-wider">
              {new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>

          <View className="items-end">
            <View className="bg-red-950/20 p-3 rounded-2xl border border-red-900/20">
              <Text className="text-red-400 font-black text-xl">-{item.lossPercentage.toFixed(1)}%</Text>
            </View>
            <Text className="text-coffee-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">
              {item.roastedWeight}g / {item.greenWeight}g
            </Text>
          </View>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  return (
    <View className="flex-1 bg-coffee-950 items-center">
      <View className="absolute top-[100] right-[-50] w-[300] h-[300] bg-coffee-900 rounded-full blur-[100px] opacity-15" />
      <View className="absolute bottom-[200] left-[-30] w-[250] h-[250] bg-coffee-800 rounded-full blur-[80px] opacity-10" />

      <View className="w-full max-w-5xl flex-1">
        <View className="pt-20 px-6 pb-6 flex-row justify-between items-center">
          <Text className="text-white text-3xl font-black tracking-tighter">Registros</Text>
          <TouchableOpacity
            className="overflow-hidden rounded-2xl border border-white/10 bg-coffee-800 shadow-xl"
            onPress={() => router.push('/add-roast')}
          >
            <View className="flex-row items-center px-6 py-3">
              <IconSymbol name="cup.and.saucer.fill" size={18} color="#fff" />
              <Text className="text-white font-black ml-2 text-sm tracking-tight">Nuevo</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlashList
          data={roasts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={140}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchRoasts} tintColor="#a18072" />
          }
          ListEmptyComponent={
            <View className="mt-32 items-center px-10">
              <View className="bg-white/5 p-10 rounded-full mb-8 border border-white/5">
                <IconSymbol name="cup.and.saucer.fill" size={60} color="#43302b" />
              </View>
              <Text className="text-white text-xl font-black text-center tracking-tight">Sin actividad</Text>
              <Text className="text-coffee-500 text-center mt-3 leading-relaxed font-bold text-xs uppercase tracking-widest">
                Empieza a documentar tus tuestes para encontrar el perfil perfecto.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
