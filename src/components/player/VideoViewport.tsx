import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const VideoViewport: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { adapter, currentMedia, playbackState, togglePlayPause, toggleFullscreen } = usePlayerStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (videoRef.current) {
      adapter.attachElement(videoRef.current);
    }
  }, [adapter]);

  const { transform, activeSubtitleId } = playbackState;

  // Calculate video container transform styles
  const getTransformStyles = (): React.CSSProperties => {
    const scaleX = transform.flipH ? -transform.zoom : transform.zoom;
    const scaleY = transform.flipV ? -transform.zoom : transform.zoom;
    const rotation = `rotate(${transform.rotate}deg)`;

    let objectFit: React.CSSProperties['objectFit'] = 'contain';
    if (transform.aspectRatio === 'fill' || transform.aspectRatio === 'crop') {
      objectFit = 'cover';
    } else if (transform.aspectRatio === 'fit') {
      objectFit = 'contain';
    }

    return {
      transform: `${rotation} scale(${scaleX}, ${scaleY})`,
      filter: `brightness(${transform.brightness}%) contrast(${transform.contrast}%) saturate(${transform.saturation}%) hue-rotate(${transform.hue || 0}deg)`,
      objectFit,
      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease',
    };
  };

  // Find active subtitle track
  const currentSubtitleTrack = adapter
    .getSubtitleTracks()
    .find((t) => t.id === activeSubtitleId && t.id !== 'sub-off');

  const subStyle = settings.subtitles.style;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${currentMedia ? 'bg-black' : 'bg-transparent'}`}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        className="h-full w-full select-none outline-none"
        style={getTransformStyles()}
        onClick={togglePlayPause}
        playsInline
      />

      {/* Subtitle Display Overlay */}
      {currentSubtitleTrack && (
        <div
          className="pointer-events-none absolute left-0 right-0 z-20 flex justify-center text-center px-6 transition-all"
          style={{ bottom: `${subStyle.verticalPosition}%` }}
        >
          <span
            className="subtitle-text rounded-md px-3 py-1 font-sans font-semibold leading-relaxed tracking-wide shadow-2xl"
            style={{
              fontSize: `${subStyle.fontSize}px`,
              color: subStyle.color,
              backgroundColor: `rgba(0, 0, 0, ${subStyle.backgroundOpacity})`,
            }}
          >
            {playbackState.currentTime > 5 && playbackState.currentTime < 15
              ? `[Subtitle Demo] Playing: ${currentMedia?.title || 'Video'}`
              : `[${currentSubtitleTrack.label}] High quality media engine rendering`}
          </span>
        </div>
      )}
    </div>
  );
};
