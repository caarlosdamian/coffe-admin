import { SideNavigation } from '@/components/side-navigation';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InventoryItem, InventoryService } from '@/services/inventory-service';
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

function BagCounter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={{
      backgroundColor: 'rgba(255,255,255,0.02)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      borderRadius: 8,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '500' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(0, value - 1))}
          style={{
            width: 26,
            height: 26,
            borderRadius: 5,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600', lineHeight: 18 }}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={{ color: '#fff', fontSize: 14, fontWeight: '600', width: 36, textAlign: 'center' }}
          value={String(value)}
          onChangeText={(v) => onChange(parseInt(v) || 0)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => onChange(value + 1)}
          style={{
            width: 26,
            height: 26,
            borderRadius: 5,
            backgroundColor: 'rgba(107,76,67,0.25)',
            borderWidth: 1,
            borderColor: 'rgba(107,76,67,0.3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#c4a090', fontSize: 14, fontWeight: '600', lineHeight: 18 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AddInventoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [form, setForm] = useState<Omit<InventoryItem, 'id' | 'totalWeight' | 'lastUpdated'>>({
    name: '',
    bags250g: 0,
    bags500g: 0,
    bags1kg: 0,
  });

  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    if (id) {
      InventoryService.getAllItems().then(items => {
        const item = items.find(i => i.id === id);
        if (item) {
          const { id: _, totalWeight: __, lastUpdated: ___, ...rest } = item;
          setForm(rest);
          setTotalWeight(item.totalWeight);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    setTotalWeight(InventoryService.calculateTotalWeight(form));
  }, [form]);

  const handleSubmit = async () => {
    if (!form.name) {
      Alert.alert('Error', 'Ingresa el nombre del café');
      return;
    }
    await InventoryService.saveItem({
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      totalWeight,
      lastUpdated: new Date().toISOString(),
    });
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;
    Alert.alert('Eliminar', '¿Eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await InventoryService.deleteItem(id); router.back(); } },
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
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '500' }}>Inventario</Text>
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
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{id ? 'Guardar cambios' : 'Guardar producto'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 28, paddingTop: 24 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 20 }}>
            {id ? 'Editar Producto' : 'Nuevo Producto'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
            {/* Left: Form */}
            <View style={{ flex: 2 }}>
              {/* Product name */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 18,
                marginBottom: 14,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Descriptor del Café
                </Text>
                <Label text="Nombre del producto *" />
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
                  }}
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                  placeholder="Colombia Huila - Natural"
                  placeholderTextColor="rgba(255,255,255,0.15)"
                />
              </View>

              {/* Bag counters */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 18,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Unidades en Stock
                </Text>
                <BagCounter label="Bolsas 250g" value={form.bags250g} onChange={(v) => setForm({ ...form, bags250g: v })} />
                <BagCounter label="Bolsas 500g" value={form.bags500g} onChange={(v) => setForm({ ...form, bags500g: v })} />
                <BagCounter label="Bolsas 1kg" value={form.bags1kg} onChange={(v) => setForm({ ...form, bags1kg: v })} />
              </View>
            </View>

            {/* Right: Summary */}
            <View style={{ flex: 1, gap: 12, minWidth: 180 }}>
              {/* Total weight */}
              <View style={{
                backgroundColor: 'rgba(52,211,153,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(52,211,153,0.15)',
                borderRadius: 10,
                padding: 16,
              }}>
                <Text style={{ color: 'rgba(52,211,153,0.5)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Peso Total
                </Text>
                <Text style={{ color: '#34d399', fontSize: 32, fontWeight: '700', letterSpacing: -1 }}>
                  {(totalWeight / 1000).toFixed(2)}kg
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 6 }}>
                  {totalWeight}g netos
                </Text>
              </View>

              {/* Breakdown */}
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 16,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Desglose
                </Text>
                {[
                  { label: '250g × ' + form.bags250g, value: `${(form.bags250g * 250 / 1000).toFixed(2)}kg`, color: '#a78bfa' },
                  { label: '500g × ' + form.bags500g, value: `${(form.bags500g * 500 / 1000).toFixed(2)}kg`, color: '#60a5fa' },
                  { label: '1kg × ' + form.bags1kg, value: `${form.bags1kg.toFixed(2)}kg`, color: '#f59e0b' },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{row.label}</Text>
                    <Text style={{ color: row.color, fontSize: 12, fontWeight: '600' }}>{row.value}</Text>
                  </View>
                ))}
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' }}>Total</Text>
                  <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '700' }}>{(totalWeight / 1000).toFixed(2)}kg</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
