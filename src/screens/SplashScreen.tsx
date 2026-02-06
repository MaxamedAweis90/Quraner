import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-primary">
      <Image
        source={require('../../assets/quranerlogo.png')}
        style={{ width: Math.min(width * 0.6, 260), height: Math.min(width * 0.6, 260), marginBottom: 28 }}
        resizeMode="contain"
      />
      <Text className="text-text-inverse text-h1 font-extrabold">Quraner</Text>
      <Text className="text-text-inverse text-small mt-1 opacity-90">Quran + Reminder</Text>
    </View>
  );
}
