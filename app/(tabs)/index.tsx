import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Tuestes Totales', value: '24', icon: 'cup.and.saucer.fill' as const, color: 'text-coffee-800' },
    { label: 'Merma Promedio', value: '14.2%', icon: 'list.bullet' as const, color: 'text-red-500' },
    { label: 'Último Origen', value: 'Colombia', icon: 'paperplane.fill' as const, color: 'text-coffee-600' },
  ];

  return (
    <ScrollView className="flex-1 bg-coffee-50 dark:bg-black p-6 pt-16">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-coffee-900 dark:text-coffee-100 text-3xl font-bold">Hola, Carlos</Text>
          <Text className="text-coffee-600 dark:text-coffee-400 text-lg">Tu resumen del día</Text>
        </View>
        <TouchableOpacity className="bg-coffee-900 p-3 rounded-full">
          <IconSymbol name="house.fill" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between mb-8">
        {stats.map((stat, index) => (
          <View key={index} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl w-[48%] mb-4 shadow-sm border border-coffee-100 dark:border-zinc-800">
            <IconSymbol name={stat.icon} size={28} color="#846358" />
            <Text className="text-coffee-400 dark:text-coffee-500 text-sm mt-3 font-medium">{stat.label}</Text>
            <Text className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</Text>
          </View>
        ))}

        <TouchableOpacity
          className="bg-coffee-800 p-5 rounded-3xl w-[48%] mb-4 shadow-sm items-center justify-center"
          onPress={() => router.push('/add-roast')}
        >
          <IconSymbol name="cup.and.saucer.fill" size={32} color="#fff" />
          <Text className="text-white font-bold mt-2">Nuevo Tueste</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-coffee-900 p-6 rounded-3xl mb-8 overflow-hidden">
        <View className="z-10">
          <Text className="text-white text-xl font-bold mb-2">Consejo del Barista</Text>
          <Text className="text-coffee-200 text-sm leading-relaxed">
            Un tueste más lento durante la primera fase puede ayudar a desarrollar mejor los azúcares en procesos Honey.
          </Text>
        </View>
        <View className="absolute -right-8 -bottom-8 opacity-20">
          <IconSymbol name="cup.and.saucer.fill" size={120} color="#fff" />
        </View>
      </View>

      <View className="mb-10">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-coffee-900 dark:text-coffee-100 text-xl font-bold">Actividad Reciente</Text>
          <TouchableOpacity onPress={() => router.push('/roasts')}>
            <Text className="text-coffee-600 font-semibold">Ver todo</Text>
          </TouchableOpacity>
        </View>

        {[1, 2].map((_, i) => (
          <View key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl mb-3 flex-row items-center border border-coffee-50 dark:border-zinc-800">
            <View className="bg-coffee-100 dark:bg-coffee-900 p-3 rounded-xl mr-4">
              <IconSymbol name="cup.and.saucer.fill" size={20} color="#846358" />
            </View>
            <View className="flex-1">
              <Text className="text-coffee-900 dark:text-coffee-100 font-bold">Etiopía - Yirgacheffe</Text>
              <Text className="text-coffee-500 text-xs">Hace 2 horas • Lavado</Text>
            </View>
            <Text className="text-coffee-900 dark:text-coffee-100 font-bold">450g</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
