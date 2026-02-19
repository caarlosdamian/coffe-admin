import { SideNavigation } from '@/components/side-navigation';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bean, BeanService } from '@/services/bean-service';
import { Roast, RoastService } from '@/services/roast-service';
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

export default function AddRoastScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [beans, setBeans] = useState<Bean[]>([]);
  const [showBeanPicker, setShowBeanPicker] = useState(false);

  const [form, setForm] = useState<Omit<Roast, 'id' | 'lossPercentage'>>({
    date: new Date().toISOString(),
    beanId: '',
    origin: '',
    process: 'lavado',
    variety: '',
    altitude: '',
    batch: '',
    greenWeight: 0,
    roastedWeight: 0,
    machine: 'Skywalker V1',
    notes: '',
  });

  const [loss, setLoss] = useState(0);

  useEffect(() => {
    BeanService.getAllBeans().then(setBeans);

    if (id) {
      RoastService.getAllRoasts().then(roasts => {
        const roast = roasts.find(r => r.id === id);
        if (roast) {
          const { id: _, lossPercentage: __, ...rest } = roast;
          setForm(rest);
          setLoss(roast.lossPercentage);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (form.greenWeight > 0 && form.roastedWeight > 0) {
      setLoss(((form.greenWeight - form.roastedWeight) / form.greenWeight) * 100);
    } else {
      setLoss(0);
    }
  }, [form.greenWeight, form.roastedWeight]);

  const handleSubmit = async () => {
    if (!form.origin || !form.greenWeight || !form.roastedWeight) {
      Alert.alert('Error', 'Completa los campos obligatorios (Grano, Pesos)');
      return;
    }
    await RoastService.saveRoast({
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      lossPercentage: loss,
    });
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;
    Alert.alert('Eliminar', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await RoastService.deleteRoast(id); router.back(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#111' }}>
      <SideNavigation />
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
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500' }}>Registros</Text>
            <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>›</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '500' }}>{id ? 'Editar' : 'Nuevo'}</Text>
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
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{id ? 'Guardar cambios' : 'Registrar tueste'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 28, paddingTop: 24 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 20 }}>
            {id ? 'Editar Registro' : 'Nuevo Tueste'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
            {/* Left: Form */}
            <View style={{ flex: 2 }}>
              {/* Section: Selección de Grano */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 18,
                marginBottom: 14,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Selección de Grano
                </Text>

                <TouchableOpacity
                  onPress={() => setShowBeanPicker(!showBeanPicker)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 7,
                    padding: 14,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: showBeanPicker ? 16 : 0
                  }}
                >
                  <View>
                    {form.origin ? (
                      <>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{form.origin}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                          {form.variety} • {form.process} • {form.altitude}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, fontStyle: 'italic' }}>
                        Selecciona una semilla del catálogo...
                      </Text>
                    )}
                  </View>
                  <IconSymbol name={showBeanPicker ? "chevron.up" : "chevron.down"} size={14} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>

                {showBeanPicker && (
                  <View style={{ marginTop: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>Tus Semillas</Text>
                      <TouchableOpacity onPress={() => router.push('/add-bean')}>
                        <Text style={{ color: '#c4a090', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>+ NUEVA</Text>
                      </TouchableOpacity>
                    </View>

                    {beans.length === 0 ? (
                      <View style={{ padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 7 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>No hay semillas guardadas</Text>
                      </View>
                    ) : (
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderRadius: 7,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.06)',
                        maxHeight: 200,
                        overflow: 'hidden'
                      }}>
                        <ScrollView nestedScrollEnabled>
                          {beans.map((bean) => (
                            <TouchableOpacity
                              key={bean.id}
                              onPress={() => {
                                setForm({
                                  ...form,
                                  beanId: bean.id,
                                  origin: bean.origin,
                                  variety: bean.variety,
                                  altitude: bean.altitude,
                                  process: bean.process
                                });
                                setShowBeanPicker(false);
                              }}
                              style={{
                                padding: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(255,255,255,0.04)',
                                backgroundColor: form.beanId === bean.id ? 'rgba(107,76,67,0.15)' : 'transparent',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <View>
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{bean.name}</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{bean.origin} • {bean.process}</Text>
                              </View>
                              {form.beanId === bean.id && (
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#c4a090' }} />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Section: Pesos */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 18,
                marginBottom: 14,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Control de Peso
                </Text>

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Label text="Verde (g) *" />
                    <Input
                      value={form.greenWeight === 0 ? '' : String(form.greenWeight)}
                      onChange={(v) => setForm({ ...form, greenWeight: parseFloat(v) || 0 })}
                      placeholder="0"
                      numeric
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Label text="Tostado (g) *" />
                    <Input
                      value={form.roastedWeight === 0 ? '' : String(form.roastedWeight)}
                      onChange={(v) => setForm({ ...form, roastedWeight: parseFloat(v) || 0 })}
                      placeholder="0"
                      numeric
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Label text="Lote" />
                    <Input value={form.batch} onChange={(v) => setForm({ ...form, batch: v })} placeholder="A-01" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Label text="Máquina" />
                    <Input value={form.machine} onChange={(v) => setForm({ ...form, machine: v })} placeholder="Skywalker V1" />
                  </View>
                </View>
              </View>

              {/* Section: Notas */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 18,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Notas de Perfil
                </Text>
                <Input
                  value={form.notes}
                  onChange={(v) => setForm({ ...form, notes: v })}
                  placeholder="Cuerpo medio, notas a chocolate..."
                  multiline
                />
              </View>
            </View>

            {/* Right: Summary */}
            <View style={{ flex: 1, gap: 12, minWidth: 180 }}>
              {/* Loss */}
              <View style={{
                backgroundColor: 'rgba(248,113,113,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(248,113,113,0.15)',
                borderRadius: 10,
                padding: 16,
              }}>
                <Text style={{ color: 'rgba(248,113,113,0.5)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Merma / Loss
                </Text>
                <Text style={{ color: '#f87171', fontSize: 32, fontWeight: '700', letterSpacing: -1 }}>
                  {loss.toFixed(2)}%
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 6 }}>
                  {form.greenWeight > 0 && form.roastedWeight > 0
                    ? `${form.greenWeight - form.roastedWeight}g perdidos`
                    : 'Ingresa los pesos'}
                </Text>
              </View>

              {/* Summary */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 16,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Resumen
                </Text>
                {[
                  { label: 'Origen', value: form.origin || '—' },
                  { label: 'Variedad', value: form.variety || '—' },
                  { label: 'Proceso', value: form.process },
                  { label: 'Altitud', value: form.altitude || '—' },
                  { label: 'Lote', value: form.batch || '—' },
                  { label: 'Máquina', value: form.machine || '—' },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{row.label}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '500', maxWidth: 100, textAlign: 'right' }} numberOfLines={1}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
