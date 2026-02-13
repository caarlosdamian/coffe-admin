import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

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
    <TouchableOpacity
      className="bg-white dark:bg-zinc-900 mx-5 mb-4 p-5 rounded-3xl flex-row justify-between items-center shadow-sm border border-coffee-50 dark:border-zinc-800"
      onPress={() => router.push({ pathname: '/add-roast', params: { id: item.id } })}
    >
      <View className="flex-1 pr-4">
        <View className="flex-row items-center mb-1">
          <Text className="text-coffee-900 dark:text-coffee-100 font-bold text-lg">{item.origin}</Text>
          <View className="bg-coffee-100 dark:bg-coffee-900 px-2 py-0.5 rounded-full ml-2">
            <Text className="text-coffee-700 dark:text-coffee-300 text-[10px] font-bold uppercase">{item.process}</Text>
          </View>
        </View>
        <Text className="text-coffee-500 text-sm mb-2">{item.variety} • {item.batch}</Text>
        <Text className="text-coffee-400 text-xs italic">
          {new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>

      <View className="items-end bg-coffee-50 dark:bg-zinc-800 p-3 rounded-2xl min-w-[80px]">
        <Text className="text-red-500 font-bold text-lg">-{item.lossPercentage.toFixed(1)}%</Text>
        <Text className="text-coffee-500 text-[10px] mt-1">{item.roastedWeight}g / {item.greenWeight}g</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-coffee-50 dark:bg-black pt-16">
      <View className="flex-row justify-between items-center px-6 mb-6">
        <Text className="text-coffee-900 dark:text-coffee-100 text-3xl font-bold">Registro</Text>
        <TouchableOpacity
          className="bg-coffee-800 flex-row items-center px-5 py-3 rounded-2xl shadow-md"
          onPress={() => router.push('/add-roast')}
        >
          <IconSymbol name="cup.and.saucer.fill" size={18} color="#fff" />
          <Text className="text-white font-bold ml-2">Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={roasts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRoasts} tintColor="#846358" />
        }
        ListEmptyComponent={
          <View className="mt-24 items-center px-10">
            <View className="bg-coffee-100 dark:bg-zinc-900 p-8 rounded-full mb-6">
              <IconSymbol name="cup.and.saucer.fill" size={60} color="#eaddd7" />
            </View>
            <Text className="text-coffee-900 dark:text-coffee-100 text-xl font-bold text-center">Sin registros aún</Text>
            <Text className="text-coffee-500 text-center mt-2 leading-relaxed">
              Comienza a documentar tus tuestes para perfeccionar tu técnica.
            </Text>
          </View>
        }
      />
    </View>
  );
}
