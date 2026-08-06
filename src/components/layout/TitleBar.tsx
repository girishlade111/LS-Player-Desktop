import React from 'react';
import {
  FolderOpen,
  FileVideo,
  Search,
  Grid,
  List,
  Minus,
  Square,
  X,
} from 'lucide-react';
import { LSLogo } from '../assets/LSLogo';
import { useUiStore } from '../../stores/useUiStore';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const TitleBar: React.FC = () => {
  const { toggleCommandPalette } = useUiStore();
  const { displayMode, setDisplayMode, searchQuery, setSearchQuery, scanDirectory, addMediaItem } = useLibraryStore();
  const { isFullscreen, loadMedia } = usePlayerStore();

  if (isFullscreen) return null;

  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*,audio/*,.mkv,.avi,.mp4,.mov,.webm,.flv,.wmv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const newItem = {
          id: `file-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          path: file.name,
          size: file.size,
          duration: 320,
          lastPosition: 0,
          dateAdded: new Date().toISOString(),
          format: file.name.split('.').pop() || 'mp4',
          src: url,
          metadata: {
            videoCodec: 'H.264 / AVC',
            audioCodec: 'AAC',
            resolution: '1920x1080',
            width: 1920,
            height: 1080,
            frameRate: 30,
            bitrate: '12 Mbps',
            container: file.name.split('.').pop()?.toUpperCase() || 'MP4',
            audioChannels: 'Stereo',
            sampleRate: '48,000 Hz',
          },
        };
        addMediaItem(newItem);
        loadMedia(newItem, true);
      }
    };
    input.click();
  };

  const handleOpenFolder = () => {
    scanDirectory('C:\\Videos\\Imported_Collection');
  };

  return (
    <header className="flex h-11 w-full select-none items-center justify-between border-b border-slate-800/80 bg-[#080c14] px-3 py-1 text-slate-200">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <LSLogo size={24} showText={true} />
        <span className="hidden text-[11px] font-medium text-slate-400 lg:inline-block">
          v2.4 Enterprise Edition
        </span>
      </div>

      {/* Center: Search Field / Quick Command Bar */}
      <div className="flex flex-1 max-w-md items-center justify-center px-4">
        <div
          onClick={toggleCommandPalette}
          className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-400 transition-all hover:border-blue-500/50 hover:bg-slate-900 hover:text-slate-200"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-slate-400 group-hover:text-cyan-400" />
            <input
              type="text"
              placeholder="Search local videos, commands... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full cursor-pointer"
            />
          </div>
          <kbd className="hidden rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Open Buttons, View Toggle, Window Controls */}
      <div className="flex items-center gap-1.5">
        {/* Open File CTA */}
        <button
          onClick={handleOpenFile}
          className="flex items-center gap-1.5 rounded-md bg-blue-600/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
          title="Open local media file (Ctrl + O)"
        >
          <FileVideo size={14} />
          <span className="hidden sm:inline">Open File</span>
        </button>

        {/* Open Folder CTA */}
        <button
          onClick={handleOpenFolder}
          className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 transition-all hover:bg-slate-700 hover:text-white active:scale-95"
          title="Scan folder for videos (Ctrl + Shift + O)"
        >
          <FolderOpen size={14} />
          <span className="hidden sm:inline">Open Folder</span>
        </button>

        {/* View Toggle */}
        <div className="mx-1 flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-0.5">
          <button
            onClick={() => setDisplayMode('grid')}
            className={`rounded p-1 transition-colors ${
              displayMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <Grid size={13} />
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`rounded p-1 transition-colors ${
              displayMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List View"
          >
            <List size={13} />
          </button>
        </div>

        {/* Window Control Buttons */}
        <div className="ml-2 flex items-center gap-0.5 border-l border-slate-800 pl-2">
          <button
            className="flex h-7 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            title="Minimize"
          >
            <Minus size={12} />
          </button>
          <button
            className="flex h-7 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            title="Maximize"
          >
            <Square size={11} />
          </button>
          <button
            className="flex h-7 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-red-600 hover:text-white"
            title="Close"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
