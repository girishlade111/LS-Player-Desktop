import React from 'react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const AdvancedControls: React.FC = () => {
  const { isAdvancedControlsOpen } = useUiStore();
  const { takeScreenshot, playbackState, setLoopA, setLoopB, clearLoop, frameStep } = usePlayerStore();
  
  if (!isAdvancedControlsOpen) return null;

  const btnClass = "w-6 h-6 flex items-center justify-center border border-gray-400 bg-[#f0f0f0] hover:bg-white text-xs shadow-sm text-red-600";
  const btnActiveClass = "w-6 h-6 flex items-center justify-center border border-gray-500 bg-gray-300 text-xs shadow-inner text-red-600";

  const handleSnapshot = async () => {
    const dataUrl = await takeScreenshot();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `snapshot_${Date.now()}.png`;
      a.click();
    }
  };

  const handleLoopClick = () => {
    const { loopState } = playbackState;
    if (loopState.a === null) {
      setLoopA();
    } else if (loopState.b === null) {
      setLoopB();
    } else {
      clearLoop();
    }
  };

  const getLoopText = () => {
    const { loopState } = playbackState;
    if (loopState.a !== null && loopState.b !== null) return "A-B (Active)";
    if (loopState.a !== null) return "A- (Wait B)";
    return "A-B";
  };

  return (
    <div className="flex gap-2 px-4 py-1 bg-vlc-control-bg border-b border-gray-300">
      <button className={btnClass} title="Record (Stub)" onClick={() => alert('Record stub')}>●</button>
      <button className={btnClass} title="Take a snapshot" onClick={handleSnapshot}>📷</button>
      <button 
        className={playbackState.loopState.a !== null ? btnActiveClass : btnClass} 
        title="Loop from point A to point B"
        onClick={handleLoopClick}
      >
        {playbackState.loopState.a !== null ? 'A-B' : 'A-B'}
      </button>
      <button className={btnClass} title="Frame by frame" onClick={frameStep}>⏭</button>
    </div>
  );
};
