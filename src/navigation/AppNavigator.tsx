import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatingPlanScreen from '../screens/CreatingPlanScreen';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rank" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, hasActivePlan } = useAuth();

  // While auth is being restored, show nothing or a loading state
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={require('../screens/RegisterScreen').default} />
            <Stack.Screen name="CreatePlanWizard" component={require('../screens/CreatePlanWizard').default} />
            <Stack.Screen name="CreatingPlan" component={CreatingPlanScreen} />
          </>
        ) : hasActivePlan === false ? (
          // Authenticated but no active plan -> run through wizard
          <>
            <Stack.Screen name="CreatePlanWizard" component={require('../screens/CreatePlanWizard').default} />
            <Stack.Screen name="CreatingPlan" component={CreatingPlanScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
