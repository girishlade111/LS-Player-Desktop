import { useEffect } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import { useUiStore } from '../stores/useUiStore';
import { useLibraryStore } from '../stores/useLibraryStore';

export const useKeyboardShortcuts = () => {
  const {
    togglePlayPause,
    toggleFullscreen,
    seekRelative,
    adjustVolume,
    toggleMute,
    playbackState,
    setSpeed,
    selectSubtitle,
    adapter,
  } = usePlayerStore();

  const { playNext, playPrevious } = usePlaylistStore();
  const { toggleCommandPalette, setShortcutsModalOpen, setFileInfoModalOpen, setCommandPaletteOpen } = useUiStore();
  const { scanDirectory, addMediaItem } = useLibraryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Global Command Palette shortcut: Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Ctrl + O: Open file
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*';
        input.onchange = (ev) => {
          const file = (ev.target as HTMLInputElement).files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            const newItem = {
              id: `file-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ''),
              path: file.name,
              size: file.size,
              duration: 300,
              lastPosition: 0,
              dateAdded: new Date().toISOString(),
              format: file.name.split('.').pop() || 'mp4',
              src: url,
            };
            addMediaItem(newItem);
            usePlayerStore.getState().loadMedia(newItem, true);
          }
        };
        input.click();
        return;
      }

      // Ctrl + Shift + O: Open folder scan
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        scanDirectory('C:\\Videos');
        return;
      }

      // F1: Help / Shortcuts
      if (e.key === 'F1') {
        e.preventDefault();
        setShortcutsModalOpen(true);
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlayPause();
          break;

        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;

        case 'Escape':
          e.preventDefault();
          usePlayerStore.getState().setFullscreen(false);
          setCommandPaletteOpen(false);
          setShortcutsModalOpen(false);
          setFileInfoModalOpen(false);
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (e.ctrlKey) seekRelative(30);
          else if (e.shiftKey) seekRelative(10);
          else seekRelative(5);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (e.ctrlKey) seekRelative(-30);
          else if (e.shiftKey) seekRelative(-10);
          else seekRelative(-5);
          break;

        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.05);
          break;

        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.05);
          break;

        case 'KeyJ':
          e.preventDefault();
          seekRelative(-10);
          break;

        case 'KeyL':
          e.preventDefault();
          seekRelative(10);
          break;

        case 'KeyN':
          e.preventDefault();
          playNext();
          break;

        case 'KeyP':
          e.preventDefault();
          playPrevious();
          break;

        case 'BracketLeft':
          e.preventDefault();
          setSpeed(Math.max(0.25, playbackState.playbackRate - 0.25));
          break;

        case 'BracketRight':
          e.preventDefault();
          setSpeed(Math.min(4.0, playbackState.playbackRate + 0.25));
          break;

        case 'KeyS':
          e.preventDefault();
          {
            const tracks = adapter.getSubtitleTracks();
            if (tracks.length > 0) {
              const currentId = playbackState.activeSubtitleId;
              const currentIdx = tracks.findIndex((t) => t.id === currentId);
              const nextIdx = (currentIdx + 1) % tracks.length;
              selectSubtitle(tracks[nextIdx].id);
            }
          }
          break;

        case 'KeyI':
          e.preventDefault();
          setFileInfoModalOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlayPause,
    toggleFullscreen,
    seekRelative,
    adjustVolume,
    toggleMute,
    playbackState,
    setSpeed,
    selectSubtitle,
    adapter,
    playNext,
    playPrevious,
    toggleCommandPalette,
    setShortcutsModalOpen,
    setFileInfoModalOpen,
    setCommandPaletteOpen,
    scanDirectory,
    addMediaItem,
  ]);
};
