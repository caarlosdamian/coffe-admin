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
import { Roast, RoastProcess, RoastService } from '@/services/roast-service';

export default function AddRoastScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [form, setForm] = useState<Omit<Roast, 'id' | 'lossPercentage'>>({
    date: new Date().toISOString(),
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
      const calculatedLoss = ((form.greenWeight - form.roastedWeight) / form.greenWeight) * 100;
      setLoss(calculatedLoss);
    } else {
      setLoss(0);
    }
  }, [form.greenWeight, form.roastedWeight]);

  const handleSubmit = async () => {
    if (!form.origin || !form.greenWeight || !form.roastedWeight) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Origen, Pesos)');
      return;
    }

    const newRoast: Roast = {
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      lossPercentage: loss,
    };

    await RoastService.saveRoast(newRoast);
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que quieres eliminar este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await RoastService.deleteRoast(id);
            router.back();
          }
        },
      ]
    );
  };

  const renderInput = (label: string, value: string, onChange: (text: string) => void, placeholder = '', keyboardType: 'default' | 'numeric' = 'default', multiline = false) => (
    <View className="mb-5">
      <Text className="text-coffee-600 dark:text-coffee-400 text-sm font-semibold mb-2 ml-1">{label}</Text>
      <TextInput
        className={`bg-white dark:bg-zinc-900 border border-coffee-100 dark:border-zinc-800 rounded-2xl px-5 py-4 text-coffee-900 dark:text-coffee-100 text-base ${multiline ? 'h-32 text-top' : ''}`}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-coffee-50 dark:bg-black"
    >
      <ScrollView className="px-6 py-6" contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-coffee-900 dark:text-coffee-100 text-2xl font-bold">{id ? 'Editar' : 'Nuevo'} Tueste</Text>
          {id && (
            <TouchableOpacity onPress={handleDelete}>
              <IconSymbol name="list.bullet" size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-coffee-800 dark:text-coffee-200 text-lg font-bold mb-4">Detalles del Café</Text>

        {renderInput('Origen *', form.origin, (val) => setForm({ ...form, origin: val }), 'Ej. Colombia, Huila')}

        <View className="flex-row">
          <View className="flex-1 mr-3">
            {renderInput('Variedad', form.variety, (val) => setForm({ ...form, variety: val }), 'Bourbon')}
          </View>
          <View className="flex-1">
            {renderInput('Altitud', form.altitude, (val) => setForm({ ...form, altitude: val }), '1700m')}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-coffee-600 dark:text-coffee-400 text-sm font-semibold mb-3 ml-1">Proceso</Text>
          <View className="flex-row bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-coffee-100 dark:border-zinc-800">
            {(['lavado', 'natural', 'honey'] as RoastProcess[]).map((p) => (
              <TouchableOpacity
                key={p}
                className={`flex-1 py-3 rounded-xl items-center ${form.process === p ? 'bg-coffee-800' : ''}`}
                onPress={() => setForm({ ...form, process: p })}
              >
                <Text className={`font-bold ${form.process === p ? 'text-white' : 'text-coffee-500'}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text className="text-coffee-800 dark:text-coffee-200 text-lg font-bold mb-4 mt-2">Métricas de Tueste</Text>

        <View className="flex-row">
          <View className="flex-1 mr-3">
            {renderInput('Peso Verde (g) *', form.greenWeight === 0 ? '' : form.greenWeight.toString(), (val) => setForm({ ...form, greenWeight: parseFloat(val) || 0 }), '0', 'numeric')}
          </View>
          <View className="flex-1">
            {renderInput('Peso Tostado (g) *', form.roastedWeight === 0 ? '' : form.roastedWeight.toString(), (val) => setForm({ ...form, roastedWeight: parseFloat(val) || 0 }), '0', 'numeric')}
          </View>
        </View>

        <View className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl flex-row justify-between items-center mb-8 border border-red-100 dark:border-red-900/30">
          <View>
            <Text className="text-red-800 dark:text-red-400 font-bold text-lg">Merma Calculada</Text>
            <Text className="text-red-600 dark:text-red-500 text-xs mt-1">Pérdida de masa durante tueste</Text>
          </View>
          <Text className="text-red-600 dark:text-red-500 text-3xl font-bold">{loss.toFixed(2)}%</Text>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-3">
            {renderInput('Lote', form.batch, (val) => setForm({ ...form, batch: val }), 'A-01')}
          </View>
          <View className="flex-1">
            {renderInput('Máquina', form.machine, (val) => setForm({ ...form, machine: val }), 'Skywalker V1')}
          </View>
        </View>

        {renderInput('Notas de Perfil', form.notes, (val) => setForm({ ...form, notes: val }), 'Notas cítricas, cuerpo medio...', 'default', true)}

        <TouchableOpacity
          className="bg-coffee-900 py-5 rounded-2xl items-center shadow-lg shadow-coffee-900/40 mt-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg font-bold">Guardar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
