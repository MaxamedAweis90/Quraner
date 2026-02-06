import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { createPlan } from '../lib/appwrite';
import { QUERY_KEYS } from '../queries/keys';
import { useAuth } from '../hooks/useAuth';

export default function CreatingPlanScreen({ route, navigation }: any) {
  const queryClient = useQueryClient();
  const { setHasActivePlan } = useAuth();
  const payload = route?.params?.payload as any;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await createPlan(payload);
        if (!mounted) return;
        const userId = payload?.userId ?? null;
        if (userId && result?.plan) {
          queryClient.setQueryData(QUERY_KEYS.PLAN(userId), result.plan);
        }
        setHasActivePlan(true);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } catch (e) {
        navigation.goBack();
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigation, payload, queryClient, setHasActivePlan]);

  return (
    <View className="flex-1 bg-bg-app items-center justify-center px-6">
      <ActivityIndicator size="large" />
      <Text className="text-text-primary font-bold text-h3 mt-4">Creating your plan...</Text>
      <Text className="text-text-secondary mt-2 text-center">Setting up your days and sessions so the next screen feels instant.</Text>
    </View>
  );
}
