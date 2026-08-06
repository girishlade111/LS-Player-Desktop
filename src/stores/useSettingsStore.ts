import { create } from 'zustand';
import type { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  general: {
    theme: 'dark',
    accentColor: '#3b82f6',
    startupBehavior: 'home',
    resumePlayback: true,
    alwaysOnTop: false,
    confirmOnExit: false,
  },
  playback: {
    defaultVolume: 0.8,
    defaultSpeed: 1.0,
    seekIntervalShort: 5,
    seekIntervalMedium: 10,
    seekIntervalLong: 30,
    hardwareAcceleration: true,
    preferredRenderer: 'auto',
    mouseWheelAction: 'volume',
    doubleClickAction: 'fullscreen',
    autoPlayNext: true,
  },
  subtitles: {
    autoLoadMatching: true,
    preferredLanguage: 'en',
    style: {
      fontSize: 22,
      color: '#FFFFFF',
      backgroundColor: '#000000',
      backgroundOpacity: 0.6,
      outlineColor: '#000000',
      outlineWidth: 2,
      verticalPosition: 8,
    },
    encoding: 'UTF-8',
  },
  library: {
    generateThumbnails: true,
    recentItemsLimit: 20,
    watchHistoryEnabled: true,
    foldersToScan: ['C:\\Users\\Default\\Videos', 'D:\\Media\\Movies'],
  },
  advanced: {
    logLevel: 'info',
    hardwareDecoder: 'DXVA2 / D3D11VA',
    cacheSizeMb: 512,
  },
};

interface SettingsStore {
  settings: AppSettings;
  updateGeneral: (general: Partial<AppSettings['general']>) => void;
  updatePlayback: (playback: Partial<AppSettings['playback']>) => void;
  updateSubtitles: (subtitles: Partial<AppSettings['subtitles']>) => void;
  updateSubtitleStyle: (style: Partial<AppSettings['subtitles']['style']>) => void;
  updateLibrary: (library: Partial<AppSettings['library']>) => void;
  updateAdvanced: (advanced: Partial<AppSettings['advanced']>) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'ls_player_settings_v1';

const getInitialSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load saved settings, using defaults:', e);
  }
  return DEFAULT_SETTINGS;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: getInitialSettings(),

  updateGeneral: (newGeneral) =>
    set((state) => {
      const updated = {
        ...state.settings,
        general: { ...state.settings.general, ...newGeneral },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  updatePlayback: (newPlayback) =>
    set((state) => {
      const updated = {
        ...state.settings,
        playback: { ...state.settings.playback, ...newPlayback },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  updateSubtitles: (newSubtitles) =>
    set((state) => {
      const updated = {
        ...state.settings,
        subtitles: { ...state.settings.subtitles, ...newSubtitles },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  updateSubtitleStyle: (newStyle) =>
    set((state) => {
      const updated = {
        ...state.settings,
        subtitles: {
          ...state.settings.subtitles,
          style: { ...state.settings.subtitles.style, ...newStyle },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  updateLibrary: (newLibrary) =>
    set((state) => {
      const updated = {
        ...state.settings,
        library: { ...state.settings.library, ...newLibrary },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  updateAdvanced: (newAdvanced) =>
    set((state) => {
      const updated = {
        ...state.settings,
        advanced: { ...state.settings.advanced, ...newAdvanced },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { settings: updated };
    }),

  resetSettings: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ settings: DEFAULT_SETTINGS });
  },
}));
