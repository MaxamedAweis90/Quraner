import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Alert, Image } from 'react-native';
import PressableScale from '../components/PressableScale';
import { BUCKETS, listAvatarFiles, registerWithEmail } from '../lib/appwrite';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';

const stepsDefault = ['Days', 'Goal', 'Salah', 'Start date', 'Country', 'Review'];
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const salahLabels = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type SalahName = (typeof salahLabels)[number];
type SalahKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
const salahKeyByLabel: Record<SalahName, SalahKey> = {
  Fajr: 'fajr',
  Dhuhr: 'dhuhr',
  Asr: 'asr',
  Maghrib: 'maghrib',
  Isha: 'isha',
};

export default function CreatePlanWizard({ route, navigation }: any) {
  const registerDraft = route?.params?.registerDraft as
    | { name: string; username: string; email: string; password: string }
    | undefined;
  const steps = registerDraft ? ['Days', 'Goal', 'Salah', 'Start date', 'Country', 'Profile', 'Avatar', 'Review'] : stepsDefault;
  const maxStep = steps.length - 1;
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<number | 'custom'>(1);
  const [customGoal, setCustomGoal] = useState('');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [gender, setGender] = useState<'Brother' | 'Sister' | ''>('');
  const [avatarId, setAvatarId] = useState<string>('');
  const [avatars, setAvatars] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { setIsAuthenticated, setUser, setHasActivePlan, user } = useAuth();
  const [salahSessions, setSalahSessions] = useState<Record<SalahKey, { before: boolean; after: boolean }>>({
    fajr: { before: true, after: false },
    dhuhr: { before: false, after: false },
    asr: { before: false, after: false },
    maghrib: { before: false, after: false },
    isha: { before: false, after: true },
  });

  const canContinue = useMemo(() => {
    if (step === 0) return weekdays.length > 0;
    if (step === 1) {
      if (goal === 'custom') return customGoal.trim().length > 0;
      return true;
    }
    if (step === 2) {
      const totalEnabled = Object.values(salahSessions).reduce(
        (sum, val) => sum + (val.before ? 1 : 0) + (val.after ? 1 : 0),
        0
      );
      return totalEnabled > 0;
    }
    if (step === 3) return dayjs(startDate).isValid();
    if (step === 4) return countryName.trim().length > 0 && countryCode.trim().length >= 2;
    if (step === 5 && registerDraft) return gender.length > 0;
    if (step === 6 && registerDraft) return avatarId.length > 0;
    return step === 7 || step === 5;
  }, [step, goal, customGoal, weekdays, gender, avatarId, registerDraft, startDate, countryCode, countryName, salahSessions]);

  useEffect(() => {
    if (!registerDraft || step !== 6 || !gender) return;
    setAvatarId('');
    let mounted = true;
    (async () => {
      try {
        setIsLoadingAvatars(true);
        const bucketId = gender === 'Brother' ? BUCKETS.avatarBrother : BUCKETS.avatarSister;
        const results = await listAvatarFiles(bucketId);
        if (mounted) setAvatars(results);
      } catch (e) {
        if (mounted) setAvatars([]);
      } finally {
        if (mounted) setIsLoadingAvatars(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [gender, registerDraft, step]);

  const onNext = async () => {
    if (!canContinue) return;
    if (step < maxStep) {
      setStep(step + 1);
      return;
    }
    const targetKhatms = goal === 'custom' ? Math.max(1, parseInt(customGoal, 10) || 1) : goal;
    const planPayload = {
      userId: (user as any)?.$id ?? (user as any)?.userId ?? null,
      startDate,
      planRangeDays: 30,
      targetKhatms,
      weekdaysActive: weekdays,
      salahSessionsEnabled: salahSessions,
    };
    if (registerDraft && gender) {
      try {
        setIsRegistering(true);
        const result = await registerWithEmail({
          ...registerDraft,
          gender,
          avatarId: avatarId || null,
          countryCode: countryCode.trim(),
          countryName: countryName.trim(),
        });
        setUser(result.profile);
        setIsAuthenticated(true);
        setHasActivePlan(false);
        const registeredUserId = (result.profile as any)?.$id ?? (result.profile as any)?.userId ?? null;
        navigation.replace('CreatingPlan', {
          payload: { ...planPayload, userId: registeredUserId },
        });
      } catch (e: any) {
        Alert.alert('Registration failed', e.message || 'Unknown error');
      } finally {
        setIsRegistering(false);
      }
      return;
    }
    if (!planPayload.userId) {
      Alert.alert('Missing account', 'Please login again to create your plan.');
      return;
    }
    navigation.replace('CreatingPlan', { payload: planPayload });
  };

  const onBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleWeekday = (idx: number) => {
    setWeekdays((prev) => (prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]));
  };

  return (
    <View className="flex-1 bg-bg-app px-5">
      <View className="flex-row items-center justify-between mt-4 mb-3">
        <PressableScale
          onPress={() => (step === 0 ? navigation.goBack() : onBack())}
          contentClassName="w-10 h-10 rounded-full bg-bg-surface-alt border border-border-soft items-center justify-center"
        >
          <Text className="text-brand-primary text-h3 font-bold">&lt;</Text>
        </PressableScale>
        <View />
      </View>

      <Text className="text-h2 font-extrabold text-text-primary mb-1">Set up your plan</Text>
      <Text className="text-text-secondary mb-4">We will guide you through your Quran goal, days, and salah sessions.</Text>

      <View className="flex-row flex-wrap mb-5" style={{ gap: 8 }}>
        {steps.map((label, idx) => (
          <View
            key={label}
            className={idx === step ? 'bg-brand-primary rounded-pill px-3 py-2' : 'bg-bg-surface-alt border border-border-soft rounded-pill px-3 py-2'}
          >
            <Text className={idx === step ? 'text-text-inverse font-semibold' : 'text-text-primary font-semibold'}>{label}</Text>
          </View>
        ))}
      </View>

      {step === 0 && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Days per week</Text>
          <Text className="text-text-secondary mb-3">Select the days you will read.</Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {weekdayLabels.map((label, idx) => {
              const active = weekdays.includes(idx);
              return (
                <PressableScale
                  key={label}
                  onPress={() => toggleWeekday(idx)}
                  contentClassName={active ? 'bg-brand-primary rounded-pill px-3 py-2' : 'bg-bg-surface border border-border-soft rounded-pill px-3 py-2'}
                >
                  <Text className={active ? 'text-text-inverse font-semibold' : 'text-text-primary font-semibold'}>{label}</Text>
                </PressableScale>
              );
            })}
          </View>
        </View>
      )}

      {step === 1 && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Quran goal</Text>
          <View style={{ gap: 10 }}>
            {[1, 2, 3].map((x) => (
              <PressableScale
                key={x}
                onPress={() => setGoal(x)}
                contentClassName={goal === x ? 'bg-brand-primary rounded-card p-4' : 'bg-bg-surface border border-border-soft rounded-card p-4'}
              >
                <Text className={goal === x ? 'text-text-inverse font-bold' : 'text-text-primary font-bold'}>Finish Quran {x}x</Text>
                <Text className={goal === x ? 'text-text-inverse opacity-90' : 'text-text-secondary'}>Balanced plan across your selected days.</Text>
              </PressableScale>
            ))}

            <PressableScale
              onPress={() => setGoal('custom')}
              contentClassName={goal === 'custom' ? 'bg-brand-primary rounded-card p-4' : 'bg-bg-surface border border-border-soft rounded-card p-4'}
            >
              <Text className={goal === 'custom' ? 'text-text-inverse font-bold' : 'text-text-primary font-bold'}>Custom goal</Text>
              <Text className={goal === 'custom' ? 'text-text-inverse opacity-90' : 'text-text-secondary'}>Choose your own target (1–3x+).</Text>
            </PressableScale>

            {goal === 'custom' && (
              <TextInput
                placeholder="Enter number of khatms"
                keyboardType="numeric"
                value={customGoal}
                onChangeText={setCustomGoal}
                className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
              />
            )}
          </View>
        </View>
      )}

      {step === 2 && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Salah sessions</Text>
          <Text className="text-text-secondary mb-3">Choose before and after sessions for each salah.</Text>
          <View style={{ gap: 12 }}>
            {salahLabels.map((label) => {
              const key = salahKeyByLabel[label];
              const state = salahSessions[key];
              return (
                <View key={label} className="bg-bg-surface border border-border-soft rounded-card p-4" style={{ gap: 10 }}>
                  <Text className="text-text-primary font-bold">{label}</Text>
                  <View className="flex-row" style={{ gap: 10 }}>
                    <PressableScale
                      onPress={() =>
                        setSalahSessions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], before: !prev[key].before },
                        }))
                      }
                      contentClassName={state.before ? 'bg-brand-primary rounded-pill px-4 py-2' : 'bg-bg-surface-alt border border-border-soft rounded-pill px-4 py-2'}
                    >
                      <Text className={state.before ? 'text-text-inverse font-semibold' : 'text-text-primary font-semibold'}>
                        Before
                      </Text>
                    </PressableScale>
                    <PressableScale
                      onPress={() =>
                        setSalahSessions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], after: !prev[key].after },
                        }))
                      }
                      contentClassName={state.after ? 'bg-brand-primary rounded-pill px-4 py-2' : 'bg-bg-surface-alt border border-border-soft rounded-pill px-4 py-2'}
                    >
                      <Text className={state.after ? 'text-text-inverse font-semibold' : 'text-text-primary font-semibold'}>
                        After
                      </Text>
                    </PressableScale>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {step === 3 && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Start date</Text>
          <Text className="text-text-secondary mb-3">Choose the date you want to start.</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
            className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
          />
          {!dayjs(startDate).isValid() ? (
            <Text className="text-state-danger text-caption mt-2">Enter a valid date (YYYY-MM-DD).</Text>
          ) : null}
        </View>
      )}

      {step === 4 && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Country</Text>
          <Text className="text-text-secondary mb-3">Tell us where you are from.</Text>
          <View style={{ gap: 12 }}>
            <TextInput
              placeholder="Country code (EG)"
              value={countryCode}
              onChangeText={setCountryCode}
              autoCapitalize="characters"
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
            <TextInput
              placeholder="Country name (Egypt)"
              value={countryName}
              onChangeText={setCountryName}
              className="border border-border-default rounded-xl px-3 py-3 bg-bg-surface text-text-primary"
            />
          </View>
        </View>
      )}

      {step === 5 && registerDraft && (
        <View className="mb-6">
          <Text className="text-text-primary font-extrabold text-h3 mb-1">Who are you</Text>
          <Text className="text-text-secondary mb-4">A Brother, or A Sister</Text>
          <View className="flex-row" style={{ gap: 12 }}>
            {(['Sister', 'Brother'] as const).map((option) => {
              const active = gender === option;
              const accent = option === 'Sister' ? 'bg-brand-secondary' : 'bg-brand-accent';
              return (
                <PressableScale
                  key={option}
                  onPress={() => setGender(option)}
                  contentClassName={
                    active
                      ? 'flex-1 bg-brand-primary rounded-card p-4 items-center'
                      : 'flex-1 bg-bg-surface border border-border-soft rounded-card p-4 items-center'
                  }
                >
                  <View className={`${accent} w-20 h-20 rounded-full items-center justify-center`}>
                    <Text className="text-text-inverse text-h2 font-extrabold">
                      {option === 'Sister' ? 'S' : 'B'}
                    </Text>
                  </View>
                  <Text className={active ? 'text-text-inverse font-bold mt-3' : 'text-text-primary font-bold mt-3'}>
                    {option}
                  </Text>
                  <Text className={active ? 'text-text-inverse opacity-90 text-caption mt-1' : 'text-text-secondary text-caption mt-1'}>
                    {option === 'Sister' ? 'A Sister' : 'A Brother'}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>
      )}

      {step === 6 && registerDraft && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Pick your avatar</Text>
          <Text className="text-text-secondary mb-3">Choose one to represent you.</Text>
          {isLoadingAvatars ? (
            <Text className="text-text-muted">Loading avatars...</Text>
          ) : (
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
                    <Image
                      source={{ uri: avatar.url }}
                      className="w-[72px] h-[72px] rounded-full"
                    />
                    <Text className={isActive ? 'text-text-inverse text-caption mt-2' : 'text-text-secondary text-caption mt-2'}>
                      {avatar.name}
                    </Text>
                  </PressableScale>
                );
              })}
            </View>
          )}
        </View>
      )}

      {step === 7 && registerDraft && (
        <View className="mb-6">
          <Text className="text-text-primary font-bold mb-2">Review</Text>
          <Text className="text-text-secondary mb-3">Confirm your plan details.</Text>
          <View className="bg-bg-surface border border-border-soft rounded-card p-4" style={{ gap: 8 }}>
            <Text className="text-text-primary font-semibold">Goal: {goal === 'custom' ? `${customGoal}x` : `${goal}x`}</Text>
            <Text className="text-text-secondary">Days: {weekdays.map((d) => weekdayLabels[d]).join(', ')}</Text>
            <Text className="text-text-secondary">Start date: {startDate}</Text>
            <Text className="text-text-secondary">Country: {countryName} ({countryCode.toUpperCase()})</Text>
            <Text className="text-text-secondary">Gender: {gender}</Text>
            <Text className="text-text-secondary">Avatar: {avatarId ? 'Selected' : 'None'}</Text>
          </View>
        </View>
      )}

      <View className="flex-row justify-between" style={{ gap: 10 }}>
        <PressableScale
          onPress={() => (step === 0 ? navigation.goBack() : onBack())}
          contentClassName="bg-bg-surface-alt rounded-button py-3 items-center flex-1"
        >
          <Text className="text-brand-secondary font-bold">Back</Text>
        </PressableScale>
        <PressableScale
          onPress={onNext}
          disabled={!canContinue || isRegistering}
          contentClassName={!canContinue || isRegistering ? 'bg-brand-primary rounded-button py-3 items-center flex-1 opacity-50' : 'bg-brand-primary rounded-button py-3 items-center flex-1'}
        >
          <Text className="text-text-inverse font-bold">{step === maxStep && registerDraft ? 'Finish' : 'Next'}</Text>
        </PressableScale>
      </View>

      {step >= 1 && (
        <Text className="text-text-muted text-center mt-3">More steps are coming next.</Text>
      )}
    </View>
  );
}
