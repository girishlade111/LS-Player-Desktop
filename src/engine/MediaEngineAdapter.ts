import type { AudioTrack, CodecMetadata, EqualizerState, LoopState, MediaItem, SubtitleTrack, VideoTransform } from '../types';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0..1
  isMuted: boolean;
  playbackRate: number;
  buffered: number; // percentage 0..100
  transform: VideoTransform;
  activeSubtitleId?: string;
  activeAudioTrackId?: string;
  isEnded: boolean;
  equalizer: EqualizerState;
  loopState: LoopState;
}

export type PlaybackEventListener = (state: PlaybackState) => void;

export interface MediaEngineAdapter {
  id: 'html5' | 'native';
  name: string;

  // Core controls
  attachElement(videoElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement): void;
  loadFile(item: MediaItem): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  setPlaybackRate(rate: number): void;

  // Advanced features
  setVideoTransform(transform: VideoTransform): void;
  getMetadata(): Promise<CodecMetadata | undefined>;
  getAudioTracks(): AudioTrack[];
  getSubtitleTracks(): SubtitleTrack[];
  selectAudioTrack(trackId: string): void;
  selectSubtitleTrack(trackId: string | undefined): void;
  loadExternalSubtitle(file: File): Promise<SubtitleTrack | undefined>;
  setSubtitleDelay(seconds: number): void;
  setAudioDelay(seconds: number): void;
  takeScreenshot(): Promise<string | undefined>;
  setEqualizer(eq: EqualizerState): void;
  setLoop(loop: LoopState): void;
  frameStep(): void;

  // State updates & Cleanup
  subscribe(listener: PlaybackEventListener): () => void;
  destroy(): void;
}
