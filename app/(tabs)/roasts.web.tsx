import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Roast, RoastService } from '@/services/roast-service';

const PROCESS_COLOR: Record<string, string> = {
  lavado: '#60a5fa',
  natural: '#f59e0b',
  honey: '#f97316',
};

export default function RoastsScreen() {
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      RoastService.getAllRoasts().then(setRoasts);
    }, [])
  );

  const avgLoss = roasts.length > 0
    ? (roasts.reduce((s, r) => s + r.lossPercentage, 0) / roasts.length).toFixed(1)
    : '—';

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
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500', marginBottom: 2 }}>Historial</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>Registros de Tueste</Text>
        </View>
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

      <View style={{ paddingHorizontal: 28, paddingTop: 20 }}>
        {/* Summary bar */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total', value: String(roasts.length), color: 'rgba(255,255,255,0.7)' },
            { label: 'Merma prom.', value: avgLoss !== '—' ? `${avgLoss}%` : '—', color: '#f87171' },
            { label: 'Último origen', value: roasts[0]?.origin ?? '—', color: '#c4a090' },
            { label: 'Máquina', value: roasts[0]?.machine ?? '—', color: 'rgba(255,255,255,0.4)' },
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
              { label: 'Origen', flex: 2 },
              { label: 'Variedad', flex: 1.5 },
              { label: 'Proceso', flex: 1 },
              { label: 'Lote', flex: 1 },
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

          {roasts.length === 0 ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 40, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <IconSymbol name="cup.and.saucer.fill" size={32} color="rgba(255,255,255,0.1)" />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>Sin actividad</Text>
              <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
                Empieza a documentar tus tuestes.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/add-roast')}
                style={{ backgroundColor: '#6b4c43', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 7 }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Crear primer registro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            roasts.map((roast, i) => (
              <TouchableOpacity
                key={roast.id}
                onPress={() => router.push({ pathname: '/add-roast', params: { id: roast.id } })}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: i < roasts.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,255,255,0.04)',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6b4c43', opacity: 0.8 }} />
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' }}>{roast.origin}</Text>
                    {roast.altitude ? <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>{roast.altitude}</Text> : null}
                  </View>
                </View>
                <Text style={{ flex: 1.5, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{roast.variety || '—'}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{
                    alignSelf: 'flex-start',
                    backgroundColor: `${PROCESS_COLOR[roast.process] ?? '#6b4c43'}15`,
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
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{roast.batch || '—'}</Text>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{roast.greenWeight}g</Text>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{roast.roastedWeight}g</Text>
                <View style={{ flex: 1 }}>
                  <View style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(248,113,113,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(248,113,113,0.18)',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}>
                    <Text style={{ color: '#f87171', fontSize: 11, fontWeight: '600' }}>-{roast.lossPercentage.toFixed(1)}%</Text>
                  </View>
                </View>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                  {new Date(roast.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {roasts.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 10, textAlign: 'right' }}>
            {roasts.length} registro{roasts.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
