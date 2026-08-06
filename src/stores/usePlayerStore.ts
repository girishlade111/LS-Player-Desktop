import { create } from 'zustand';
import { Html5VideoAdapter } from '../engine/Html5VideoAdapter';
import type { MediaEngineAdapter, PlaybackState } from '../engine/MediaEngineAdapter';
import type { AspectRatio, MediaItem, OsdMessage, SubtitleTrack, VideoTransform } from '../types';

interface PlayerStore {
  adapter: MediaEngineAdapter;
  currentMedia: MediaItem | null;
  playbackState: PlaybackState;
  osdMessage: OsdMessage | null;
  isFullscreen: boolean;
  isMiniPlayer: boolean;

  // Actions
  setAdapter: (adapter: MediaEngineAdapter) => void;
  loadMedia: (item: MediaItem, autoPlay?: boolean) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolume: (volume: number) => void;
  adjustVolume: (delta: number) => void;
  toggleMute: () => void;
  setSpeed: (rate: number) => void;

  // Transform actions
  setAspectRatio: (aspect: AspectRatio) => void;
  rotate90: () => void;
  toggleFlipH: () => void;
  toggleFlipV: () => void;
  setZoom: (zoom: number) => void;
  setVideoEffect: (effect: 'brightness' | 'contrast' | 'saturation' | 'hue', value: number) => void;
  resetTransforms: () => void;
  
  // Equalizer actions
  toggleEqualizer: () => void;
  setEqualizerPreamp: (value: number) => void;
  setEqualizerBand: (index: number, value: number) => void;
  
  // Loop A-B & Frame step
  setLoopA: () => void;
  setLoopB: () => void;
  clearLoop: () => void;
  frameStep: () => void;

  // Track selectors
  selectSubtitle: (trackId: string | undefined) => void;
  selectAudioTrack: (trackId: string) => void;
  loadExternalSubtitle: (file: File) => Promise<SubtitleTrack | undefined>;

  // Display toggles
  setFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;
  setMiniPlayer: (mini: boolean) => void;
  toggleMiniPlayer: () => void;

  // OSD helper
  showOsd: (text: string, icon?: string) => void;

  // Screenshot helper
  takeScreenshot: () => Promise<string | undefined>;

  // Internal listener update
  updatePlaybackState: (state: PlaybackState) => void;
}

const DEFAULT_TRANSFORM: VideoTransform = {
  zoom: 1.0,
  rotate: 0,
  flipH: false,
  flipV: false,
  aspectRatio: 'auto',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
};

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const defaultAdapter = new Html5VideoAdapter();

  defaultAdapter.subscribe((state) => {
    set({ playbackState: state });
  });

  return {
    adapter: defaultAdapter,
    currentMedia: null,
    playbackState: {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      playbackRate: 1.0,
      buffered: 0,
      transform: DEFAULT_TRANSFORM,
      equalizer: {
        enabled: false,
        preamp: 0,
        bands: Array(10).fill(0),
      },
      loopState: {
        a: null,
        b: null,
      },
      isEnded: false,
    },
    osdMessage: null,
    isFullscreen: false,
    isMiniPlayer: false,

    setAdapter: (newAdapter) => {
      get().adapter.destroy();
      newAdapter.subscribe((state) => {
        get().updatePlaybackState(state);
      });
      set({ adapter: newAdapter });
    },

    loadMedia: async (item, autoPlay = true) => {
      set({ currentMedia: item });
      await get().adapter.loadFile(item);
      if (autoPlay) {
        await get().adapter.play();
      }
      get().showOsd(`Opened: ${item.title}`);
    },

    play: () => {
      get().adapter.play();
      get().showOsd('Play', 'play');
    },

    pause: () => {
      get().adapter.pause();
      get().showOsd('Pause', 'pause');
    },

    togglePlayPause: () => {
      const { isPlaying } = get().playbackState;
      if (isPlaying) {
        get().pause();
      } else {
        get().play();
      }
    },

    stop: () => {
      get().adapter.stop();
      get().showOsd('Stopped', 'square');
    },

    seek: (seconds) => {
      get().adapter.seek(seconds);
    },

    seekRelative: (deltaSeconds) => {
      const { currentTime, duration } = get().playbackState;
      const target = Math.max(0, Math.min(duration, currentTime + deltaSeconds));
      get().adapter.seek(target);
      const sign = deltaSeconds > 0 ? '+' : '';
      get().showOsd(`Seek ${sign}${deltaSeconds}s`);
    },

    setVolume: (volume) => {
      get().adapter.setVolume(volume);
      get().showOsd(`Volume: ${Math.round(volume * 100)}%`);
    },

    adjustVolume: (delta) => {
      const { volume } = get().playbackState;
      const target = Math.max(0, Math.min(1, volume + delta));
      get().setVolume(target);
    },

    toggleMute: () => {
      const { isMuted } = get().playbackState;
      get().adapter.setMuted(!isMuted);
      get().showOsd(!isMuted ? 'Muted' : 'Unmuted');
    },

    setSpeed: (rate) => {
      get().adapter.setPlaybackRate(rate);
      get().showOsd(`Speed: ${rate}x`);
    },

    setAspectRatio: (aspect) => {
      const currentT = get().playbackState.transform;
      const updated = { ...currentT, aspectRatio: aspect };
      get().adapter.setVideoTransform(updated);
      get().showOsd(`Aspect Ratio: ${aspect.toUpperCase()}`);
    },

    rotate90: () => {
      const currentT = get().playbackState.transform;
      const nextRot = (currentT.rotate + 90) % 360;
      const updated = { ...currentT, rotate: nextRot };
      get().adapter.setVideoTransform(updated);
      get().showOsd(`Rotated: ${nextRot}°`);
    },

    toggleFlipH: () => {
      const currentT = get().playbackState.transform;
      const updated = { ...currentT, flipH: !currentT.flipH };
      get().adapter.setVideoTransform(updated);
      get().showOsd(updated.flipH ? 'Flipped Horizontal' : 'Normal Horizontal');
    },

    toggleFlipV: () => {
      const currentT = get().playbackState.transform;
      const updated = { ...currentT, flipV: !currentT.flipV };
      get().adapter.setVideoTransform(updated);
      get().showOsd(updated.flipV ? 'Flipped Vertical' : 'Normal Vertical');
    },

    setZoom: (zoom) => {
      const currentT = get().playbackState.transform;
      const updated = { ...currentT, zoom: Math.max(0.5, Math.min(3.0, zoom)) };
      get().adapter.setVideoTransform(updated);
      get().showOsd(`Zoom: ${Math.round(updated.zoom * 100)}%`);
    },

    setVideoEffect: (effect, value) => {
      const currentT = get().playbackState.transform;
      const updated = { ...currentT, [effect]: value };
      get().adapter.setVideoTransform(updated);
    },

    resetTransforms: () => {
      get().adapter.setVideoTransform(DEFAULT_TRANSFORM);
      get().showOsd('Reset Video Transforms');
    },

    toggleEqualizer: () => {
      const { equalizer } = get().playbackState;
      get().adapter.setEqualizer({ ...equalizer, enabled: !equalizer.enabled });
    },

    setEqualizerPreamp: (value) => {
      const { equalizer } = get().playbackState;
      get().adapter.setEqualizer({ ...equalizer, preamp: value });
    },

    setEqualizerBand: (index, value) => {
      const { equalizer } = get().playbackState;
      const newBands = [...equalizer.bands];
      newBands[index] = value;
      get().adapter.setEqualizer({ ...equalizer, bands: newBands });
    },

    setLoopA: () => {
      const { currentTime } = get().playbackState;
      const { loopState } = get().playbackState;
      get().adapter.setLoop({ ...loopState, a: currentTime });
      get().showOsd('Loop A Set');
    },

    setLoopB: () => {
      const { currentTime } = get().playbackState;
      const { loopState } = get().playbackState;
      if (loopState.a !== null && currentTime > loopState.a) {
        get().adapter.setLoop({ ...loopState, b: currentTime });
        get().showOsd('Loop B Set');
      }
    },

    clearLoop: () => {
      get().adapter.setLoop({ a: null, b: null });
      get().showOsd('Loop Cleared');
    },

    frameStep: () => {
      get().adapter.frameStep();
    },

    selectSubtitle: (trackId) => {
      get().adapter.selectSubtitleTrack(trackId);
      const track = get().adapter.getSubtitleTracks().find((t) => t.id === trackId);
      get().showOsd(`Subtitle: ${track ? track.label : 'Off'}`);
    },

    selectAudioTrack: (trackId) => {
      get().adapter.selectAudioTrack(trackId);
      const track = get().adapter.getAudioTracks().find((t) => t.id === trackId);
      get().showOsd(`Audio Track: ${track ? track.label : 'Default'}`);
    },

    loadExternalSubtitle: async (file) => {
      const track = await get().adapter.loadExternalSubtitle(file);
      if (track) {
        get().showOsd(`Loaded Subtitle: ${file.name}`);
      }
      return track;
    },

    setFullscreen: (fullscreen) => {
      set({ isFullscreen: fullscreen });
      get().showOsd(fullscreen ? 'Fullscreen Mode' : 'Windowed Mode');
    },

    toggleFullscreen: () => {
      get().setFullscreen(!get().isFullscreen);
    },

    setMiniPlayer: (mini) => {
      set({ isMiniPlayer: mini });
      get().showOsd(mini ? 'Mini Player Mode' : 'Standard Player');
    },

    toggleMiniPlayer: () => {
      get().setMiniPlayer(!get().isMiniPlayer);
    },

    showOsd: (text, icon) => {
      const osd: OsdMessage = {
        id: `osd-${Date.now()}`,
        text,
        icon,
        timestamp: Date.now(),
      };
      set({ osdMessage: osd });
    },

    takeScreenshot: async () => {
      const dataUrl = await get().adapter.takeScreenshot();
      if (dataUrl) {
        get().showOsd('Screenshot Captured!');
      }
      return dataUrl;
    },

    updatePlaybackState: (state) => {
      set({ playbackState: state });
    },
  };
});
