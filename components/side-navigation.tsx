import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

export function SideNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Panel', path: '/', icon: 'house.fill' as const },
    { name: 'Registros', path: '/roasts', icon: 'list.bullet' as const },
    { name: 'Inventario', path: '/inventory', icon: 'archivebox.fill' as const },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View className="hidden md:flex w-[280px] bg-coffee-950 border-r border-white/5 pt-16 px-6 h-screen sticky top-0">
      <View className="mb-12 px-4">
        <View className="bg-coffee-800 w-12 h-12 rounded-2xl items-center justify-center mb-6 shadow-2xl border border-white/10">
          <IconSymbol name="cup.and.saucer.fill" size={24} color="#fff" />
        </View>
        <Text className="text-white text-2xl font-black tracking-tighter">Coffee Admin</Text>
      </View>

      <View className="flex-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              className={`flex-row items-center px-5 py-4 mb-3 rounded-[20px] transition-all duration-200 ${active
                  ? 'bg-coffee-800 border border-white/10 shadow-lg'
                  : 'bg-transparent hover:bg-white/5'
                }`}
            >
              <View className={`${active ? 'opacity-100' : 'opacity-60'}`}>
                <IconSymbol name={item.icon} size={22} color={active ? '#fff' : '#a18072'} />
              </View>
              <Text className={`ml-4 text-base font-black tracking-tight ${active ? 'text-white' : 'text-coffee-600'
                }`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="pb-10 px-4 opacity-30">
        <Text className="text-coffee-500 text-[10px] font-black uppercase tracking-widest">v1.0.0 Alpha</Text>
      </View>
    </View>
  );
}
