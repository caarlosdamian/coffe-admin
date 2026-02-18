import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InventoryItem {
  id: string;
  name: string;
  roastId?: string;
  bags250g: number;
  bags500g: number;
  bags1kg: number;
  totalWeight: number; // in grams
  lastUpdated: string; // ISO String
}

const INVENTORY_STORAGE_KEY = '@inventory_data';

export const InventoryService = {
  calculateTotalWeight(item: Partial<InventoryItem>): number {
    return (
      (item.bags250g || 0) * 250 +
      (item.bags500g || 0) * 500 +
      (item.bags1kg || 0) * 1000
    );
  },

  async getAllItems(): Promise<InventoryItem[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(INVENTORY_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error fetching inventory', e);
      return [];
    }
  },

  async saveItem(item: InventoryItem): Promise<void> {
    try {
      const items = await this.getAllItems();
      const existingIndex = items.findIndex((i) => i.id === item.id);

      const itemToSave = {
        ...item,
        totalWeight: this.calculateTotalWeight(item),
        lastUpdated: new Date().toISOString(),
      };

      if (existingIndex > -1) {
        items[existingIndex] = itemToSave;
      } else {
        items.unshift(itemToSave);
      }

      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem(INVENTORY_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving inventory item', e);
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      const items = await this.getAllItems();
      const filteredItems = items.filter((i) => i.id !== id);
      const jsonValue = JSON.stringify(filteredItems);
      await AsyncStorage.setItem(INVENTORY_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error deleting inventory item', e);
    }
  },
};
