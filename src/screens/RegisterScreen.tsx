import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable, ActivityIndicator } from 'react-native';
import { getProfileByUsername } from '../lib/appwrite';
import { useTheme } from '../hooks/useTheme';
import PressableScale from '../components/PressableScale';

export default function RegisterScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; username?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = 'Enter your full name.';
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)) {
      nextErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore).';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (confirmPassword.trim() !== password.trim()) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister() {
    try {
      if (!validate()) return;
      setIsSubmitting(true);
      const trimmedUsername = username.trim().toLowerCase();
      const existing = await getProfileByUsername(trimmedUsername);
      if (existing) {
        setErrors((prev) => ({ ...prev, username: 'That username is already taken.' }));
        return;
      }
      navigation.navigate('CreatePlanWizard', {
        registerDraft: {
          name: name.trim(),
          username: trimmedUsername,
          email: email.trim(),
          password: password.trim(),
        },
      });
    } catch (e: any) {
      Alert.alert('Registration failed', e.message || 'Unknown error');
    } finally {
      setIsSubmitting(false);
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
        <Text className="text-h2 font-extrabold text-text-primary mb-1">Create your account</Text>
        <Text className="text-text-secondary mb-5">Set up your Quran plan in a few steps.</Text>

        <View className="bg-bg-surface rounded-card border border-border-soft p-4 mb-4" style={{ gap: 12 }}>
          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Full name</Text>
            <TextInput
              placeholder="Your name"
              placeholderTextColor={tokens.colors.text.muted}
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
            {errors.name ? <Text className="text-state-danger text-caption">{errors.name}</Text> : null}
          </View>

          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Username</Text>
            <TextInput
              placeholder="yourname"
              placeholderTextColor={tokens.colors.text.muted}
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              autoCapitalize="none"
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
            {errors.username ? <Text className="text-state-danger text-caption">{errors.username}</Text> : null}
          </View>

          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Email</Text>
            <TextInput
              placeholder="you@gmail.com"
              placeholderTextColor={tokens.colors.text.muted}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoCapitalize="none"
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
            {errors.email ? <Text className="text-state-danger text-caption">{errors.email}</Text> : null}
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

          <View style={{ gap: 6 }}>
            <Text className="text-text-secondary text-small font-semibold">Confirm password</Text>
            <View className="flex-row items-center border border-border-default rounded-xl px-3 py-2 bg-bg-surface">
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={tokens.colors.text.muted}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                className="flex-1 text-text-primary"
              />
              <Pressable onPress={() => setShowConfirmPassword((prev) => !prev)}>
                <Text className="text-brand-primary font-semibold">{showConfirmPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>
            {errors.confirmPassword ? <Text className="text-state-danger text-caption">{errors.confirmPassword}</Text> : null}
          </View>
        </View>

        <PressableScale onPress={handleRegister} disabled={isSubmitting} contentClassName="bg-brand-primary rounded-button py-3.5 items-center">
          {isSubmitting ? (
            <ActivityIndicator color={tokens.colors.text.inverse} />
          ) : (
            <Text className="text-text-inverse font-bold">Continue</Text>
          )}
        </PressableScale>
      </View>
    </View>
  );
}
