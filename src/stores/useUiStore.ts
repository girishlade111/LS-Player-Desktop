import { create } from 'zustand';
import type { NavigationTab } from '../types';

interface UiStore {
  activeTab: NavigationTab;
  isSplashActive: boolean;
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isShortcutsModalOpen: boolean;
  isFileInfoModalOpen: boolean;
  isDraggingFile: boolean;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setSplashActive: (active: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setFileInfoModalOpen: (open: boolean) => void;
  setDraggingFile: (dragging: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeTab: 'home',
  isSplashActive: true,
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isShortcutsModalOpen: false,
  isFileInfoModalOpen: false,
  isDraggingFile: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSplashActive: (active) => set({ isSplashActive: active }),

  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  setShortcutsModalOpen: (open) => set({ isShortcutsModalOpen: open }),

  setFileInfoModalOpen: (open) => set({ isFileInfoModalOpen: open }),

  setDraggingFile: (dragging) => set({ isDraggingFile: dragging }),
}));
