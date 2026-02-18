import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InventoryItem, InventoryService } from '@/services/inventory-service';

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      InventoryService.getAllItems().then(setItems);
    }, [])
  );

  const totalWeight = items.reduce((s, i) => s + i.totalWeight, 0);
  const total250 = items.reduce((s, i) => s + i.bags250g, 0);
  const total500 = items.reduce((s, i) => s + i.bags500g, 0);
  const total1kg = items.reduce((s, i) => s + i.bags1kg, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#111' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={{
        paddingHorizontal: 28,
        paddingTop: 22,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500', marginBottom: 2 }}>Control de Stock</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>Inventario</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/add-inventory')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#6b4c43',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 7,
          }}
        >
          <IconSymbol name="archivebox.fill" size={13} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 28, paddingTop: 20 }}>
        {/* Summary bar */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Peso total', value: `${(totalWeight / 1000).toFixed(2)}kg`, color: '#34d399' },
            { label: 'Productos', value: String(items.length), color: 'rgba(255,255,255,0.7)' },
            { label: 'Bolsas 250g', value: String(total250), color: '#a78bfa' },
            { label: 'Bolsas 500g', value: String(total500), color: '#60a5fa' },
            { label: 'Bolsas 1kg', value: String(total1kg), color: '#f59e0b' },
          ].map((s) => (
            <View key={s.label} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: 12,
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '500', marginBottom: 4 }}>{s.label}</Text>
              <Text style={{ color: s.color, fontSize: 16, fontWeight: '700', letterSpacing: -0.3 }}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Table */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.05)',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}>
            {[
              { label: 'Producto', flex: 3 },
              { label: '250g', flex: 1 },
              { label: '500g', flex: 1 },
              { label: '1kg', flex: 1 },
              { label: 'Total', flex: 1.2 },
              { label: 'Actualizado', flex: 1.5 },
            ].map((col) => (
              <Text key={col.label} style={{ flex: col.flex, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {col.label}
              </Text>
            ))}
          </View>

          {items.length === 0 ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 40, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <IconSymbol name="archivebox.fill" size={32} color="rgba(255,255,255,0.1)" />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>Sin stock</Text>
              <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginBottom: 16 }}>Añade tus bolsas para controlar las existencias.</Text>
              <TouchableOpacity
                onPress={() => router.push('/add-inventory')}
                style={{ backgroundColor: '#6b4c43', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 7 }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Agregar primer producto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push({ pathname: '/add-inventory', params: { id: item.id } })}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: i < items.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,255,255,0.04)',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(107,76,67,0.15)', borderWidth: 1, borderColor: 'rgba(107,76,67,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <IconSymbol name="archivebox.fill" size={13} color="#6b4c43" />
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500' }}>{item.name}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(167,139,250,0.1)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#a78bfa', fontSize: 12, fontWeight: '600' }}>{item.bags250g}</Text>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#60a5fa', fontSize: 12, fontWeight: '600' }}>{item.bags500g}</Text>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: '600' }}>{item.bags1kg}</Text>
                  </View>
                </View>

                <View style={{ flex: 1.2 }}>
                  <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(52,211,153,0.08)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.18)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>{(item.totalWeight / 1000).toFixed(2)}kg</Text>
                  </View>
                </View>

                <Text style={{ flex: 1.5, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                  {new Date(item.lastUpdated).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {items.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 10, textAlign: 'right' }}>
            {items.length} producto{items.length !== 1 ? 's' : ''} · {(totalWeight / 1000).toFixed(2)}kg total
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
