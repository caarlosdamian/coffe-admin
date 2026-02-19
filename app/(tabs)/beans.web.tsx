import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bean, BeanService } from '@/services/bean-service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function BeansWebScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBeans();
  }, []);

  const fetchBeans = async () => {
    const data = await BeanService.getAllBeans();
    setBeans(data);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#111' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 28,
          paddingTop: 24,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.05)',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>Granos</Text>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>Catálogo de semillas para tueste</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/add-bean')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#6b4c43',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 6,
              gap: 8,
            }}
          >
            <IconSymbol name="leaf.fill" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Nueva Semilla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 28 }}>
          {beans.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <IconSymbol name="leaf.fill" size={24} color="rgba(255,255,255,0.1)" />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '500' }}>Sin granos registrados</Text>
            </View>
          ) : (
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              overflow: 'hidden'
            }}>
              <View style={{
                flexDirection: 'row',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.01)'
              }}>
                <Text style={{ flex: 2, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Nombre</Text>
                <Text style={{ flex: 2, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Origen / Variedad</Text>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Proceso</Text>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Altitud</Text>
              </View>

              {beans.map((bean) => (
                <TouchableOpacity
                  key={bean.id}
                  onPress={() => router.push({ pathname: '/add-bean', params: { id: bean.id } })}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6b4c43' }} />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{bean.name}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{bean.origin}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{bean.variety}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.05)'
                    }}>
                      <Text style={{ color: '#c4a090', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{bean.process}</Text>
                    </View>
                  </View>
                  <Text style={{ flex: 1, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{bean.altitude}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
