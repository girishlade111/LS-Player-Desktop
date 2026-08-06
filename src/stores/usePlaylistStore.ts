import { create } from 'zustand';
import type { MediaItem, Playlist, RepeatMode } from '../types';
import { SAMPLE_VIDEOS } from '../utils/sampleData';

interface PlaylistStore {
  currentPlaylist: Playlist;
  currentIndex: number;
  isOpen: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;

  // Actions
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addItem: (item: MediaItem) => void;
  addItems: (items: MediaItem[]) => void;
  removeItem: (index: number) => void;
  clearPlaylist: () => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  setCurrentIndex: (index: number) => void;
  playNext: () => MediaItem | null;
  playPrevious: () => MediaItem | null;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleRepeatMode: () => void;
  toggleShuffle: () => void;
  exportM3U: () => string;
}

const DEFAULT_PLAYLIST: Playlist = {
  id: 'pl-default',
  title: 'Now Playing Queue',
  dateCreated: new Date().toISOString(),
  items: SAMPLE_VIDEOS.slice(0, 4),
};

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  currentPlaylist: DEFAULT_PLAYLIST,
  currentIndex: 0,
  isOpen: false,
  repeatMode: 'off',
  isShuffle: false,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),

  addItem: (item) =>
    set((state) => ({
      currentPlaylist: {
        ...state.currentPlaylist,
        items: [...state.currentPlaylist.items, item],
      },
    })),

  addItems: (items) =>
    set((state) => ({
      currentPlaylist: {
        ...state.currentPlaylist,
        items: [...state.currentPlaylist.items, ...items],
      },
    })),

  removeItem: (index) =>
    set((state) => {
      const items = [...state.currentPlaylist.items];
      items.splice(index, 1);
      let newIdx = state.currentIndex;
      if (index <= state.currentIndex && state.currentIndex > 0) {
        newIdx = state.currentIndex - 1;
      }
      return {
        currentPlaylist: { ...state.currentPlaylist, items },
        currentIndex: Math.min(newIdx, Math.max(0, items.length - 1)),
      };
    }),

  clearPlaylist: () =>
    set((state) => ({
      currentPlaylist: { ...state.currentPlaylist, items: [] },
      currentIndex: 0,
    })),

  reorderItems: (fromIndex, toIndex) =>
    set((state) => {
      const items = [...state.currentPlaylist.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        currentPlaylist: { ...state.currentPlaylist, items },
      };
    }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  playNext: () => {
    const { currentPlaylist, currentIndex, repeatMode, isShuffle } = get();
    const len = currentPlaylist.items.length;
    if (len === 0) return null;

    if (repeatMode === 'one') {
      return currentPlaylist.items[currentIndex] || null;
    }

    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * len);
      set({ currentIndex: randomIdx });
      return currentPlaylist.items[randomIdx];
    }

    if (currentIndex < len - 1) {
      const nextIdx = currentIndex + 1;
      set({ currentIndex: nextIdx });
      return currentPlaylist.items[nextIdx];
    } else if (repeatMode === 'all') {
      set({ currentIndex: 0 });
      return currentPlaylist.items[0];
    }

    return null;
  },

  playPrevious: () => {
    const { currentPlaylist, currentIndex, repeatMode } = get();
    const len = currentPlaylist.items.length;
    if (len === 0) return null;

    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      set({ currentIndex: prevIdx });
      return currentPlaylist.items[prevIdx];
    } else if (repeatMode === 'all') {
      const lastIdx = len - 1;
      set({ currentIndex: lastIdx });
      return currentPlaylist.items[lastIdx];
    }

    return currentPlaylist.items[0] || null;
  },

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleRepeatMode: () =>
    set((state) => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const nextIdx = (modes.indexOf(state.repeatMode) + 1) % modes.length;
      return { repeatMode: modes[nextIdx] };
    }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  exportM3U: () => {
    const { currentPlaylist } = get();
    let content = '#EXTM3U\n#PLAYLIST:' + currentPlaylist.title + '\n\n';
    currentPlaylist.items.forEach((item) => {
      content += `#EXTINF:${Math.round(item.duration)},${item.title}\n${item.path}\n\n`;
    });
    return content;
  },
}));
