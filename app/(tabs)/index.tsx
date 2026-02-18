import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Tuestes Totales', value: '24', icon: 'cup.and.saucer.fill' as const, color: 'text-coffee-300' },
    { label: 'Merma Promedio', value: '14.2%', icon: 'list.bullet' as const, color: 'text-red-400' },
    { label: 'Último Origen', value: 'Colombia', icon: 'paperplane.fill' as const, color: 'text-coffee-400' },
  ];

  return (
    <View className="flex-1 bg-coffee-950">
      {/* Background Glows */}
      <View className="absolute top-[-100] left-[-50] w-[350] h-[350] bg-coffee-900 rounded-full blur-[80px] opacity-20" />
      <View className="absolute bottom-[100] right-[-50] w-[300] h-[300] bg-coffee-800 rounded-full blur-[100px] opacity-10" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
        <View className="w-full max-w-5xl px-6 pt-20">
          <View className="flex-row justify-between items-center mb-10">
            <View>
              <Text className="text-white text-3xl font-black tracking-tighter">Panel</Text>
              <Text className="text-coffee-400 text-lg font-medium">Buena sesión, Carlos</Text>
            </View>
            <TouchableOpacity className="overflow-hidden rounded-full border border-white/10">
              <BlurView intensity={20} tint="dark" className="p-3">
                <IconSymbol name="house.fill" size={24} color="#d2bab0" />
              </BlurView>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between mb-8">
            {stats.map((stat, index) => (
              <View key={index} className="w-[48%] mb-4 overflow-hidden rounded-[32px] border border-white/5 bg-white/5 shadow-2xl">
                <BlurView intensity={40} tint="dark" className="p-6">
                  <IconSymbol name={stat.icon} size={22} color="#a18072" />
                  <Text className="text-coffee-500 text-[10px] font-black mt-4 tracking-widest uppercase">{stat.label}</Text>
                  <Text className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</Text>
                </BlurView>
              </View>
            ))}

            <TouchableOpacity
              className="w-[48%] mb-4 overflow-hidden rounded-[32px] bg-coffee-800 border border-white/10 shadow-lg"
              onPress={() => router.push('/add-roast')}
            >
              <View className="items-center justify-center p-6 py-8 h-full">
                <View className="bg-white/10 p-2 rounded-full mb-3">
                  <IconSymbol name="cup.and.saucer.fill" size={28} color="#fff" />
                </View>
                <Text className="text-white font-black text-sm tracking-tight">Nuevo Tueste</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Highlight Card */}
          <View className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
            <BlurView intensity={25} tint="dark" className="p-8">
              <View className="flex-row items-center mb-4">
                <View className="bg-coffee-700/30 p-2.5 rounded-xl mr-3 border border-white/5">
                  <IconSymbol name="cup.and.saucer.fill" size={20} color="#d2bab0" />
                </View>
                <Text className="text-white text-xl font-bold tracking-tight">Dato de Barista</Text>
              </View>
              <Text className="text-coffee-300 text-sm leading-relaxed font-medium">
                Los tuestes más oscuros requieren un enfriamiento más rápido para detener el proceso de pirólisis a tiempo.
              </Text>
            </BlurView>
          </View>

          <View className="mb-24">
            <View className="flex-row justify-between items-end mb-6 px-2">
              <Text className="text-white text-xl font-bold uppercase tracking-widest text-[14px]">Actividad Reciente</Text>
              <TouchableOpacity onPress={() => router.push('/roasts')}>
                <Text className="text-coffee-500 font-bold text-xs uppercase tracking-widest">Ver Todo</Text>
              </TouchableOpacity>
            </View>

            <View>
              {[1, 2].map((_, i) => (
                <View key={i} className="mb-4 overflow-hidden rounded-[24px] border border-white/5 bg-white/5">
                  <BlurView intensity={20} tint="dark" className="p-5 flex-row items-center">
                    <View className="bg-coffee-900/50 p-4 rounded-2xl mr-4 border border-white/5">
                      <IconSymbol name="cup.and.saucer.fill" size={20} color="#a18072" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-base tracking-tight">Etiopía - Sidamo</Text>
                      <Text className="text-coffee-500 text-[10px] font-bold uppercase tracking-widest mt-1">Hoy • Natural • 15:30</Text>
                    </View>
                    <Text className="text-white font-black text-lg">500g</Text>
                  </BlurView>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
