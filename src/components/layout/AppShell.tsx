import React, { useState } from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { SplashScreen } from '../splash/SplashScreen';
import { LibraryView } from '../library/LibraryView';
import { PlayerView } from '../player/PlayerView';
import { SettingsView } from '../settings/SettingsView';
import { PlaylistDrawer } from '../playlist/PlaylistDrawer';
import { CommandPalette } from '../dialogs/CommandPalette';
import { FileInfoModal } from '../dialogs/FileInfoModal';
import { ShortcutsModal } from '../dialogs/ShortcutsModal';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { UploadCloud } from 'lucide-react';

export const AppShell: React.FC = () => {
  useKeyboardShortcuts();

  const { activeTab } = useUiStore();
  const { currentMedia, isFullscreen, loadMedia } = usePlayerStore();
  const { addMediaItem } = useLibraryStore();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const newItem = {
        id: `dropped-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        path: file.name,
        size: file.size,
        duration: 360,
        lastPosition: 0,
        dateAdded: new Date().toISOString(),
        format: file.name.split('.').pop() || 'mp4',
        src: url,
        metadata: {
          videoCodec: 'H.264 / AVC',
          audioCodec: 'AAC',
          resolution: '1920x1080',
          width: 1920,
          height: 1080,
          frameRate: 30,
          bitrate: '14 Mbps',
          container: file.name.split('.').pop()?.toUpperCase() || 'MP4',
          audioChannels: 'Stereo',
          sampleRate: '48,000 Hz',
        },
      };
      addMediaItem(newItem);
      loadMedia(newItem, true);
    }
  };

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#080c14] select-none text-slate-100 font-sans"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <SplashScreen />

      {!isFullscreen && <TitleBar />}

      <div className="flex flex-1 overflow-hidden relative">
        {!isFullscreen && <Sidebar />}

        <main className="flex flex-1 overflow-hidden relative">
          {activeTab === 'home' || activeTab === 'library' || activeTab === 'recent' ? (
            currentMedia ? (
              <PlayerView />
            ) : (
              <LibraryView />
            )
          ) : activeTab === 'playlists' ? (
            <LibraryView />
          ) : activeTab === 'settings' ? (
            <SettingsView />
          ) : (
            <LibraryView />
          )}

          <PlaylistDrawer />
        </main>
      </div>

      {/* Drag & Drop Global Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-950/80 backdrop-blur-md border-4 border-dashed border-cyan-400 text-white">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600 shadow-2xl shadow-cyan-400/40 animate-bounce">
            <UploadCloud size={48} />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Drop Media File to Play</h2>
          <p className="mt-1 text-xs text-cyan-200">Supports MP4, MKV, AVI, MOV, WebM and subtitle files.</p>
        </div>
      )}

      {/* Global Modals */}
      <CommandPalette />
      <FileInfoModal />
      <ShortcutsModal />
    </div>
  );
};
