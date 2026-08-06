import { create } from 'zustand';
import type { DisplayMode, MediaItem } from '../types';
import { SAMPLE_VIDEOS } from '../utils/sampleData';

interface LibraryStore {
  items: MediaItem[];
  recentItems: MediaItem[];
  favorites: MediaItem[];
  displayMode: DisplayMode;
  searchQuery: string;
  activeFilter: 'all' | 'recent' | 'favorites' | 'videos' | 'audio';
  isScanning: boolean;

  // Actions
  setDisplayMode: (mode: DisplayMode) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'all' | 'recent' | 'favorites' | 'videos' | 'audio') => void;
  addMediaItem: (item: MediaItem) => void;
  toggleFavorite: (id: string) => void;
  removeMediaItem: (id: string) => void;
  updateLastPosition: (id: string, position: number) => void;
  scanDirectory: (path: string) => Promise<void>;
}

const STORAGE_KEY = 'ls_player_library_v1';

const loadSavedLibrary = (): MediaItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load library cache:', e);
  }
  return SAMPLE_VIDEOS;
};

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  items: loadSavedLibrary(),
  recentItems: loadSavedLibrary().filter((i) => i.lastPlayed),
  favorites: loadSavedLibrary().filter((i) => i.isFavorite),
  displayMode: 'grid',
  searchQuery: '',
  activeFilter: 'all',
  isScanning: false,

  setDisplayMode: (mode) => set({ displayMode: mode }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  addMediaItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id || i.path === item.path);
      if (exists) return state;

      const updated = [item, ...state.items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        items: updated,
        recentItems: updated.filter((i) => i.lastPlayed),
        favorites: updated.filter((i) => i.isFavorite),
      };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        items: updated,
        favorites: updated.filter((i) => i.isFavorite),
      };
    }),

  removeMediaItem: (id) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        items: updated,
        recentItems: updated.filter((i) => i.lastPlayed),
        favorites: updated.filter((i) => i.isFavorite),
      };
    }),

  updateLastPosition: (id, position) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.items.map((item) =>
        item.id === id
          ? { ...item, lastPosition: position, lastPlayed: now }
          : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        items: updated,
        recentItems: updated.filter((i) => i.lastPlayed),
      };
    }),

  scanDirectory: async (folderPath) => {
    set({ isScanning: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newScannedItem: MediaItem = {
      id: `scanned-${Date.now()}`,
      title: `Scanned Video ${get().items.length + 1} (${folderPath.split('\\').pop()})`,
      path: `${folderPath}\\Local_Video_${Date.now()}.mp4`,
      size: 1450000000,
      duration: 480,
      lastPosition: 0,
      dateAdded: new Date().toISOString(),
      format: 'mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      metadata: {
        videoCodec: 'H.264 / AVC',
        audioCodec: 'AAC-LC',
        resolution: '1920x1080',
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: '10.5 Mbps',
        container: 'MP4',
        audioChannels: 'Stereo (2.0)',
        sampleRate: '48,000 Hz',
      },
    };

    get().addMediaItem(newScannedItem);
    set({ isScanning: false });
  },
}));
