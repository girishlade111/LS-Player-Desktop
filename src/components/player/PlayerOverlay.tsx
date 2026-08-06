import React from 'react';
import { ChevronLeft, Info, PictureInPicture, Sparkles } from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useUiStore } from '../../stores/useUiStore';

export const PlayerOverlay: React.FC = () => {
  const { currentMedia, isMiniPlayer, toggleMiniPlayer } = usePlayerStore();
  const { setActiveTab, setFileInfoModalOpen } = useUiStore();

  const handleBackToLibrary = () => {
    setActiveTab('home');
  };

  const handlePipToggle = async () => {
    try {
      const video = document.querySelector('video');
      if (video) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      }
    } catch (e) {
      console.warn('Picture-in-Picture error:', e);
    }
  };

  return (
    <div className="glass-overlay absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 transition-all">
      {/* Left: Back button & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToLibrary}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          title="Back to Library (Esc)"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-slate-100 truncate max-w-md">
            {currentMedia?.title || 'No Media Loaded'}
          </h2>
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-sm">
            {currentMedia?.path || 'Ready for media input'}
          </span>
        </div>
      </div>

      {/* Right: Picture in Picture, Mini Mode, Media Info */}
      <div className="flex items-center gap-2">
        {/* File Info */}
        <button
          onClick={() => setFileInfoModalOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          title="Media Format & Codec Information (I)"
        >
          <Info size={17} />
        </button>

        {/* PIP */}
        <button
          onClick={handlePipToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          title="Picture-in-Picture"
        >
          <PictureInPicture size={17} />
        </button>

        {/* Mini Player */}
        <button
          onClick={toggleMiniPlayer}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 transition-all ${
            isMiniPlayer ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Toggle Compact Mini Mode"
        >
          <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
};
