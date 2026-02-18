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
    <View className="mb-6">
      <Text className="text-coffee-500 text-[10px] font-black mb-2 ml-1 uppercase tracking-[2px]">{label}</Text>
      <View className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
        <TextInput
          className={`px-5 py-4 text-white text-base font-medium ${multiline ? 'h-32 text-top' : ''}`}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#4a4a4a"
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-coffee-950 items-center"
    >
      <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-2xl px-6 py-10">
          <View className="flex-row justify-between items-center mb-10">
            <Text className="text-white text-2xl font-black tracking-tight">{id ? 'Editar' : 'Nuevo'} Tueste</Text>
            {id && (
              <TouchableOpacity onPress={handleDelete} className="bg-red-950/20 p-2.5 rounded-full border border-red-900/20">
                <IconSymbol name="list.bullet" size={20} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-coffee-300 text-lg font-black mb-6 tracking-tight uppercase text-[14px]">Detalles del Grano</Text>

          {renderInput('Origen *', form.origin, (val) => setForm({ ...form, origin: val }), 'Ej. Colombia, Huila')}

          <View className="flex-row">
            <View className="flex-1 mr-3">
              {renderInput('Variedad', form.variety, (val) => setForm({ ...form, variety: val }), 'Bourbon')}
            </View>
            <View className="flex-1">
              {renderInput('Altitud', form.altitude, (val) => setForm({ ...form, altitude: val }), '1700m')}
            </View>
          </View>

          <View className="mb-10">
            <Text className="text-coffee-500 text-[10px] font-black mb-3 ml-1 uppercase tracking-[2px]">Proceso</Text>
            <View className="flex-row bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {(['lavado', 'natural', 'honey'] as RoastProcess[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  className={`flex-1 py-3 rounded-xl items-center ${form.process === p ? 'bg-coffee-800 border border-white/10' : ''}`}
                  onPress={() => setForm({ ...form, process: p })}
                >
                  <Text className={`text-[11px] font-black uppercase tracking-widest ${form.process === p ? 'text-white' : 'text-coffee-600'}`}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text className="text-coffee-300 text-lg font-black mb-6 tracking-tight uppercase text-[14px]">Control de Peso</Text>

          <View className="flex-row">
            <View className="flex-1 mr-3">
              {renderInput('Verde (g) *', form.greenWeight === 0 ? '' : form.greenWeight.toString(), (val) => setForm({ ...form, greenWeight: parseFloat(val) || 0 }), '0', 'numeric')}
            </View>
            <View className="flex-1">
              {renderInput('Tostado (g) *', form.roastedWeight === 0 ? '' : form.roastedWeight.toString(), (val) => setForm({ ...form, roastedWeight: parseFloat(val) || 0 }), '0', 'numeric')}
            </View>
          </View>

          <View className="overflow-hidden rounded-[32px] border border-red-900/20 bg-red-950/10 mb-10">
            <BlurView intensity={20} tint="dark" className="p-7 flex-row justify-between items-center">
              <View>
                <Text className="text-red-400 font-black text-lg tracking-tight">Merma</Text>
                <Text className="text-red-900 text-[10px] font-black mt-1 uppercase tracking-[2px]">Loss Factor</Text>
              </View>
              <Text className="text-red-400 text-3xl font-black tracking-tighter">{loss.toFixed(2)}%</Text>
            </BlurView>
          </View>

          <View className="flex-row mb-6">
            <View className="flex-1 mr-3">
              {renderInput('Lote', form.batch, (val) => setForm({ ...form, batch: val }), 'A-01')}
            </View>
            <View className="flex-1">
              {renderInput('Máquina', form.machine, (val) => setForm({ ...form, machine: val }), 'Skywalker V1')}
            </View>
          </View>

          {renderInput('Notas de Perfil', form.notes, (val) => setForm({ ...form, notes: val }), 'Cuerpo medio, notas a chocolate...', 'default', true)}

          <TouchableOpacity
            className="bg-coffee-800 py-6 rounded-[24px] items-center border border-white/10 shadow-2xl mt-6"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-black tracking-[4px] uppercase italic">Ejecutar Registro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
