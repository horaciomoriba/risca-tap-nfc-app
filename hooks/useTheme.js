import { useSelector } from 'react-redux';
import { Appearance } from 'react-native';
import { themes } from '../constants/theme';

export const useTheme = () => {
  const { theme } = useSelector((state) => state.settings);

  const resolvedTheme = theme === 'system'
    ? (Appearance.getColorScheme() || 'dark')
    : theme;

  return themes[resolvedTheme] || themes.dark;
};