import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import theme, { ThemeTokens } from './theme';

type ThemeContextValue = {
  themeName: ColorSchemeName;
  tokens: ThemeTokens;
  setThemeName: (t: ColorSchemeName) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'light',
  tokens: { colors: theme.colors.light, spacing: theme.spacing, radii: theme.radii, typography: theme.typography },
  setThemeName: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = Appearance.getColorScheme() || 'light';
  const [themeName, setThemeName] = useState<ColorSchemeName>(colorScheme);

  useEffect(() => {
    const sub = Appearance.addChangeListener((preferences) => {
      setThemeName(preferences.colorScheme ?? 'light');
    });
    return () => sub.remove();
  }, []);

  const tokens = useMemo(() => {
    const colors = themeName === 'dark' ? theme.colors.dark : theme.colors.light;
    return { colors, spacing: theme.spacing, radii: theme.radii, typography: theme.typography } as ThemeTokens;
  }, [themeName]);

  const value = useMemo(() => ({ themeName, tokens, setThemeName }), [themeName, tokens]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
