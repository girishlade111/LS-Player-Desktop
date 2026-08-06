import React from 'react';
import { useUiStore } from '../../stores/useUiStore';

export const AdvancedControls: React.FC = () => {
  const { isAdvancedControlsOpen } = useUiStore();
  
  if (!isAdvancedControlsOpen) return null;

  const btnClass = "w-6 h-6 flex items-center justify-center border border-gray-400 bg-[#f0f0f0] hover:bg-white text-xs shadow-sm text-red-600";

  return (
    <div className="flex gap-2 px-4 py-1 bg-vlc-control-bg border-b border-gray-300">
      <button className={btnClass} title="Record">●</button>
      <button className={btnClass} title="Take a snapshot">📷</button>
      <button className={btnClass} title="Loop from point A to point B">A-B</button>
      <button className={btnClass} title="Frame by frame">⏭</button>
    </div>
  );
};
