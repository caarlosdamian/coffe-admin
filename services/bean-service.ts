import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoastProcess } from './roast-service';

export interface Bean {
  id: string;
  name: string;
  origin: string;
  variety: string;
  altitude: string;
  process: RoastProcess;
  notes?: string;
  createdAt: string;
}

const BEANS_STORAGE_KEY = '@beans_data';

export const BeanService = {
  async getAllBeans(): Promise<Bean[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(BEANS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error fetching beans', e);
      return [];
    }
  },

  async saveBean(bean: Bean): Promise<void> {
    try {
      const beans = await this.getAllBeans();
      const existingIndex = beans.findIndex((b) => b.id === bean.id);

      if (existingIndex > -1) {
        beans[existingIndex] = bean;
      } else {
        beans.unshift(bean); // Add new to the top
      }

      const jsonValue = JSON.stringify(beans);
      await AsyncStorage.setItem(BEANS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving bean', e);
    }
  },

  async deleteBean(id: string): Promise<void> {
    try {
      const beans = await this.getAllBeans();
      const filteredBeans = beans.filter((b) => b.id !== id);
      const jsonValue = JSON.stringify(filteredBeans);
      await AsyncStorage.setItem(BEANS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error deleting bean', e);
    }
  },
};
