import React from 'react';
import { VideoViewport } from './VideoViewport';
import { OsdOverlay } from './OsdOverlay';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const PlayerView: React.FC = () => {
  const { currentMedia } = usePlayerStore();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black items-center justify-center">
      <OsdOverlay />
      
      {!currentMedia && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none z-30">
          {/* VLC Cone Placeholder (CSS representation for now) */}
          <div className="relative w-32 h-32">
            <div className="absolute bottom-0 w-32 h-4 bg-orange-600 rounded-full blur-[1px]"></div>
            <div className="absolute bottom-2 left-4 w-24 h-28 bg-orange-500 rounded-t-full rounded-b-lg flex flex-col items-center overflow-hidden">
              <div className="w-full h-4 bg-white mt-4"></div>
              <div className="w-full h-4 bg-white mt-6"></div>
            </div>
            <div className="absolute top-0 left-12 w-8 h-4 bg-orange-700 rounded-t-lg"></div>
          </div>
          <p className="mt-8 font-bold tracking-widest text-2xl text-[#fff] opacity-20 select-none">LS Player</p>
        </div>
      )}

      <div className="flex-1 w-full h-full relative z-10">
        <VideoViewport />
      </div>
    </div>
  );
};
