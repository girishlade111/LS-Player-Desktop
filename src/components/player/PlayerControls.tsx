import React, { useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  ListVideo,
  Repeat,
  Shuffle
} from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { usePlaylistStore } from '../../stores/usePlaylistStore';
import { formatTime } from '../../utils/formatters';

export const PlayerControls: React.FC = () => {
  const {
    playbackState,
    stop,
    togglePlayPause,
    seek,
    setVolume,
    isFullscreen,
    toggleFullscreen,
  } = usePlayerStore();

  const { playNext, playPrevious, toggleOpen: togglePlaylist } = usePlaylistStore();

  const seekbarRef = useRef<HTMLDivElement | null>(null);

  const { isPlaying, currentTime, duration, volume } = playbackState;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekbarRef.current || duration <= 0) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const targetSeconds = (pos / rect.width) * duration;
    seek(targetSeconds);
  };

  const buttonClass = "flex h-7 w-7 items-center justify-center rounded border border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-200 active:bg-slate-300 transition-colors";

  return (
    <div className="flex flex-col bg-vlc-control-bg pt-1 pb-2 px-2 border-t border-slate-300 z-30 shrink-0">
      
      {/* Top: Classic Thin Seek Bar */}
      <div 
        ref={seekbarRef}
        className="relative h-2 w-full cursor-pointer bg-slate-300 border border-slate-400 mb-2 mt-1 shadow-inner group"
        onClick={handleSeekClick}
      >
        <div
          className="absolute h-full bg-primary"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-slate-600 shadow"
          style={{ left: `calc(${progressPercent}% - 4px)` }}
        />
      </div>

      <div className="flex items-center justify-between px-1">
        {/* Left Side Controls */}
        <div className="flex items-center gap-1">
          <button onClick={togglePlayPause} className={buttonClass} title="Play/Pause">
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          
          <button onClick={playPrevious} className={buttonClass} title="Previous">
            <SkipBack size={14} fill="currentColor" />
          </button>
          
          <button onClick={stop} className={buttonClass} title="Stop">
            <Square size={14} fill="currentColor" />
          </button>
          
          <button onClick={playNext} className={buttonClass} title="Next">
            <SkipForward size={14} fill="currentColor" />
          </button>

          <button onClick={toggleFullscreen} className={`${buttonClass} ml-2`} title="Fullscreen">
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Center: Timestamp */}
        <div className="text-[12px] text-black font-sans font-medium px-4">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          <button onClick={togglePlaylist} className={buttonClass} title="Toggle Playlist">
            <ListVideo size={16} />
          </button>
          
          <button className={buttonClass} title="Loop">
            <Repeat size={14} />
          </button>
          
          <button className={buttonClass} title="Shuffle">
            <Shuffle size={14} />
          </button>

          {/* VLC Volume Widget */}
          <div className="flex items-center gap-1 ml-2 mr-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 cursor-pointer accent-primary bg-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
