export type NavigationTab = 'home' | 'library' | 'playlists' | 'recent' | 'settings';

export type DisplayMode = 'grid' | 'list';

export type AspectRatio = 'auto' | '16:9' | '4:3' | '21:9' | 'fit' | 'fill' | 'crop';

export type RepeatMode = 'off' | 'one' | 'all';

export type ThemeMode = 'dark' | 'light' | 'system';

export type CodecType = 'H.264 / AVC' | 'H.265 / HEVC' | 'VP9' | 'AV1' | 'ProRes' | 'MPEG-4' | 'AAC' | 'FLAC' | 'MP3' | 'Unknown';

export interface CodecMetadata {
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  width: number;
  height: number;
  frameRate: number;
  bitrate: string;
  colorSpace?: string;
  container: string;
  audioChannels: string;
  sampleRate: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src?: string;
  isExternal?: boolean;
}

export interface SubtitleCue {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

export interface AudioTrack {
  id: string;
  label: string;
  language: string;
  channels: number;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

export interface MediaItem {
  id: string;
  title: string;
  path: string;
  size: number; // in bytes
  duration: number; // in seconds
  lastPosition: number; // in seconds
  thumbnailUrl?: string;
  dateAdded: string;
  lastPlayed?: string;
  format: string;
  isFavorite?: boolean;
  metadata?: CodecMetadata;
  subtitles?: SubtitleTrack[];
  audioTracks?: AudioTrack[];
  chapters?: Chapter[];
  src?: string; // Blob or URL for HTML5 playback
}

export interface Playlist {
  id: string;
  title: string;
  dateCreated: string;
  items: MediaItem[];
}

export interface VideoTransform {
  zoom: number; // 1.0 = normal
  rotate: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  aspectRatio: AspectRatio;
  brightness: number; // 100 default
  contrast: number; // 100 default
  saturation: number; // 100 default
  hue: number; // 0 default
}

export interface EqualizerState {
  enabled: boolean;
  preamp: number;
  bands: number[]; // 10 bands
}

export interface LoopState {
  a: number | null;
  b: number | null;
}

export interface SubtitleStyle {
  fontSize: number; // in px
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  outlineColor: string;
  outlineWidth: number;
  verticalPosition: number; // percentage from bottom
}

export interface AppSettings {
  general: {
    theme: ThemeMode;
    accentColor: string;
    startupBehavior: 'home' | 'last-played' | 'open-prompt';
    resumePlayback: boolean;
    alwaysOnTop: boolean;
    confirmOnExit: boolean;
  };
  playback: {
    defaultVolume: number;
    defaultSpeed: number;
    seekIntervalShort: number; // 5s
    seekIntervalMedium: number; // 10s
    seekIntervalLong: number; // 30s
    hardwareAcceleration: boolean;
    preferredRenderer: 'auto' | 'direct3d' | 'opengl' | 'software';
    mouseWheelAction: 'volume' | 'seek';
    doubleClickAction: 'fullscreen' | 'playpause';
    autoPlayNext: boolean;
  };
  subtitles: {
    autoLoadMatching: boolean;
    preferredLanguage: string;
    style: SubtitleStyle;
    encoding: string;
  };
  library: {
    generateThumbnails: boolean;
    recentItemsLimit: number;
    watchHistoryEnabled: boolean;
    foldersToScan: string[];
  };
  advanced: {
    logLevel: 'info' | 'debug' | 'error';
    hardwareDecoder: string;
    cacheSizeMb: number;
  };
}

export interface OsdMessage {
  id: string;
  text: string;
  icon?: string;
  timestamp: number;
}
