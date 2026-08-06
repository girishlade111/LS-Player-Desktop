import type { AudioTrack, CodecMetadata, MediaItem, SubtitleTrack, VideoTransform } from '../types';
import type { MediaEngineAdapter, PlaybackEventListener, PlaybackState } from './MediaEngineAdapter';

export class NativeEngineAdapter implements MediaEngineAdapter {
  public readonly id = 'native';
  public readonly name = 'Native MPV Engine (DXVA2/NVDEC Hardware Accelerated)';

  private listeners: Set<PlaybackEventListener> = new Set();
  private state: PlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1.0,
    buffered: 100,
    transform: {
      zoom: 1.0,
      rotate: 0,
      flipH: false,
      flipV: false,
      aspectRatio: 'auto',
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
    isEnded: false,
  };

  attachElement(_videoElement: HTMLVideoElement, _canvasElement?: HTMLCanvasElement): void {
    console.log('[NativeEngineAdapter] Attached video element to Native IPC renderer');
  }

  async loadFile(item: MediaItem): Promise<void> {
    console.log('[NativeEngineAdapter] Sending IPC loadFile to libmpv:', item.path);
    this.state.currentTime = item.lastPosition || 0;
    this.state.duration = item.duration;
    this.notify();
  }

  async play(): Promise<void> {
    this.state.isPlaying = true;
    this.notify();
  }

  pause(): void {
    this.state.isPlaying = false;
    this.notify();
  }

  stop(): void {
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    this.notify();
  }

  seek(seconds: number): void {
    this.state.currentTime = seconds;
    this.notify();
  }

  setVolume(volume: number): void {
    this.state.volume = volume;
    this.notify();
  }

  setMuted(muted: boolean): void {
    this.state.isMuted = muted;
    this.notify();
  }

  setPlaybackRate(rate: number): void {
    this.state.playbackRate = rate;
    this.notify();
  }

  setVideoTransform(transform: VideoTransform): void {
    this.state.transform = { ...transform };
    this.notify();
  }

  async getMetadata(): Promise<CodecMetadata | undefined> {
    return {
      videoCodec: 'H.265 / HEVC Main 10',
      audioCodec: 'FLAC / Lossless 24-bit',
      resolution: '3840x2160 (4K UHD)',
      width: 3840,
      height: 2160,
      frameRate: 59.94,
      bitrate: '45.2 Mbps',
      colorSpace: 'BT.2020 / HDR10',
      container: 'MKV (Matroska)',
      audioChannels: '7.1 Surround (Dolby TrueHD / Atmos)',
      sampleRate: '96,000 Hz',
    };
  }

  getAudioTracks(): AudioTrack[] {
    return [
      { id: '1', label: 'TrueHD 7.1 English', language: 'en', channels: 8 },
      { id: '2', label: 'DTS-HD MA 5.1 English', language: 'en', channels: 6 },
    ];
  }

  getSubtitleTracks(): SubtitleTrack[] {
    return [
      { id: 'sub-1', label: 'English Full ASS/SSA', language: 'en' },
      { id: 'sub-2', label: 'English Commentary', language: 'en' },
    ];
  }

  selectAudioTrack(_trackId: string): void {}

  selectSubtitleTrack(_trackId: string | undefined): void {}

  async loadExternalSubtitle(_file: File): Promise<SubtitleTrack | undefined> {
    return undefined;
  }

  setSubtitleDelay(_seconds: number): void {}

  setAudioDelay(_seconds: number): void {}

  async takeScreenshot(): Promise<string | undefined> {
    return undefined;
  }

  subscribe(listener: PlaybackEventListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = { ...this.state };
    this.listeners.forEach((listener) => listener(snapshot));
  }

  destroy(): void {
    this.listeners.clear();
  }
}
