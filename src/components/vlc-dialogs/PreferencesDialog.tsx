import React from 'react';
import { useUiStore } from '../../stores/useUiStore';

export const PreferencesDialog: React.FC = () => {
  const { isPreferencesOpen, setPreferencesOpen } = useUiStore();
  
  if (!isPreferencesOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-[#f0f0f0] border border-gray-400 shadow-xl w-[700px] flex flex-col font-sans text-sm text-black">
        
        <div className="flex justify-between items-center bg-white px-2 py-1 border-b border-gray-300">
          <span className="font-semibold">Simple Preferences</span>
          <button 
            className="hover:bg-red-500 hover:text-white px-2 text-lg leading-none"
            onClick={() => setPreferencesOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="flex bg-[#f0f0f0]">
          {/* Sidebar Tabs */}
          <div className="w-32 flex flex-col border-r border-gray-300 p-2 gap-2 bg-white">
            <button className="flex flex-col items-center p-2 bg-gray-100 border border-gray-300">
              <span className="text-2xl">💻</span>
              <span className="text-xs">Interface</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 border border-transparent">
              <span className="text-2xl">🎵</span>
              <span className="text-xs">Audio</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 border border-transparent">
              <span className="text-2xl">🎬</span>
              <span className="text-xs">Video</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 border border-transparent">
              <span className="text-2xl">📝</span>
              <span className="text-xs">Subtitles</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 border border-transparent">
              <span className="text-2xl">⌨️</span>
              <span className="text-xs">Hotkeys</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 bg-white min-h-[400px]">
            <h2 className="font-bold border-b border-gray-300 pb-1 mb-4">Interface Settings</h2>
            
            <fieldset className="border border-gray-300 p-3 mb-4">
              <legend className="text-xs font-semibold px-1 text-primary">Language</legend>
              <div className="flex items-center gap-2">
                <label className="text-xs">Menus language:</label>
                <select className="border border-gray-300 px-1 text-xs">
                  <option>Auto</option>
                  <option>American English</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 p-3 mb-4">
              <legend className="text-xs font-semibold px-1 text-primary">Look and feel</legend>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-center gap-2"><input type="radio" name="ui" defaultChecked /> Use native style</label>
                <label className="flex items-center gap-2"><input type="radio" name="ui" /> Use custom skin</label>
                <label className="flex items-center gap-2 ml-4"><input type="checkbox" defaultChecked /> Show controls in full screen mode</label>
                <label className="flex items-center gap-2 ml-4"><input type="checkbox" /> Resize interface to video size</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="flex justify-between p-2 bg-[#f0f0f0] border-t border-gray-300 items-center">
          <div className="text-xs flex gap-2">
            <span className="font-semibold">Show settings:</span>
            <label className="flex items-center gap-1"><input type="radio" name="show" defaultChecked /> Simple</label>
            <label className="flex items-center gap-1"><input type="radio" name="show" /> All</label>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200">Reset Preferences</button>
            <button className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200" onClick={() => setPreferencesOpen(false)}>Save</button>
            <button className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200" onClick={() => setPreferencesOpen(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
