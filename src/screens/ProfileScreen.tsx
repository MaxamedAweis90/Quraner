import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-bg-app px-5">
      <View className="items-center mt-4 mb-5">
        <View className="w-[72px] h-[72px] rounded-full bg-bg-surface-alt mb-2" />
        <Text className="text-text-primary font-extrabold text-h3">Your Name</Text>
        <Text className="text-text-secondary">Brother • Egypt</Text>
      </View>

      <View style={{ gap: 10 }}>
        {['Update Profile', 'Regenerate Plan', 'Country & Gender'].map((label) => (
          <View key={label} className="bg-bg-surface border border-border-soft rounded-card p-4 flex-row justify-between">
            <Text className="text-text-primary">{label}</Text>
            <Text className="text-text-muted">›</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity className="border border-state-danger rounded-button py-3 items-center mt-6">
        <Text className="text-state-danger font-bold">Request account deletion</Text>
      </TouchableOpacity>
    </View>
  );
}
