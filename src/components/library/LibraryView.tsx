import React, { useState } from 'react';
import {
  Play,
  Heart,
  Clock,
  FileVideo,
  MoreVertical,
  Info,
  Trash2,
  FolderPlus,
  ListPlus,
} from 'lucide-react';
import { useLibraryStore } from '../../stores/useLibraryStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { usePlaylistStore } from '../../stores/usePlaylistStore';
import { useUiStore } from '../../stores/useUiStore';
import { formatTime, formatFileSize, formatDate, getFileExtension } from '../../utils/formatters';
import type { MediaItem } from '../../types';

export const LibraryView: React.FC = () => {
  const {
    items,
    recentItems,
    displayMode,
    searchQuery,
    activeFilter,
    setActiveFilter,
    toggleFavorite,
    removeMediaItem,
    scanDirectory,
    isScanning,
  } = useLibraryStore();

  const { loadMedia } = usePlayerStore();
  const { addItem: addToPlaylist } = usePlaylistStore();
  const { setActiveTab, setFileInfoModalOpen } = useUiStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'recent') return !!item.lastPlayed;
    if (activeFilter === 'favorites') return !!item.isFavorite;
    if (activeFilter === 'videos')
      return ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'].includes(item.format.toLowerCase());
    if (activeFilter === 'audio')
      return ['mp3', 'flac', 'wav', 'aac', 'm4a', 'ogg'].includes(item.format.toLowerCase());

    return true;
  });

  const handlePlayMedia = (item: MediaItem) => {
    loadMedia(item, true);
    setActiveTab('home');
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#080c14] p-6 text-slate-100">
      {/* 1. Header & Hero Bar */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            Local Video Library
            <span className="rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-blue-500/30">
              {items.length} Files
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            High performance playback with instant local thumbnail indexing and format support.
          </p>
        </div>

        {/* Scan & Add CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scanDirectory('C:\\Videos')}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 shadow-sm transition-all hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >
            <FolderPlus size={15} className={isScanning ? 'animate-spin text-cyan-400' : ''} />
            <span>{isScanning ? 'Scanning Directory...' : 'Scan Local Folder'}</span>
          </button>
        </div>
      </div>

      {/* 2. Continue Watching Carousel */}
      {recentItems.length > 0 && (
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-400" />
              Continue Watching
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {recentItems.slice(0, 5).map((item) => {
              const progress = item.duration > 0 ? (item.lastPosition / item.duration) * 100 : 0;
              return (
                <div
                  key={`continue-${item.id}`}
                  onClick={() => handlePlayMedia(item)}
                  className="group relative flex w-64 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600/30 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/40">
                        <Play size={22} className="ml-0.5" />
                      </div>
                    </div>

                    {/* Format Badge */}
                    <span className="absolute top-2 left-2 rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase border border-slate-700">
                      {getFileExtension(item.path)}
                    </span>

                    {/* Duration Badge */}
                    <span className="absolute bottom-2 right-2 rounded-md bg-slate-950/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                      {formatTime(item.duration)}
                    </span>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-400">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-slate-500 font-mono">
                      {formatTime(item.lastPosition)} left of {formatTime(item.duration)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5">
          {(['all', 'recent', 'favorites', 'videos', 'audio'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Grid or List View Display */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-xl mb-4">
            <FileVideo size={40} />
          </div>
          <h3 className="text-base font-bold text-slate-200">No Video Files Found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            Drag and drop local video files anywhere into the app, or click below to scan a directory.
          </p>
          <button
            onClick={() => scanDirectory('C:\\Videos')}
            className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500"
          >
            <FolderPlus size={15} />
            <span>Scan Video Directory</span>
          </button>
        </div>
      ) : displayMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => handlePlayMedia(item)}
                className="relative h-44 w-full cursor-pointer overflow-hidden bg-slate-950"
              >
                <img
                  src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/30 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/50">
                    <Play size={24} className="ml-0.5" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase border border-slate-700">
                    {getFileExtension(item.path)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`rounded-full p-1.5 transition-colors ${
                      item.isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={item.isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-200 border border-slate-800">
                  {formatTime(item.duration)}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    onClick={() => handlePlayMedia(item)}
                    className="cursor-pointer text-xs font-bold text-slate-100 truncate group-hover:text-cyan-400"
                  >
                    {item.title}
                  </h3>

                  {/* Context Menu Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeMenuId === item.id && (
                      <div className="glass-panel absolute right-0 top-6 z-30 flex w-44 flex-col gap-1 rounded-xl p-1.5 shadow-2xl border border-slate-700 text-xs">
                        <button
                          onClick={() => {
                            handlePlayMedia(item);
                            setActiveMenuId(null);
                          }}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-slate-200 hover:bg-blue-600 hover:text-white"
                        >
                          <Play size={13} />
                          <span>Play Now</span>
                        </button>
                        <button
                          onClick={() => {
                            addToPlaylist(item);
                            setActiveMenuId(null);
                          }}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-slate-200 hover:bg-slate-800"
                        >
                          <ListPlus size={13} />
                          <span>Add to Queue</span>
                        </button>
                        <button
                          onClick={() => {
                            setFileInfoModalOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-slate-200 hover:bg-slate-800"
                        >
                          <Info size={13} />
                          <span>File Details</span>
                        </button>
                        <div className="my-1 border-t border-slate-800" />
                        <button
                          onClick={() => {
                            removeMediaItem(item.id);
                            setActiveMenuId(null);
                          }}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{formatDate(item.dateAdded)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex flex-col gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePlayMedia(item)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 transition-all hover:border-blue-500/50 hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-950">
                  <img
                    src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-white" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-md">
                    {item.path}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-400 uppercase">
                  {getFileExtension(item.path)}
                </span>
                <span>{formatFileSize(item.size)}</span>
                <span>{formatTime(item.duration)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
