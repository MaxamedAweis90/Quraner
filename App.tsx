import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import { restoreQueryClient } from './src/lib/queryClientPersister';
import AppNavigator from './src/navigation/AppNavigator';
import { View } from 'react-native';
import { ThemeProvider } from './src/theme/ThemeProvider';
import SplashScreen from './src/screens/SplashScreen';

// Prevent the native splash screen from auto-hiding
SplashScreenExpo.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const start = Date.now();
      try {
        await restoreQueryClient(queryClient);
      } catch (e) {
        console.warn('Failed to restore query client', e);
      }

      // Ensure the splash is visible for at least this duration (ms)
      const elapsed = Date.now() - start;
      const minMs = 2200;
      const waitMs = Math.max(0, minMs - elapsed);
      if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));

      try {
        await SplashScreenExpo.hideAsync();
      } catch (e) {
        // ignore
      }

      if (mounted) setHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!hydrated) {
    return (
      <ThemeProvider>
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

