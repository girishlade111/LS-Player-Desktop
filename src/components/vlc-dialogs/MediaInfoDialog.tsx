import React from 'react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const MediaInfoDialog: React.FC = () => {
  const { isMediaInfoOpen, setMediaInfoOpen } = useUiStore();
  const { currentMedia } = usePlayerStore();
  
  if (!isMediaInfoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-[#f0f0f0] border border-gray-400 shadow-xl w-[600px] flex flex-col font-sans text-sm text-black">
        
        <div className="flex justify-between items-center bg-white px-2 py-1 border-b border-gray-300">
          <span className="font-semibold">Current Media Information</span>
          <button 
            className="hover:bg-red-500 hover:text-white px-2 text-lg leading-none"
            onClick={() => setMediaInfoOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 px-2 pt-2 border-b border-gray-300">
          <button className="px-4 py-1 border border-b-0 border-gray-300 rounded-t bg-white font-semibold">General</button>
          <button className="px-4 py-1 border border-b-0 border-gray-300 rounded-t bg-gray-200">Codec</button>
          <button className="px-4 py-1 border border-b-0 border-gray-300 rounded-t bg-gray-200">Statistics</button>
        </div>

        <div className="p-4 bg-white min-h-[300px] border-b border-gray-300 flex flex-col gap-4">
          
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="icon" className="w-12 h-12 grayscale opacity-50" />
            <div className="flex flex-col w-full">
              <label className="text-xs font-semibold">Title</label>
              <input type="text" className="border border-gray-300 px-1 w-full bg-gray-50" readOnly value={currentMedia?.title || ''} />
            </div>
          </div>

          <fieldset className="border border-gray-300 p-2">
            <legend className="text-xs font-semibold px-1 text-primary">Media Info</legend>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex gap-2">
                <span className="w-16 text-right">Artist</span>
                <input type="text" className="border border-gray-300 px-1 flex-1 bg-gray-50" readOnly />
              </div>
              <div className="flex gap-2">
                <span className="w-16 text-right">Album</span>
                <input type="text" className="border border-gray-300 px-1 flex-1 bg-gray-50" readOnly />
              </div>
              <div className="flex gap-2">
                <span className="w-16 text-right">Genre</span>
                <input type="text" className="border border-gray-300 px-1 flex-1 bg-gray-50" readOnly />
              </div>
              <div className="flex gap-2">
                <span className="w-16 text-right">Copyright</span>
                <input type="text" className="border border-gray-300 px-1 flex-1 bg-gray-50" readOnly />
              </div>
            </div>
          </fieldset>
          
          <div className="flex gap-2 text-xs mt-auto">
            <span className="w-16 text-right">Location</span>
            <input type="text" className="border border-gray-300 px-1 flex-1 bg-gray-50" readOnly value={currentMedia?.src || ''} />
          </div>

        </div>

        <div className="flex justify-between p-2 bg-[#f0f0f0]">
          <button className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200" onClick={() => alert('Stub: Save Metadata')}>Save Metadata</button>
          <button 
            className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => setMediaInfoOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
