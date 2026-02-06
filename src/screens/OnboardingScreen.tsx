import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import PressableScale from '../components/PressableScale';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-bg-app">
      <View className="px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <PressableScale
            onPress={() => navigation.goBack()}
            contentClassName="w-10 h-10 rounded-full bg-bg-surface-alt border border-border-soft items-center justify-center"
          >
            <Text className="text-brand-primary text-h3 font-bold">&lt;</Text>
          </PressableScale>
          <View />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mt-6 mb-3">
          <Image source={require('../../assets/quranerlogo.png')} style={{ width: 160, height: 160, marginBottom: 14 }} resizeMode="contain" />
          <Text className="text-h1 font-extrabold text-text-primary mb-1">Quraner</Text>
          <Text className="text-body text-text-secondary text-center leading-6" style={{ maxWidth: 320 }}>
            Build a calm, daily Quran habit with a plan that fits your week.
          </Text>
        </View>

        <View className="mt-4" style={{ gap: 12 }}>
          <View className="bg-bg-surface-alt border border-border-soft rounded-card p-4">
            <Text className="text-text-primary font-bold mb-1">Plan that fits</Text>
            <Text className="text-text-secondary leading-5">Pick your days and we distribute pages across your salah sessions.</Text>
          </View>
          <View className="bg-bg-surface-alt border border-border-soft rounded-card p-4">
            <Text className="text-text-primary font-bold mb-1">Stay consistent</Text>
            <Text className="text-text-secondary leading-5">Track streaks and progress year‑round without resets.</Text>
          </View>
          <View className="bg-bg-surface-alt border border-border-soft rounded-card p-4">
            <Text className="text-text-primary font-bold mb-1">Gentle reminders</Text>
            <Text className="text-text-secondary leading-5">Simple daily session cards keep your habit light and clear.</Text>
          </View>
        </View>

        <View className="flex-row justify-center mt-4" style={{ gap: 8 }}>
          <View className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <View className="w-2.5 h-2.5 rounded-full bg-border-soft" />
          <View className="w-2.5 h-2.5 rounded-full bg-border-soft" />
        </View>
      </ScrollView>

      <View className="px-5 pb-5 pt-2">
        <PressableScale
          onPress={() => navigation.navigate('Login')}
          contentClassName="bg-brand-primary rounded-button py-3.5 items-center"
        >
          <Text className="text-text-inverse font-bold">Get Started</Text>
        </PressableScale>
        <Text className="text-text-muted text-center mt-2">Takes less than 2 minutes</Text>
      </View>
    </View>
  );
}
