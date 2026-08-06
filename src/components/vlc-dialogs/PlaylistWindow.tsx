import React from 'react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlaylistStore } from '../../stores/usePlaylistStore';

export const PlaylistWindow: React.FC = () => {
  const { isPlaylistOpen, setPlaylistOpen } = useUiStore();
  const { items, currentItemIndex, playItem, removeItem } = usePlaylistStore();
  
  if (!isPlaylistOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 pointer-events-none">
      <div className="bg-white border border-gray-400 shadow-xl w-[800px] h-[500px] flex flex-col font-sans text-sm text-black pointer-events-auto resize">
        
        <div className="flex justify-between items-center bg-white px-2 py-1 border-b border-gray-300">
          <span className="font-semibold">Playlist - LS Player</span>
          <button 
            className="hover:bg-red-500 hover:text-white px-2 text-lg leading-none"
            onClick={() => setPlaylistOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#f3f4f6] border-r border-gray-300 flex flex-col p-2 text-xs">
            <div className="font-bold mb-2">Media Library</div>
            <div className="pl-4 py-1 hover:bg-gray-200 cursor-pointer text-primary bg-blue-100/50">Playlist</div>
            <div className="pl-4 py-1 hover:bg-gray-200 cursor-pointer">Media Library</div>
            <div className="font-bold mt-4 mb-2">My Computer</div>
            <div className="pl-4 py-1 hover:bg-gray-200 cursor-pointer">My Videos</div>
            <div className="pl-4 py-1 hover:bg-gray-200 cursor-pointer">My Music</div>
            <div className="font-bold mt-4 mb-2">Local Network</div>
            <div className="pl-4 py-1 hover:bg-gray-200 cursor-pointer">Universal Plug'n'Play</div>
          </div>

          {/* Table */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold px-2 py-1">
              <div className="w-8">#</div>
              <div className="flex-1 border-l border-gray-300 pl-2">Title</div>
              <div className="w-24 border-l border-gray-300 pl-2">Duration</div>
              <div className="w-32 border-l border-gray-300 pl-2">Album</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 italic">Playlist is empty</div>
              ) : (
                items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex px-2 py-1 text-xs cursor-pointer border-b border-gray-100 ${index === currentItemIndex ? 'bg-primary text-white font-bold' : 'hover:bg-blue-50 text-black'}`}
                    onDoubleClick={() => playItem(index)}
                  >
                    <div className="w-8">{index + 1}</div>
                    <div className="flex-1 truncate">{item.title}</div>
                    <div className="w-24">{item.duration > 0 ? new Date(item.duration * 1000).toISOString().substr(11, 8) : '--:--'}</div>
                    <div className="w-32 truncate"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#f0f0f0] border-t border-gray-300 p-1 flex justify-between items-center text-xs px-4">
          <div>{items.length} item(s)</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-white border border-gray-400 shadow-sm hover:bg-gray-100">+</button>
            <button className="px-2 py-1 bg-white border border-gray-400 shadow-sm hover:bg-gray-100">-</button>
          </div>
        </div>
      </div>
    </div>
  );
};
