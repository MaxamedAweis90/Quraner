import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CreatePlanWizard({ navigation }: any) {
  return (
    <View className="flex-1 bg-bg-app px-5 justify-center">
      <Text className="text-h2 font-extrabold text-text-primary mb-2">Set up your plan</Text>
      <Text className="text-text-secondary mb-4">We will guide you through your Quran goal, days, and salah sessions.</Text>

      <View className="flex-row flex-wrap mb-5" style={{ gap: 8 }}>
        {['Goal', 'Days', 'Salah times', 'Start date', 'Profile', 'Avatar', 'Review'].map((label) => (
          <View key={label} className="bg-bg-surface-alt border border-border-soft rounded-pill px-3 py-2">
            <Text className="text-text-primary font-semibold">{label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity className="bg-brand-primary rounded-button py-3.5 items-center" onPress={() => navigation.replace('Main')}>
        <Text className="text-text-inverse font-bold">Start Wizard</Text>
      </TouchableOpacity>
    </View>
  );
}
