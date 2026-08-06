import type { AudioTrack, CodecMetadata, EqualizerState, LoopState, MediaItem, SubtitleTrack, VideoTransform } from '../types';
import type { MediaEngineAdapter, PlaybackEventListener, PlaybackState } from './MediaEngineAdapter';

export class Html5VideoAdapter implements MediaEngineAdapter {
  public readonly id = 'html5';
  public readonly name = 'HTML5 High Performance Engine';

  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;
  private listeners: Set<PlaybackEventListener> = new Set();
  private currentItem: MediaItem | null = null;

  // Web Audio API properties
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private preampNode: GainNode | null = null;
  private eqBands: BiquadFilterNode[] = [];

  private state: PlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1.0,
    buffered: 0,
    transform: {
      zoom: 1.0,
      rotate: 0,
      flipH: false,
      flipV: false,
      aspectRatio: 'auto',
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
    },
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
  };

  private subtitleDelay = 0;
  private audioDelay = 0;

  attachElement(videoElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement): void {
    this.removeEventListeners();
    this.videoEl = videoElement;
    if (canvasElement) this.canvasEl = canvasElement;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.videoEl) return;

    this.videoEl.addEventListener('timeupdate', this.onTimeUpdate);
    this.videoEl.addEventListener('durationchange', this.onDurationChange);
    this.videoEl.addEventListener('play', this.onPlay);
    this.videoEl.addEventListener('pause', this.onPause);
    this.videoEl.addEventListener('volumechange', this.onVolumeChange);
    this.videoEl.addEventListener('progress', this.onProgress);
    this.videoEl.addEventListener('ended', this.onEnded);
  }

  private removeEventListeners(): void {
    if (!this.videoEl) return;

    this.videoEl.removeEventListener('timeupdate', this.onTimeUpdate);
    this.videoEl.removeEventListener('durationchange', this.onDurationChange);
    this.videoEl.removeEventListener('play', this.onPlay);
    this.videoEl.removeEventListener('pause', this.onPause);
    this.videoEl.removeEventListener('volumechange', this.onVolumeChange);
    this.videoEl.removeEventListener('progress', this.onProgress);
    this.videoEl.removeEventListener('ended', this.onEnded);
  }

  private onTimeUpdate = () => {
    if (!this.videoEl) return;
    this.state.currentTime = this.videoEl.currentTime;

    // Loop A-B logic
    const { loopState } = this.state;
    if (loopState.a !== null && loopState.b !== null && this.videoEl.currentTime >= loopState.b) {
      this.videoEl.currentTime = loopState.a;
      this.state.currentTime = loopState.a;
    }

    this.notify();
  };

  private onDurationChange = () => {
    if (!this.videoEl) return;
    this.state.duration = this.videoEl.duration || 0;
    this.notify();
  };

  private onPlay = () => {
    this.state.isPlaying = true;
    this.state.isEnded = false;
    this.setupAudioContext(); // Initialize context on first play to avoid browser autoplay restrictions
    this.notify();
  };

  private onPause = () => {
    this.state.isPlaying = false;
    this.notify();
  };

  private onVolumeChange = () => {
    if (!this.videoEl) return;
    this.state.volume = this.videoEl.volume;
    this.state.isMuted = this.videoEl.muted;
    this.notify();
  };

  private onProgress = () => {
    if (!this.videoEl || !this.videoEl.buffered.length) return;
    const duration = this.videoEl.duration;
    if (duration > 0) {
      const bufferedEnd = this.videoEl.buffered.end(this.videoEl.buffered.length - 1);
      this.state.buffered = Math.min(100, (bufferedEnd / duration) * 100);
      this.notify();
    }
  };

  private onEnded = () => {
    this.state.isPlaying = false;
    this.state.isEnded = true;
    this.notify();
  };

  async loadFile(item: MediaItem): Promise<void> {
    this.currentItem = item;
    if (!this.videoEl) return;

    const src = item.src || item.path;
    this.videoEl.src = src;
    this.videoEl.load();

    this.state.currentTime = item.lastPosition || 0;
    this.state.isEnded = false;

    if (item.lastPosition && item.lastPosition > 0) {
      this.videoEl.currentTime = item.lastPosition;
    }

    this.notify();
  }

  async play(): Promise<void> {
    if (!this.videoEl) return;
    try {
      await this.videoEl.play();
    } catch (err) {
      console.warn('Playback error or user gesture required:', err);
    }
  }

  pause(): void {
    if (this.videoEl) {
      this.videoEl.pause();
    }
  }

  stop(): void {
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.currentTime = 0;
      this.state.isPlaying = false;
      this.notify();
    }
  }

  seek(seconds: number): void {
    if (this.videoEl) {
      const newTime = Math.max(0, Math.min(seconds, this.state.duration));
      this.videoEl.currentTime = newTime;
      this.state.currentTime = newTime;
      this.notify();
    }
  }

  setVolume(volume: number): void {
    if (this.videoEl) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.videoEl.volume = clamped;
      this.state.volume = clamped;
      if (clamped > 0 && this.videoEl.muted) {
        this.videoEl.muted = false;
        this.state.isMuted = false;
      }
      this.notify();
    }
  }

  setMuted(muted: boolean): void {
    if (this.videoEl) {
      this.videoEl.muted = muted;
      this.state.isMuted = muted;
      this.notify();
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.videoEl) {
      this.videoEl.playbackRate = rate;
      this.state.playbackRate = rate;
      this.notify();
    }
  }

  setVideoTransform(transform: VideoTransform): void {
    this.state.transform = { ...transform };
    this.notify();
  }

  async getMetadata(): Promise<CodecMetadata | undefined> {
    if (this.currentItem?.metadata) {
      return this.currentItem.metadata;
    }
    if (!this.videoEl) return undefined;

    return {
      videoCodec: 'H.264 / AVC',
      audioCodec: 'AAC-LC',
      resolution: `${this.videoEl.videoWidth || 1920}x${this.videoEl.videoHeight || 1080}`,
      width: this.videoEl.videoWidth || 1920,
      height: this.videoEl.videoHeight || 1080,
      frameRate: 60,
      bitrate: '12.4 Mbps',
      container: this.currentItem?.format.toUpperCase() || 'MP4',
      audioChannels: 'Stereo (2.0)',
      sampleRate: '48,000 Hz',
    };
  }

  getAudioTracks(): AudioTrack[] {
    return this.currentItem?.audioTracks || [
      { id: 'audio-1', label: 'English (Stereo)', language: 'en', channels: 2 },
      { id: 'audio-2', label: 'Original Audio (5.1 Surround)', language: 'und', channels: 6 },
    ];
  }

  getSubtitleTracks(): SubtitleTrack[] {
    return this.currentItem?.subtitles || [
      { id: 'sub-off', label: 'Off', language: 'off' },
      { id: 'sub-en', label: 'English [CC]', language: 'en' },
      { id: 'sub-es', label: 'Spanish', language: 'es' },
    ];
  }

  selectAudioTrack(trackId: string): void {
    this.state.activeAudioTrackId = trackId;
    this.notify();
  }

  selectSubtitleTrack(trackId: string | undefined): void {
    this.state.activeSubtitleId = trackId;
    this.notify();
  }

  async loadExternalSubtitle(file: File): Promise<SubtitleTrack | undefined> {
    const url = URL.createObjectURL(file);
    const newTrack: SubtitleTrack = {
      id: `ext-sub-${Date.now()}`,
      label: `${file.name.replace(/\.[^/.]+$/, '')} (External)`,
      language: 'custom',
      src: url,
      isExternal: true,
    };
    if (this.currentItem) {
      this.currentItem.subtitles = [...(this.currentItem.subtitles || []), newTrack];
    }
    this.selectSubtitleTrack(newTrack.id);
    return newTrack;
  }

  setSubtitleDelay(seconds: number): void {
    this.subtitleDelay = seconds;
    console.log('[Html5VideoAdapter] Subtitle delay set:', this.subtitleDelay);
    this.notify();
  }

  setAudioDelay(seconds: number): void {
    this.audioDelay = seconds;
    console.log('[Html5VideoAdapter] Audio delay set:', this.audioDelay);
    this.notify();
  }

  async takeScreenshot(): Promise<string | undefined> {
    if (!this.videoEl) return undefined;
    const canvas = this.canvasEl || document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth || 1920;
    canvas.height = this.videoEl.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const t = this.state.transform;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);
    if (t.rotate !== 0) {
      ctx.rotate((t.rotate * Math.PI) / 180);
    }
    ctx.drawImage(this.videoEl, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  // ----- Audio Equalizer (Web Audio API) -----
  private setupAudioContext(): void {
    if (this.audioCtx || !this.videoEl) return;
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sourceNode = this.audioCtx.createMediaElementSource(this.videoEl);
      this.preampNode = this.audioCtx.createGain();
      
      const freqs = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
      this.eqBands = freqs.map((freq) => {
        const filter = this.audioCtx!.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.0;
        filter.gain.value = 0;
        return filter;
      });

      // Chain: source -> preamp -> eq[0] -> ... -> eq[9] -> destination
      this.sourceNode.connect(this.preampNode);
      let lastNode: AudioNode = this.preampNode;
      this.eqBands.forEach((band) => {
        lastNode.connect(band);
        lastNode = band;
      });
      lastNode.connect(this.audioCtx.destination);
      this.applyEqualizerState();
    } catch (e) {
      console.warn("Could not setup AudioContext", e);
    }
  }

  setEqualizer(eq: EqualizerState): void {
    this.state.equalizer = { ...eq };
    this.applyEqualizerState();
    this.notify();
  }

  private applyEqualizerState(): void {
    if (!this.audioCtx || !this.preampNode) return;
    const { enabled, preamp, bands } = this.state.equalizer;
    
    if (enabled) {
      // Map preamp (-20 to +20 dB) to gain multiplier (0.1 to 10 approx)
      this.preampNode.gain.value = Math.pow(10, preamp / 20);
      this.eqBands.forEach((band, i) => {
        band.gain.value = bands[i] || 0;
      });
    } else {
      this.preampNode.gain.value = 1;
      this.eqBands.forEach(band => band.gain.value = 0);
    }
  }

  // ----- Loop A-B & Frame step -----
  setLoop(loop: LoopState): void {
    this.state.loopState = { ...loop };
    this.notify();
  }

  frameStep(): void {
    if (!this.videoEl) return;
    this.videoEl.pause();
    this.state.isPlaying = false;
    this.videoEl.currentTime += (1 / 30); // Advance roughly 1 frame at 30fps
    this.state.currentTime = this.videoEl.currentTime;
    this.notify();
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
    this.removeEventListeners();
    this.listeners.clear();
    this.videoEl = null;
    this.canvasEl = null;
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
