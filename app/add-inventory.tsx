import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { InventoryItem, InventoryService } from '@/services/inventory-service';

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
      Alert.alert('Error', 'Por favor ingresa el nombre del café');
      return;
    }

    const newItem: InventoryItem = {
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      totalWeight,
      lastUpdated: new Date().toISOString(),
    };

    await InventoryService.saveItem(newItem);
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que quieres eliminar este artículo del inventario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await InventoryService.deleteItem(id);
            router.back();
          }
        },
      ]
    );
  };

  const renderBagInput = (label: string, value: number, onChange: (val: number) => void) => (
    <View className="mb-5 overflow-hidden rounded-[32px] border border-white/5 bg-white/5">
      <BlurView intensity={20} tint="dark" className="p-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white font-black text-base tracking-tight">{label}</Text>
          <Text className="text-coffee-600 text-[9px] font-black uppercase tracking-widest mt-1">Stock Actual</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => onChange(Math.max(0, value - 1))}
            className="bg-white/10 w-11 h-11 rounded-full items-center justify-center border border-white/5"
          >
            <Text className="text-white font-black text-xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="mx-5 text-white font-black text-2xl w-14 text-center tracking-tighter"
            value={value.toString()}
            onChangeText={(val) => onChange(parseInt(val) || 0)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => onChange(value + 1)}
            className="bg-coffee-800 w-11 h-11 rounded-full items-center justify-center border border-white/10 shadow-lg"
          >
            <Text className="text-white font-black text-xl">+</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-coffee-950 items-center"
    >
      <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-2xl px-6 py-10">
          <View className="flex-row justify-between items-center mb-12">
            <Text className="text-white text-2xl font-black tracking-tight">{id ? 'Editar' : 'Nuevo'} Item</Text>
            {id && (
              <TouchableOpacity onPress={handleDelete} className="bg-red-950/20 p-2.5 rounded-full border border-red-900/20">
                <IconSymbol name="list.bullet" size={20} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-12">
            <Text className="text-coffee-500 text-[10px] font-black mb-3 ml-1 uppercase tracking-[2px]">Descriptor del Café</Text>
            <View className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
              <TextInput
                className="px-5 py-5 text-white text-lg font-black tracking-tight"
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
                placeholder="Ej. Colombia Huila - Natural"
                placeholderTextColor="#4a4a4a"
              />
            </View>
          </View>

          <Text className="text-coffee-300 text-lg font-black mb-6 tracking-tight uppercase text-[14px]">Unidades en Stock</Text>

          {renderBagInput('Envase 250g', form.bags250g, (val) => setForm({ ...form, bags250g: val }))}
          {renderBagInput('Envase 500g', form.bags500g, (val) => setForm({ ...form, bags500g: val }))}
          {renderBagInput('Envase 1kg', form.bags1kg, (val) => setForm({ ...form, bags1kg: val }))}

          <View className="overflow-hidden rounded-[40px] border border-white/10 bg-coffee-800 shadow-2xl mt-10">
            <View className="p-9 flex-row justify-between items-center">
              <View>
                <Text className="text-white/40 font-black text-[10px] uppercase tracking-[3px] mb-2">Peso Neto Total</Text>
                <Text className="text-white font-black text-4xl tracking-tighter">{(totalWeight / 1000).toFixed(2)}kg</Text>
              </View>
              <TouchableOpacity
                className="bg-white/10 p-5 rounded-3xl border border-white/20"
                onPress={handleSubmit}
              >
                <IconSymbol name="archivebox.fill" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="mt-12 items-center py-4"
            onPress={() => router.back()}
          >
            <Text className="text-coffee-600 font-black uppercase tracking-[3px] text-[10px]">Abandonar cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
