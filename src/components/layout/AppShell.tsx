import React, { useState } from 'react';
import { VlcMenuBar } from './VlcMenuBar';
import { PlayerView } from '../player/PlayerView';
import { PlayerControls } from '../player/PlayerControls';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const AppShell: React.FC = () => {
  const { loadMedia } = usePlayerStore();
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const newItem = {
        id: `dropped-${Date.now()}`,
        title: file.name,
        path: file.name,
        size: file.size,
        duration: 0,
        lastPosition: 0,
        dateAdded: new Date().toISOString(),
        format: file.name.split('.').pop() || 'mp4',
        src: url,
      };
      await loadMedia(newItem, true);
    }
  };

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden bg-vlc-control-bg text-foreground"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <VlcMenuBar />
      
      {/* Video Viewport Area (Black background) */}
      <main className="flex flex-1 flex-col overflow-hidden relative bg-black border-t border-b border-border">
        <PlayerView />
      </main>

      {/* Classic VLC Controls at the bottom */}
      <PlayerControls />

      {isDragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 border-4 border-dashed border-primary pointer-events-none">
          <span className="text-white text-2xl font-bold bg-black/80 px-4 py-2 rounded">Drop Video to Play</span>
        </div>
      )}
    </div>
  );
};
