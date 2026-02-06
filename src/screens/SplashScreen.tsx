import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.04, { duration: 1200 }), -1, true);
  }, [scale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1 bg-brand-primary">
      <View className="flex-1 items-center justify-center">
        <Animated.Image
          source={require('../../assets/quranerlogo.png')}
          style={[
            { width: Math.min(width * 0.6, 260), height: Math.min(width * 0.6, 260) },
            logoStyle,
          ]}
          resizeMode="contain"
        />
      </View>

      <View className="items-center pb-10">
        <Text className="text-text-inverse text-h1 font-extrabold">Quraner</Text>
        <Text className="text-text-inverse text-small mt-1 opacity-90">Quran + Planner + Reminder</Text>
      </View>
    </View>
  );
}
