import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useTheme } from '../hooks/useTheme';
import PressableScale from '../components/PressableScale';
import { loginGoogle } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queries/keys';
import { getActivePlan, getProfile } from '../lib/appwrite';

export default function LoginScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const loginMutation = useLogin();
  const { setUser, setIsAuthenticated, setHasActivePlan } = useAuth();
  const queryClient = useQueryClient();

  function validate() {
    const nextErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      nextErrors.identifier = 'Enter your email or username.';
    }
    if (password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleLogin() {
    try {
      if (!validate()) return;
      await loginMutation.mutateAsync({ identifier: identifier.trim(), password });
      // After auth state updates, AppNavigator will route to CreatePlanWizard or Main
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Unknown error');
    }
  }

  async function handleGoogleLogin() {
    try {
      setIsGoogleLoading(true);
      const acc = await loginGoogle();
      const userId = ((acc as any)?.$id ?? (acc as any)?.id ?? '') as string;
      if (!userId) throw new Error('Google login failed.');
      const profile = await getProfile(userId);
      setUser(profile);
      setIsAuthenticated(true);
      queryClient.setQueryData(QUERY_KEYS.PROFILE(userId), profile);
      const plan = await getActivePlan(userId);
      queryClient.setQueryData(QUERY_KEYS.PLAN(userId), plan);
      setHasActivePlan(!!plan);
    } catch (e: any) {
      Alert.alert('Google login failed', e.message || 'Unknown error');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-bg-app px-5">
      <View className="flex-row items-center justify-between mt-4 mb-3">
        <PressableScale
          onPress={() => navigation.goBack()}
          contentClassName="w-10 h-10 rounded-full bg-bg-surface-alt border border-border-soft items-center justify-center"
        >
          <Text className="text-brand-primary text-h3 font-bold">&lt;</Text>
        </PressableScale>
        <View />
      </View>

      <View className="flex-1 justify-center">
        <View className="mb-6">
          <Text className="text-h2 font-extrabold text-text-primary mb-1">Welcome back</Text>
          <Text className="text-text-secondary leading-5">Continue your Quran plan with calm focus.</Text>
        </View>

        <View className="bg-bg-surface rounded-card border border-border-soft p-4 mb-4" style={{ gap: 12 }}>
          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Email or username</Text>
            <TextInput
              placeholder="yourname or you@gmail.com"
              placeholderTextColor={tokens.colors.text.muted}
              value={identifier}
              onChangeText={(value) => {
                setIdentifier(value);
                if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
              }}
              autoCapitalize="none"
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
            {errors.identifier ? <Text className="text-state-danger text-caption">{errors.identifier}</Text> : null}
          </View>

          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Password</Text>
            <View className="flex-row items-center border border-border-default rounded-xl px-3 py-2 bg-bg-surface">
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={tokens.colors.text.muted}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-text-primary"
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Text className="text-brand-primary font-semibold">{showPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>
            {errors.password ? <Text className="text-state-danger text-caption">{errors.password}</Text> : null}
          </View>
        </View>

        <PressableScale
          onPress={handleLogin}
          disabled={loginMutation.isPending}
          contentClassName="bg-brand-primary rounded-button py-3.5 items-center mb-3"
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color={tokens.colors.text.inverse} />
          ) : (
            <Text className="text-text-inverse font-bold">Login</Text>
          )}
        </PressableScale>

        <View className="flex-row items-center mb-3" style={{ gap: 10 }}>
          <View className="flex-1 h-px bg-border-soft" />
          <Text className="text-text-muted text-caption">or</Text>
          <View className="flex-1 h-px bg-border-soft" />
        </View>

        <PressableScale
          onPress={handleGoogleLogin}
          disabled={isGoogleLoading}
          contentClassName="bg-bg-surface-alt rounded-button py-3 items-center mb-2"
        >
          {isGoogleLoading ? (
            <ActivityIndicator color={tokens.colors.brand.primary} />
          ) : (
            <Text className="text-brand-secondary font-bold">Continue with Google</Text>
          )}
        </PressableScale>
      </View>

      <View className="pb-6">
        <PressableScale
          onPress={() => navigation.navigate('Register')}
          contentClassName="bg-bg-surface-alt rounded-button py-3 items-center"
        >
          <Text className="text-brand-secondary font-bold">Create account</Text>
        </PressableScale>
      </View>
    </View>
  );
}
