import React, { useState, useEffect, useRef } from 'react';
import { VideoViewport } from './VideoViewport';
import { PlayerControls } from './PlayerControls';
import { PlayerOverlay } from './PlayerOverlay';
import { OsdOverlay } from './OsdOverlay';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const PlayerView: React.FC = () => {
  const { playbackState, isMiniPlayer } = usePlayerStore();
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    if (playbackState.isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden bg-black ${
        !controlsVisible && playbackState.isPlaying ? 'cursor-hidden' : ''
      } ${isMiniPlayer ? 'max-w-md max-h-72 rounded-2xl shadow-2xl border border-blue-500/50 fixed bottom-6 right-6 z-50' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <OsdOverlay />

      <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <PlayerOverlay />
      </div>

      <div className="flex-1 w-full h-full relative">
        <VideoViewport />
      </div>

      <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <PlayerControls />
      </div>
    </div>
  );
};
