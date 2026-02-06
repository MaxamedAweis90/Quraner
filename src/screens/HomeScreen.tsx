import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PressableScale from '../components/PressableScale';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-bg-app" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View className="flex-row items-center justify-between mb-4">
        <PressableScale contentClassName="bg-streak-fire rounded-pill px-3 py-1.5">
          <Text className="text-text-inverse font-bold">🔥 12</Text>
        </PressableScale>
        <View className="bg-bg-surface-alt border border-border-soft rounded-pill px-3 py-1.5">
          <Text className="text-text-secondary font-semibold">🇪🇬 Egypt</Text>
        </View>
      </View>

      <View className="bg-bg-surface border border-border-soft rounded-card p-4 mb-3">
        <Text className="text-text-primary font-bold mb-2">Salah Tracker</Text>
        <View className="flex-row justify-between" style={{ gap: 8 }}>
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name, idx) => (
            <View key={name} className={idx === 0 ? 'bg-salah-current rounded-full w-11 h-11 items-center justify-center' : 'bg-salah-upcoming rounded-full w-11 h-11 items-center justify-center'}>
              <Text className={idx === 0 ? 'text-text-inverse text-caption' : 'text-text-secondary text-caption'}>
                {name.slice(0, 2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-bg-surface-alt border border-border-soft rounded-card p-4 mb-3">
        <Text className="text-text-primary font-bold mb-2">Today Summary</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-text-secondary">Pages remaining</Text>
            <Text className="text-text-primary font-bold text-h3">420</Text>
          </View>
          <View>
            <Text className="text-text-secondary">Today target</Text>
            <Text className="text-text-primary font-bold text-h3">8</Text>
          </View>
        </View>
      </View>

      <Text className="text-text-primary font-bold mb-2 mt-2">Today Sessions</Text>
      {['After Fajr • 3 pages', 'Before Dhuhr • 3 pages', 'After Maghrib • 2 pages'].map((label, idx) => (
        <View key={label} className={idx === 0 ? 'bg-card-inprogress border border-border-soft rounded-card p-4 mb-2 flex-row items-center justify-between' : 'bg-card-default border border-border-soft rounded-card p-4 mb-2 flex-row items-center justify-between'}>
          <Text className="text-text-primary font-semibold">{label}</Text>
          <PressableScale contentClassName="bg-bg-surface-alt rounded-button px-3 py-2">
            <Text className="text-brand-secondary font-bold">Finish</Text>
          </PressableScale>
        </View>
      ))}
    </ScrollView>
  );
}
