import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  ListVideo,
  Camera,
  RotateCw,
  Subtitles,
  Gauge,
  Sliders,
  StepForward,
  StepBack,
} from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { usePlaylistStore } from '../../stores/usePlaylistStore';
import { formatTime } from '../../utils/formatters';
import type { AspectRatio } from '../../types';

export const PlayerControls: React.FC = () => {
  const {
    playbackState,
    stop,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setSpeed,
    setAspectRatio,
    rotate90,
    toggleFlipH,
    takeScreenshot,
    isFullscreen,
    toggleFullscreen,
    adapter,
    selectSubtitle,
    loadExternalSubtitle,
  } = usePlayerStore();

  const { playNext, playPrevious, toggleOpen: togglePlaylist } = usePlaylistStore();

  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverPositionPx, setHoverPositionPx] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showTransformMenu, setShowTransformMenu] = useState(false);

  const seekbarRef = useRef<HTMLDivElement | null>(null);

  const { isPlaying, currentTime, duration, volume, isMuted, playbackRate, buffered, transform } =
    playbackState;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekbarRef.current || duration <= 0) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const targetSeconds = (pos / rect.width) * duration;
    setHoverPositionPx(pos);
    setHoverSeekTime(targetSeconds);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekbarRef.current || duration <= 0) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const targetSeconds = (pos / rect.width) * duration;
    seek(targetSeconds);
  };

  const handleWheelVolume = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setVolume(Math.max(0, Math.min(1, volume + delta)));
  };

  const handleExternalSubClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.srt,.vtt,.ass,.ssa';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        loadExternalSubtitle(file);
      }
    };
    input.click();
  };

  const handleDownloadScreenshot = async () => {
    const dataUrl = await takeScreenshot();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `LSPlayer_Snapshot_${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div
      className="glass-panel absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2.5 rounded-2xl p-3 shadow-2xl transition-all duration-300 border border-slate-700/50"
      onWheel={handleWheelVolume}
    >
      {/* 1. Seek Bar & Hover Timestamp Tooltip */}
      <div className="relative flex flex-col gap-1">
        <div
          ref={seekbarRef}
          className="group relative h-2.5 w-full cursor-pointer rounded-full bg-slate-800/80 transition-all hover:h-4"
          onMouseMove={handleSeekMouseMove}
          onMouseLeave={() => setHoverSeekTime(null)}
          onClick={handleSeekClick}
        >
          {/* Buffered Ranges Bar */}
          <div
            className="absolute h-full rounded-full bg-slate-700/60 transition-all"
            style={{ width: `${buffered}%` }}
          />

          {/* Played Progress Bar */}
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Seek Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white shadow-lg shadow-blue-500/50 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-100 border border-slate-700 shadow-lg"
              style={{ left: `${hoverPositionPx}px` }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Timestamp Row */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 2. Main Control Action Buttons Bar */}
      <div className="flex items-center justify-between">
        {/* Left Group: Playback Controls */}
        <div className="flex items-center gap-1.5">
          {/* Previous Track */}
          <button
            onClick={playPrevious}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:scale-95"
            title="Previous item (P)"
          >
            <SkipBack size={18} />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={togglePlayPause}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>

          {/* Stop */}
          <button
            onClick={stop}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:scale-95"
            title="Stop Playback"
          >
            <Square size={16} />
          </button>

          {/* Next Track */}
          <button
            onClick={playNext}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white active:scale-95"
            title="Next item (N)"
          >
            <SkipForward size={18} />
          </button>

          {/* Frame Step Backward */}
          <button
            onClick={() => seek(Math.max(0, currentTime - 0.04))}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:flex"
            title="Frame step backward"
          >
            <StepBack size={15} />
          </button>

          {/* Frame Step Forward */}
          <button
            onClick={() => seek(Math.min(duration, currentTime + 0.04))}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:flex"
            title="Frame step forward"
          >
            <StepForward size={15} />
          </button>

          {/* Volume Control Group */}
          <div className="ml-2 flex items-center gap-2 border-l border-slate-800 pl-3">
            <button
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Mute / Unmute (M)"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} className="text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1.5 w-20 cursor-pointer accent-blue-500 bg-slate-800 rounded-lg outline-none"
              title="Volume level"
            />
            <span className="w-8 text-[11px] font-mono text-slate-400">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Right Group: Subtitles, Audio, Transforms, Screenshot, Speed, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Subtitles Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSubMenu(!showSubMenu);
                setShowSpeedMenu(false);
                setShowTransformMenu(false);
              }}
              className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all ${
                showSubMenu ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Subtitles & Audio (S)"
            >
              <Subtitles size={16} />
              <span className="hidden sm:inline">Subtitles</span>
            </button>

            {/* Subtitle Popup Menu */}
            {showSubMenu && (
              <div className="glass-panel absolute bottom-12 right-0 z-40 flex w-56 flex-col gap-1 rounded-xl p-2 shadow-2xl border border-slate-700">
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Subtitle Track
                </div>
                {adapter.getSubtitleTracks().map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      selectSubtitle(track.id);
                      setShowSubMenu(false);
                    }}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      playbackState.activeSubtitleId === track.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{track.label}</span>
                    <span className="text-[10px] opacity-60 uppercase">{track.language}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={handleExternalSubClick}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-slate-800"
                >
                  <Subtitles size={14} />
                  <span>Load External SRT/VTT</span>
                </button>
              </div>
            )}
          </div>

          {/* Speed Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowSubMenu(false);
                setShowTransformMenu(false);
              }}
              className={`flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold transition-all ${
                showSpeedMenu ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Playback Speed ([ or ])"
            >
              <Gauge size={16} />
              <span>{playbackRate}x</span>
            </button>

            {/* Speed Options */}
            {showSpeedMenu && (
              <div className="glass-panel absolute bottom-12 right-0 z-40 flex w-36 flex-col gap-1 rounded-xl p-2 shadow-2xl border border-slate-700">
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Playback Speed
                </div>
                {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setSpeed(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold text-left ${
                      playbackRate === rate ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {rate}x {rate === 1.0 && '(Normal)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Transforms Quick Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTransformMenu(!showTransformMenu);
                setShowSpeedMenu(false);
                setShowSubMenu(false);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 ${
                showTransformMenu ? 'bg-blue-600 text-white' : ''
              }`}
              title="Video Transformations (Rotate/Aspect Ratio)"
            >
              <Sliders size={17} />
            </button>

            {showTransformMenu && (
              <div className="glass-panel absolute bottom-12 right-0 z-40 flex w-52 flex-col gap-1.5 rounded-xl p-2.5 shadow-2xl border border-slate-700 text-xs">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase">
                  Aspect Ratio
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['auto', '16:9', '4:3', 'fit', 'fill', 'crop'] as AspectRatio[]).map((aspect) => (
                    <button
                      key={aspect}
                      onClick={() => setAspectRatio(aspect)}
                      className={`rounded p-1 font-semibold capitalize ${
                        transform.aspectRatio === aspect
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>

                <div className="my-1 border-t border-slate-800" />
                <div className="flex gap-1">
                  <button
                    onClick={rotate90}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"
                  >
                    <RotateCw size={13} />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    onClick={toggleFlipH}
                    className={`flex flex-1 items-center justify-center rounded p-1.5 ${
                      transform.flipH ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Flip H
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Screenshot Capture */}
          <button
            onClick={handleDownloadScreenshot}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            title="Take High-Res Screenshot"
          >
            <Camera size={17} />
          </button>

          {/* Playlist Drawer Toggle */}
          <button
            onClick={togglePlaylist}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            title="Toggle Playlist Queue"
          >
            <ListVideo size={18} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
