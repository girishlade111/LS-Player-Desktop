import { create } from 'zustand';

interface UiStore {
  isPreferencesOpen: boolean;
  isEffectsFiltersOpen: boolean;
  isMediaInfoOpen: boolean;
  isAdvancedControlsOpen: boolean;
  isPlaylistOpen: boolean;

  // Actions
  setPreferencesOpen: (open: boolean) => void;
  setEffectsFiltersOpen: (open: boolean) => void;
  setMediaInfoOpen: (open: boolean) => void;
  setAdvancedControlsOpen: (open: boolean) => void;
  setPlaylistOpen: (open: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isPreferencesOpen: false,
  isEffectsFiltersOpen: false,
  isMediaInfoOpen: false,
  isAdvancedControlsOpen: false,
  isPlaylistOpen: false,

  setPreferencesOpen: (open) => set({ isPreferencesOpen: open }),
  setEffectsFiltersOpen: (open) => set({ isEffectsFiltersOpen: open }),
  setMediaInfoOpen: (open) => set({ isMediaInfoOpen: open }),
  setAdvancedControlsOpen: (open) => set({ isAdvancedControlsOpen: open }),
  setPlaylistOpen: (open) => set({ isPlaylistOpen: open }),
}));
