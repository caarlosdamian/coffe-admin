import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InventoryItem, InventoryService } from '@/services/inventory-service';

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();

  const fetchInventory = useCallback(async () => {
    setRefreshing(true);
    const data = await InventoryService.getAllItems();
    setItems(data);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInventory();
    }, [fetchInventory])
  );

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View className="w-full md:w-1/2 lg:w-1/2 px-[1.5%] mb-5 overflow-hidden rounded-[32px] border border-white/5 bg-white/5">
      <BlurView intensity={30} tint="dark">
        <TouchableOpacity
          className="p-6"
          onPress={() => router.push({ pathname: '/add-inventory', params: { id: item.id } })}
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-white font-black text-lg tracking-tight">{item.name}</Text>
              <Text className="text-coffee-500 text-[10px] font-black uppercase mt-2 tracking-[2px]">
                Act. {new Date(item.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
            <View className="bg-coffee-800 px-4 py-2 rounded-2xl border border-white/5 shadow-lg">
              <Text className="text-white font-black text-base tracking-tighter">{(item.totalWeight / 1000).toFixed(2)}kg</Text>
            </View>
          </View>

          <View className="flex-row justify-between rounded-2xl overflow-hidden border border-white/5 bg-black/20">
            <View className="items-center flex-1 py-4">
              <Text className="text-coffee-600 text-[9px] font-black uppercase mb-1 tracking-widest">250g</Text>
              <Text className="text-white font-black text-xl tracking-tight">{item.bags250g}</Text>
            </View>
            <View className="w-[1] bg-white/5" />
            <View className="items-center flex-1 py-4">
              <Text className="text-coffee-600 text-[9px] font-black uppercase mb-1 tracking-widest">500g</Text>
              <Text className="text-white font-black text-xl tracking-tight">{item.bags500g}</Text>
            </View>
            <View className="w-[1] bg-white/5" />
            <View className="items-center flex-1 py-4">
              <Text className="text-coffee-600 text-[9px] font-black uppercase mb-1 tracking-widest">1kg</Text>
              <Text className="text-white font-black text-xl tracking-tight">{item.bags1kg}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  return (
    <View className="flex-1 bg-coffee-950 items-center">
      {/* Background Glows */}
      <View className="absolute top-[200] left-[-40] w-[250] h-[250] bg-coffee-900 rounded-full blur-[90px] opacity-15" />
      <View className="absolute bottom-[100] right-[-20] w-[220] h-[220] bg-coffee-800 rounded-full blur-[80px] opacity-10" />

      <View className="w-full max-w-5xl flex-1">
        <View className="pt-20 px-6 pb-6 flex-row justify-between items-center">
          <Text className="text-white text-3xl font-black tracking-tighter">Inventario</Text>
          <TouchableOpacity
            className="overflow-hidden rounded-2xl border border-white/10 bg-coffee-800 shadow-xl"
            onPress={() => router.push('/add-inventory')}
          >
            <View className="flex-row items-center px-6 py-3">
              <IconSymbol name="archivebox.fill" size={18} color="#fff" />
              <Text className="text-white font-black ml-2 text-sm tracking-tight">Nuevo</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 0 }}
          numColumns={width > 768 ? 2 : 1}
          key={width > 768 ? 'web' : 'mobile'}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchInventory} tintColor="#a18072" />
          }
          ListEmptyComponent={
            <View className="mt-32 items-center px-10">
              <View className="bg-white/5 p-10 rounded-full mb-8 border border-white/5">
                <IconSymbol name="archivebox.fill" size={60} color="#43302b" />
              </View>
              <Text className="text-white text-xl font-black text-center tracking-tight">Sin stock</Text>
              <Text className="text-coffee-500 text-center mt-3 leading-relaxed font-bold text-xs uppercase tracking-widest">
                Añade tus bolsas para controlar las existencias.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
