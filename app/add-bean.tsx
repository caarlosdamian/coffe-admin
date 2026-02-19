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
import { Bean, BeanService } from '@/services/bean-service';
import { RoastProcess } from '@/services/roast-service';

export default function AddBeanScreen() {
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
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Nombre, Origen)');
      return;
    }

    const newBean: Bean = {
      ...form,
      id: id || Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    await BeanService.saveBean(newBean);
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que quieres eliminar esta semilla?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await BeanService.deleteBean(id);
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
            <Text className="text-white text-2xl font-black tracking-tight">{id ? 'Editar' : 'Nueva'} Semilla</Text>
            {id && (
              <TouchableOpacity onPress={handleDelete} className="bg-red-950/20 p-2.5 rounded-full border border-red-900/20">
                <IconSymbol name="list.bullet" size={20} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>

          {renderInput('Nombre de la Semilla *', form.name, (val) => setForm({ ...form, name: val }), 'Ej. Geisha Natural')}
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

          {renderInput('Notas del Grano', form.notes || '', (val) => setForm({ ...form, notes: val }), 'Notas sensoriales del grano verde...', 'default', true)}

          <TouchableOpacity
            className="bg-coffee-800 py-6 rounded-[24px] items-center border border-white/10 shadow-2xl mt-6"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-black tracking-[4px] uppercase italic">Guardar Semilla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
