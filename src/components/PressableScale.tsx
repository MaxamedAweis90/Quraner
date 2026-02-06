import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type PressableScaleProps = {
  onPress?: () => void;
  disabled?: boolean;
  scaleTo?: number;
  children: React.ReactNode;
  contentClassName?: string;
  contentStyle?: ViewStyle;
};

export default function PressableScale({
  onPress,
  disabled,
  scaleTo = 0.98,
  children,
  contentClassName,
  contentStyle,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        if (!disabled) scale.value = withTiming(scaleTo, { duration: 120 });
      }}
      onPressOut={() => {
        if (!disabled) scale.value = withTiming(1, { duration: 120 });
      }}
    >
      <Animated.View style={animatedStyle}>
        <View className={contentClassName} style={contentStyle}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}