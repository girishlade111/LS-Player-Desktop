import React, { useState } from 'react';
import { useUiStore } from '../../stores/useUiStore';

export const EffectsFiltersDialog: React.FC = () => {
  const { isEffectsFiltersOpen, setEffectsFiltersOpen } = useUiStore();
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  
  if (!isEffectsFiltersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-[#f0f0f0] border border-gray-400 shadow-xl w-[500px] flex flex-col font-sans text-sm text-black">
        
        {/* Title Bar */}
        <div className="flex justify-between items-center bg-white px-2 py-1 border-b border-gray-300">
          <span className="font-semibold">Adjustments and Effects</span>
          <button 
            className="hover:bg-red-500 hover:text-white px-2 text-lg leading-none"
            onClick={() => setEffectsFiltersOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-2 px-2 pt-2 border-b border-gray-300">
          <button 
            className={`px-4 py-1 border border-b-0 border-gray-300 rounded-t ${activeTab === 'audio' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('audio')}
          >
            Audio Effects
          </button>
          <button 
            className={`px-4 py-1 border border-b-0 border-gray-300 rounded-t ${activeTab === 'video' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('video')}
          >
            Video Effects
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 bg-white min-h-[300px] border-b border-gray-300">
          {activeTab === 'audio' && (
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <input type="checkbox" id="enableEq" />
                <label htmlFor="enableEq" className="font-semibold">Enable</label>
                <select className="border border-gray-300 ml-4 px-1" defaultValue="Flat">
                  <option>Flat</option>
                  <option>Classical</option>
                  <option>Club</option>
                  <option>Dance</option>
                  <option>Full bass and treble</option>
                  <option>Pop</option>
                  <option>Rock</option>
                </select>
              </div>
              <div className="flex justify-between items-end h-40 px-2 mt-8">
                {/* Preamp */}
                <div className="flex flex-col items-center gap-2">
                  <input type="range" orient="vertical" className="appearance-none w-1 h-32 bg-gray-300 outline-none" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                  <span className="text-[10px]">Preamp</span>
                </div>
                {/* Bands */}
                {[60, 170, 310, 600, '1K', '3K', '6K', '12K', '14K', '16K'].map((freq, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <input type="range" orient="vertical" className="appearance-none w-1 h-32 bg-gray-300 outline-none" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                    <span className="text-[10px]">{freq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div>
              <div className="flex gap-4 border-b border-gray-200 pb-2 mb-4 text-xs font-semibold">
                <span className="border border-gray-300 bg-gray-100 px-2 py-1 cursor-default">Essential</span>
                <span className="px-2 py-1 text-gray-500 cursor-default">Crop</span>
                <span className="px-2 py-1 text-gray-500 cursor-default">Colors</span>
                <span className="px-2 py-1 text-gray-500 cursor-default">Geometry</span>
                <span className="px-2 py-1 text-gray-500 cursor-default">Overlay</span>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="imageAdjust" />
                  <label htmlFor="imageAdjust" className="font-semibold">Image adjust</label>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  {['Hue', 'Brightness', 'Contrast', 'Saturation', 'Gamma'].map(prop => (
                    <div key={prop} className="flex justify-between items-center gap-2">
                      <label className="text-xs">{prop}</label>
                      <input type="range" className="w-24 h-1 bg-gray-300 outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-2 bg-[#f0f0f0]">
          <button 
            className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200"
            onClick={() => setEffectsFiltersOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
