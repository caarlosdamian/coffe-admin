import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

const NAV_ITEMS = [
  { name: 'Panel', path: '/', icon: 'house.fill' as const },
  { name: 'Granos', path: '/beans', icon: 'leaf.circle.fill' as const },
  { name: 'Registros', path: '/roasts', icon: 'list.bullet' as const },
  { name: 'Inventario', path: '/inventory', icon: 'archivebox.fill' as const },
];

export function SideNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={{
      width: 220,
      backgroundColor: '#0c0a09',
      borderRightWidth: 1,
      borderRightColor: 'rgba(255,255,255,0.06)',
      height: '100%',
    }}>
      {/* Brand */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
        <View style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: '#6b4c43',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconSymbol name="cup.and.saucer.fill" size={15} color="#fff" />
        </View>
        <View>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: -0.3 }}>Coffee Admin</Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '500' }}>v1.0 Alpha</Text>
        </View>
      </View>

      {/* Nav */}
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 12 }}>
        <Text style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          paddingHorizontal: 10,
          marginBottom: 6,
        }}>
          Menú
        </Text>

        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 8,
                marginBottom: 2,
                borderRadius: 7,
                backgroundColor: active ? 'rgba(107,76,67,0.25)' : 'transparent',
              }}
            >
              <IconSymbol
                name={item.icon}
                size={14}
                color={active ? '#c4a090' : 'rgba(255,255,255,0.35)'}
              />
              <Text style={{
                marginLeft: 9,
                fontSize: 13,
                fontWeight: active ? '700' : '500',
                color: active ? '#e8d5cc' : 'rgba(255,255,255,0.4)',
                letterSpacing: -0.2,
              }}>
                {item.name}
              </Text>
              {active && (
                <View style={{
                  marginLeft: 'auto',
                  width: 5,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: '#c4a090',
                }} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 10, marginVertical: 12 }} />

        <Text style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          paddingHorizontal: 10,
          marginBottom: 6,
        }}>
          Acciones
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/add-bean' as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginBottom: 2,
            borderRadius: 7,
          }}
        >
          <IconSymbol name="leaf.fill" size={14} color="rgba(255,255,255,0.25)" />
          <Text style={{ marginLeft: 9, fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>
            Nueva Semilla
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/add-roast' as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginBottom: 2,
            borderRadius: 7,
          }}
        >
          <IconSymbol name="cup.and.saucer.fill" size={14} color="rgba(255,255,255,0.25)" />
          <Text style={{ marginLeft: 9, fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>
            Nuevo Tueste
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/add-inventory' as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 7,
          }}
        >
          <IconSymbol name="archivebox.fill" size={14} color="rgba(255,255,255,0.25)" />
          <Text style={{ marginLeft: 9, fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>
            Agregar Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
        <View style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#6b4c43',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>C</Text>
        </View>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>Carlos</Text>
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>Admin</Text>
        </View>
      </View>
    </View>
  );
}
