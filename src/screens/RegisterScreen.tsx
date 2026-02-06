import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { account } from '../lib/appwrite';
import { useTheme } from '../hooks/useTheme';
import PressableScale from '../components/PressableScale';

export default function RegisterScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    try {
      // Appwrite: account.create
      // @ts-ignore
      await account.create('unique()', email, password);
      // On success, go to Wizard to collect profile and plan
      navigation.replace('CreatePlanWizard');
    } catch (e: any) {
      Alert.alert('Registration failed', e.message || 'Unknown error');
    }
  }

  return (
    <View className="flex-1 bg-bg-app px-5 justify-center">
      <Text className="text-h2 font-extrabold text-text-primary mb-1">Create your account</Text>
      <Text className="text-text-secondary mb-5">Set up your Quran plan in a few steps.</Text>

      <View className="mb-4" style={{ gap: 12 }}>
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

      <PressableScale onPress={handleRegister} contentClassName="bg-brand-primary rounded-button py-3.5 items-center">
        <Text className="text-text-inverse font-bold">Continue</Text>
      </PressableScale>
    </View>
  );
}
