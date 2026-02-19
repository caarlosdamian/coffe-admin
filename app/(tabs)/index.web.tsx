import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bean, BeanService } from '@/services/bean-service';
import { InventoryItem, InventoryService } from '@/services/inventory-service';
import { Roast, RoastService } from '@/services/roast-service';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PROCESS_COLOR: Record<string, string> = {
  lavado: '#60a5fa',
  natural: '#f59e0b',
  honey: '#f97316',
};

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <View style={{
      flex: 1,
      minWidth: 130,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: 14,
    }}>
      <Text style={{ color: accent, fontSize: 22, fontWeight: '700', letterSpacing: -0.5, marginBottom: 3 }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '500' }}>{label}</Text>
      {sub && <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 3 }}>{sub}</Text>}
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [beans, setBeans] = useState<Bean[]>([]);

  useFocusEffect(
    useCallback(() => {
      RoastService.getAllRoasts().then(setRoasts);
      InventoryService.getAllItems().then(setInventory);
      BeanService.getAllBeans().then(setBeans);
    }, [])
  );

  const totalRoasts = roasts.length;
  const avgLoss = roasts.length > 0
    ? (roasts.reduce((s, r) => s + r.lossPercentage, 0) / roasts.length).toFixed(1)
    : '—';
  const lastOrigin = roasts[0]?.origin ?? '—';
  const totalStock = inventory.reduce((s, i) => s + i.totalWeight, 0);
  const recentRoasts = roasts.slice(0, 8);

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
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500', marginBottom: 2 }}>
            Panel de Control
          </Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>
            Buena sesión, Carlos
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push('/add-bean')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 7,
            }}
          >
            <IconSymbol name="leaf.fill" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' }}>Nueva Semilla</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/add-roast')}
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
            <IconSymbol name="cup.and.saucer.fill" size={13} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Nuevo Tueste</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 28, paddingTop: 22 }}>
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard label="Tuestes totales" value={String(totalRoasts)} accent="#c4a090" />
          <StatCard label="Merma promedio" value={avgLoss !== '—' ? `${avgLoss}%` : '—'} accent="#f87171" />
          <StatCard label="Semillas" value={String(beans.length)} accent="#d2bab0" />
          <StatCard label="Último origen" value={lastOrigin} sub={roasts[0] ? new Date(roasts[0].date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : undefined} accent="rgba(255,255,255,0.7)" />
          <StatCard label="Stock total" value={totalStock > 0 ? `${(totalStock / 1000).toFixed(1)}kg` : '—'} sub={`${inventory.length} productos`} accent="#34d399" />
        </View>

        {/* Two-column layout */}
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
          {/* Left: Recent Roasts Table */}
          <View style={{ flex: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>Actividad Reciente</Text>
              <TouchableOpacity onPress={() => router.push('/roasts')}>
                <Text style={{ color: '#c4a090', fontSize: 12, fontWeight: '500' }}>Ver todos →</Text>
              </TouchableOpacity>
            </View>

            <View style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
              {/* Table head */}
              <View style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}>
                {[
                  { label: 'Origen', flex: 2 },
                  { label: 'Proceso', flex: 1 },
                  { label: 'Verde', flex: 1 },
                  { label: 'Tostado', flex: 1 },
                  { label: 'Merma', flex: 1 },
                  { label: 'Fecha', flex: 1 },
                ].map((col) => (
                  <Text key={col.label} style={{ flex: col.flex, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {col.label}
                  </Text>
                ))}
              </View>

              {recentRoasts.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Sin registros aún</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/add-roast')}
                    style={{ marginTop: 12, backgroundColor: '#6b4c43', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 7 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Crear primer registro</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                recentRoasts.map((roast, i) => (
                  <TouchableOpacity
                    key={roast.id}
                    onPress={() => router.push({ pathname: '/add-roast', params: { id: roast.id } })}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 16,
                      paddingVertical: 11,
                      borderBottomWidth: i < recentRoasts.length - 1 ? 1 : 0,
                      borderBottomColor: 'rgba(255,255,255,0.04)',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6b4c43' }} />
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' }}>{roast.origin}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{
                        alignSelf: 'flex-start',
                        backgroundColor: `${PROCESS_COLOR[roast.process] ?? '#6b4c43'}18`,
                        borderWidth: 1,
                        borderColor: `${PROCESS_COLOR[roast.process] ?? '#6b4c43'}30`,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}>
                        <Text style={{ color: PROCESS_COLOR[roast.process] ?? '#c4a090', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' }}>
                          {roast.process}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ flex: 1, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{roast.greenWeight}g</Text>
                    <Text style={{ flex: 1, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{roast.roastedWeight}g</Text>
                    <Text style={{ flex: 1, color: '#f87171', fontSize: 12, fontWeight: '600' }}>-{roast.lossPercentage.toFixed(1)}%</Text>
                    <Text style={{ flex: 1, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                      {new Date(roast.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          {/* Right: Sidebar */}
          <View style={{ flex: 1, gap: 16, minWidth: 200 }}>
            {/* Inventory */}
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>Inventario</Text>
                <TouchableOpacity onPress={() => router.push('/inventory')}>
                  <Text style={{ color: '#c4a090', fontSize: 12, fontWeight: '500' }}>Ver todo →</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
                {inventory.length === 0 ? (
                  <View style={{ padding: 24, alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Sin stock</Text>
                  </View>
                ) : (
                  inventory.slice(0, 5).map((item, i) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => router.push({ pathname: '/add-inventory', params: { id: item.id } })}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderBottomWidth: i < Math.min(inventory.length, 5) - 1 ? 1 : 0,
                        borderBottomColor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '500', flex: 1 }} numberOfLines={1}>{item.name}</Text>
                      <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>{(item.totalWeight / 1000).toFixed(2)}kg</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

            {/* Process Distribution */}
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: 16,
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
                Por Proceso
              </Text>
              {(['lavado', 'natural', 'honey'] as const).map((p) => {
                const count = roasts.filter(r => r.process === p).length;
                const pct = roasts.length > 0 ? (count / roasts.length) * 100 : 0;
                return (
                  <View key={p} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'capitalize' }}>{p}</Text>
                      <Text style={{ color: PROCESS_COLOR[p], fontSize: 11, fontWeight: '600' }}>{count}</Text>
                    </View>
                    <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <View style={{ height: 3, width: `${pct}%` as any, backgroundColor: PROCESS_COLOR[p], borderRadius: 2 }} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Tip */}
            <View style={{
              backgroundColor: 'rgba(107,76,67,0.08)',
              borderWidth: 1,
              borderColor: 'rgba(107,76,67,0.15)',
              borderRadius: 10,
              padding: 14,
            }}>
              <Text style={{ color: 'rgba(196,160,144,0.7)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                Dato de Barista
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 18 }}>
                Los tuestes oscuros requieren enfriamiento rápido para detener la pirólisis a tiempo.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
