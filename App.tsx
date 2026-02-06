import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import { restoreQueryClient } from './src/lib/queryClientPersister';
import AppNavigator from './src/navigation/AppNavigator';
import { View, Animated, StyleSheet } from 'react-native';
import { ThemeProvider } from './src/theme/ThemeProvider';
import SplashScreen from './src/screens/SplashScreen';

// Prevent the native splash screen from auto-hiding
SplashScreenExpo.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (!hydrated) return;
    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowSplash(false));
  }, [hydrated, splashOpacity]);

  return (
    <ThemeProvider>
      {!hydrated ? (
        <SplashScreen />
      ) : (
        <View style={styles.appRoot}>
          <QueryClientProvider client={queryClient}>
            <AppNavigator />
            <StatusBar style="auto" />
          </QueryClientProvider>
          {showSplash && (
            <Animated.View style={[styles.splashOverlay, { opacity: splashOpacity }]}> 
              <SplashScreen />
            </Animated.View>
          )}
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: { flex: 1 },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

