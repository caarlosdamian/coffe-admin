import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bean, BeanService } from '@/services/bean-service';
import { RoastProcess } from '@/services/roast-service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

function Label({ text }: { text: string }) {
  return (
    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {text}
    </Text>
  );
}

function Input({ value, onChange, placeholder, numeric, multiline }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
}) {
  return (
    <TextInput
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 7,
        paddingHorizontal: 11,
        paddingVertical: 8,
        color: '#fff',
        fontSize: 13,
        fontWeight: '400',
        height: multiline ? 80 : undefined,
        textAlignVertical: multiline ? 'top' : undefined,
      }}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.15)"
      keyboardType={numeric ? 'numeric' : 'default'}
      multiline={multiline}
    />
  );
}

export default function AddBeanWebScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [form, setForm] = useState<Omit<Bean, 'id' | 'createdAt'>>({
    name: '',
    origin: '',
    variety: '',
    altitude: '',
    process: 'lavado',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      BeanService.getAllBeans().then(beans => {
        const bean = beans.find(b => b.id === id);
        if (bean) {
          const { id: _, createdAt: __, ...rest } = bean;
          setForm(rest);
        }
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!form.name || !form.origin) {
      Alert.alert('Error', 'Completa los campos obligatorios (Nombre, Origen)');
      return;
    }
    await BeanService.saveBean({
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;
    Alert.alert('Eliminar', '¿Eliminar esta semilla?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await BeanService.deleteBean(id); router.back(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#111' }}>
      {/* <SideNavigation /> */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
              <IconSymbol name="house.fill" size={14} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
            <View style={{ width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500' }}>Granos</Text>
            <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>›</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '500' }}>{id ? 'Editar' : 'Nueva'}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {id && (
              <TouchableOpacity
                onPress={handleDelete}
                style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(248,113,113,0.25)', backgroundColor: 'rgba(248,113,113,0.06)' }}
              >
                <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '600' }}>Eliminar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, backgroundColor: '#6b4c43' }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{id ? 'Guardar cambios' : 'Registrar semilla'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 28, paddingTop: 24 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 20 }}>
            {id ? 'Editar Semilla' : 'Nueva Semilla'}
          </Text>

          <View style={{ maxWidth: 600 }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: 18,
              marginBottom: 14,
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                Información Básica
              </Text>

              <View style={{ marginBottom: 16 }}>
                <Label text="Nombre de la Semilla *" />
                <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ej. Geisha Natural" />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Label text="Origen *" />
                <Input value={form.origin} onChange={(v) => setForm({ ...form, origin: v })} placeholder="Colombia, Huila" />
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Label text="Variedad" />
                  <Input value={form.variety} onChange={(v) => setForm({ ...form, variety: v })} placeholder="Bourbon" />
                </View>
                <View style={{ flex: 1 }}>
                  <Label text="Altitud" />
                  <Input value={form.altitude} onChange={(v) => setForm({ ...form, altitude: v })} placeholder="1700m" />
                </View>
              </View>

              <View>
                <Label text="Proceso" />
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {(['lavado', 'natural', 'honey'] as RoastProcess[]).map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setForm({ ...form, process: p })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: form.process === p ? '#6b4c43' : 'rgba(255,255,255,0.08)',
                        backgroundColor: form.process === p ? 'rgba(107,76,67,0.2)' : 'transparent',
                      }}
                    >
                      <Text style={{ color: form.process === p ? '#c4a090' : 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: 18,
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                Notas Adicionales
              </Text>
              <Input
                value={form.notes || ''}
                onChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Notas sensoriales del grano verde..."
                multiline
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
