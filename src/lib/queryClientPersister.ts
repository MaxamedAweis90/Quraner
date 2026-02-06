import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

const PERSIST_KEY = 'rq-cache-v1';

export async function persistQueryClient(client: QueryClient, keysToPersist: string[]) {
  try {
    const cache: Record<string, any> = {};
    for (const key of keysToPersist) {
      const data = client.getQueryData(key as any);
      if (data !== undefined) cache[key] = data;
    }
    await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Error persisting query cache', e);
  }
}

export async function restoreQueryClient(client: QueryClient) {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (!raw) return;
    const cache = JSON.parse(raw) as Record<string, any>;
    for (const key of Object.keys(cache)) {
      client.setQueryData([key] as any, cache[key]);
    }
  } catch (e) {
    console.warn('Error restoring query cache', e);
  }
}
