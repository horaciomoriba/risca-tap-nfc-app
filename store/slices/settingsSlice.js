import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import * as Localization from 'expo-localization';

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
const supportedLanguages = ['en', 'es'];
const language = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';
const systemTheme = Appearance.getColorScheme() || 'dark';

const initialState = {
  theme: systemTheme,
  language,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;