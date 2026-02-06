import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import PressableScale from '../components/PressableScale';
import { BUCKETS, listAvatarFiles, updateProfile } from '../lib/appwrite';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../api/auth';

export default function ProfileScreen() {
  const { user, setUser, setIsAuthenticated, setHasActivePlan } = useAuth();
  const userId = useMemo(() => (user ? ((user as any).$id ?? (user as any).userId ?? '') : ''), [user]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Brother' | 'Sister'>('Brother');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [avatars, setAvatars] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const avatarUrl = useMemo(() => avatars.find((a) => a.id === avatarId)?.url, [avatars, avatarId]);

  useEffect(() => {
    if (!user) return;
    setName((user as any).name ?? '');
    setGender(((user as any).gender as 'Brother' | 'Sister') ?? 'Brother');
    setCountryCode((user as any).countryCode ?? '');
    setCountryName((user as any).countryName ?? '');
    setAvatarId((user as any).avatarId ?? '');
  }, [user]);

  useEffect(() => {
    if (!gender) return;
    let mounted = true;
    (async () => {
      try {
        const bucketId = gender === 'Brother' ? BUCKETS.avatarBrother : BUCKETS.avatarSister;
        const results = await listAvatarFiles(bucketId);
        if (mounted) setAvatars(results);
      } catch (e) {
        if (mounted) setAvatars([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [gender]);

  const handleSave = async () => {
    if (!userId) return;
    try {
      setIsSaving(true);
      const updated = await updateProfile(userId, {
        name: name.trim(),
        gender,
        countryCode: countryCode.trim() || null,
        countryName: countryName.trim() || null,
        avatarId: avatarId || null,
      });
      setUser(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsAuthenticated(false);
    setHasActivePlan(false);
  };

  return (
    <View className="flex-1 bg-bg-app px-5">
      <View className="items-center mt-4 mb-5">
        <View className="w-[72px] h-[72px] rounded-full bg-bg-surface-alt mb-2 overflow-hidden">
          {avatarUrl ? <Image source={{ uri: avatarUrl }} className="w-[72px] h-[72px]" /> : null}
        </View>
        <Text className="text-text-primary font-extrabold text-h3">{name || 'Your Name'}</Text>
        <Text className="text-text-secondary">{gender} • {countryName || countryCode || 'Select country'}</Text>
      </View>

      <View className="bg-bg-surface border border-border-soft rounded-card p-4" style={{ gap: 12 }}>
        <View style={{ gap: 6 }}>
          <Text className="text-text-secondary text-small font-semibold">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text className="text-text-secondary text-small font-semibold">Gender</Text>
          <View className="flex-row" style={{ gap: 10 }}>
            {(['Brother', 'Sister'] as const).map((option) => (
              <PressableScale
                key={option}
                onPress={() => setGender(option)}
                contentClassName={
                  gender === option
                    ? 'bg-brand-primary rounded-pill px-4 py-2'
                    : 'bg-bg-surface-alt border border-border-soft rounded-pill px-4 py-2'
                }
              >
                <Text className={gender === option ? 'text-text-inverse font-semibold' : 'text-text-primary font-semibold'}>
                  {option}
                </Text>
              </PressableScale>
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text className="text-text-secondary text-small font-semibold">Country code</Text>
          <TextInput
            value={countryCode}
            onChangeText={setCountryCode}
            autoCapitalize="characters"
            className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text className="text-text-secondary text-small font-semibold">Country name</Text>
          <TextInput
            value={countryName}
            onChangeText={setCountryName}
            className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
          />
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-text-secondary text-small font-semibold mb-2">Choose avatar</Text>
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {avatars.map((avatar) => {
            const isActive = avatarId === avatar.id;
            return (
              <PressableScale
                key={avatar.id}
                onPress={() => setAvatarId(avatar.id)}
                contentClassName={
                  isActive
                    ? 'bg-brand-primary rounded-card p-2 items-center'
                    : 'bg-bg-surface border border-border-soft rounded-card p-2 items-center'
                }
              >
                <Image source={{ uri: avatar.url }} className="w-[64px] h-[64px] rounded-full" />
                <Text className={isActive ? 'text-text-inverse text-caption mt-2' : 'text-text-secondary text-caption mt-2'}>
                  {avatar.name}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <PressableScale
        onPress={handleSave}
        disabled={isSaving}
        contentClassName={isSaving ? 'bg-brand-primary rounded-button py-3 items-center mt-6 opacity-60' : 'bg-brand-primary rounded-button py-3 items-center mt-6'}
      >
        <Text className="text-text-inverse font-bold">{isSaving ? 'Saving...' : 'Save changes'}</Text>
      </PressableScale>

      <TouchableOpacity className="border border-state-danger rounded-button py-3 items-center mt-4" onPress={handleLogout}>
        <Text className="text-state-danger font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
