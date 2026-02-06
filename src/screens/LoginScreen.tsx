import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useTheme } from '../hooks/useTheme';
import PressableScale from '../components/PressableScale';

export default function LoginScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  async function handleLogin() {
    try {
      await loginMutation.mutateAsync({ email, password });
      // After auth state updates, AppNavigator will route to CreatePlanWizard or Main
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Unknown error');
    }
  }

  return (
    <View className="flex-1 bg-bg-app px-5 justify-center">
      <View className="mb-6">
        <Text className="text-h2 font-extrabold text-text-primary mb-1">Welcome back</Text>
        <Text className="text-text-secondary leading-5">Continue your Quran plan with calm focus.</Text>
      </View>

      <View className="mb-5" style={{ gap: 12 }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={tokens.colors.text.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={tokens.colors.text.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
        />
      </View>

      <PressableScale
        onPress={handleLogin}
        disabled={loginMutation.isPending}
        contentClassName="bg-brand-primary rounded-button py-3.5 items-center mb-2"
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color={tokens.colors.text.inverse} />
        ) : (
          <Text className="text-text-inverse font-bold">Login</Text>
        )}
      </PressableScale>

      <PressableScale
        onPress={() => navigation.navigate('Register')}
        contentClassName="bg-bg-surface-alt rounded-button py-3 items-center"
      >
        <Text className="text-brand-secondary font-bold">Create account</Text>
      </PressableScale>
    </View>
  );
}
