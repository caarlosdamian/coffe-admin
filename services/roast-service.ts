export type RoastProcess = 'lavado' | 'natural' | 'honey';

export interface Roast {
  id: string;
  date: string; // ISO String
  origin: string;
  process: RoastProcess;
  variety: string;
  altitude: string;
  batch: string;
  greenWeight: number; // in grams
  roastedWeight: number; // in grams
  lossPercentage: number; // calculated: (1 - roastedWeight / greenWeight) * 100
  machine: string;
  notes: string;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const ROASTS_STORAGE_KEY = '@roasts_data';

export const RoastService = {
  async getAllRoasts(): Promise<Roast[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ROASTS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error fetching roasts', e);
      return [];
    }
  },

  async saveRoast(roast: Roast): Promise<void> {
    try {
      const roasts = await this.getAllRoasts();
      const existingIndex = roasts.findIndex((r) => r.id === roast.id);
      
      if (existingIndex > -1) {
        roasts[existingIndex] = roast;
      } else {
        roasts.unshift(roast); // Add new to the top
      }
      
      const jsonValue = JSON.stringify(roasts);
      await AsyncStorage.setItem(ROASTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving roast', e);
    }
  },

  async deleteRoast(id: string): Promise<void> {
    try {
      const roasts = await this.getAllRoasts();
      const filteredRoasts = roasts.filter((r) => r.id !== id);
      const jsonValue = JSON.stringify(filteredRoasts);
      await AsyncStorage.setItem(ROASTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error deleting roast', e);
    }
  },
};
