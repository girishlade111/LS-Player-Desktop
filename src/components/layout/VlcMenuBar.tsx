import React, { useRef, useEffect } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useUiStore } from '../../stores/useUiStore';

export const VlcMenuBar: React.FC = () => {
  const { loadMedia, stop, togglePlayPause, seekRelative, setFullscreen } = usePlayerStore();
  const { 
    setEffectsFiltersOpen, 
    setMediaInfoOpen, 
    setPreferencesOpen, 
    setPlaylistOpen,
    isAdvancedControlsOpen,
    setAdvancedControlsOpen
  } = useUiStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Hotkeys for VLC classic mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (though we don't have many yet)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'e':
            e.preventDefault();
            setEffectsFiltersOpen(true);
            break;
          case 'i':
            e.preventDefault();
            setMediaInfoOpen(true);
            break;
          case 'p':
            e.preventDefault();
            setPreferencesOpen(true);
            break;
          case 'l':
            e.preventDefault();
            setPlaylistOpen(true);
            break;
          case 'o':
            e.preventDefault();
            handleOpenFileClick();
            break;
          case 'q':
            e.preventDefault();
            window.close();
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newItem = {
        id: `local-${Date.now()}`,
        title: file.name,
        path: file.name,
        size: file.size,
        duration: 0,
        lastPosition: 0,
        dateAdded: new Date().toISOString(),
        format: file.name.split('.').pop() || 'mp4',
        src: url,
      };
      await loadMedia(newItem, true);
    }
    e.target.value = '';
  };

  const menuItems = [
    { 
      label: 'Media', 
      items: [
        { label: 'Open File... (Ctrl+O)', action: handleOpenFileClick }, 
        { label: 'Open Multiple Files...', action: () => alert('Stub: Open Multiple Files') },
        { label: 'Open Folder...', action: () => alert('Stub: Open Folder') },
        { label: 'Open Disc...', action: () => alert('Stub: Open Disc') },
        { label: 'Open Network Stream...', action: () => alert('Stub: Open Network Stream') },
        { label: 'Open Capture Device...', action: () => alert('Stub: Open Capture Device') },
        { divider: true },
        { label: 'Convert / Save...', action: () => alert('Stub: Convert / Save') },
        { divider: true },
        { label: 'Quit (Ctrl+Q)', action: () => window.close() }
      ] 
    },
    { 
      label: 'Playback', 
      items: [
        { label: 'Play/Pause', action: togglePlayPause },
        { label: 'Stop', action: stop },
        { label: 'Previous', action: () => alert('Stub: Previous') },
        { label: 'Next', action: () => alert('Stub: Next') },
        { divider: true },
        { label: 'Speed', action: () => alert('Stub: Speed submenu') },
        { label: 'Jump Forward', action: () => seekRelative(10) },
        { label: 'Jump Backward', action: () => seekRelative(-10) }
      ] 
    },
    { 
      label: 'Audio', 
      items: [
        { label: 'Audio Track', action: () => alert('Stub: Audio Track') },
        { label: 'Audio Device', action: () => alert('Stub: Audio Device') },
        { label: 'Stereo Mode', action: () => alert('Stub: Stereo Mode') },
        { divider: true },
        { label: 'Visualizations', action: () => alert('Stub: Visualizations') },
      ] 
    },
    { 
      label: 'Video', 
      items: [
        { label: 'Video Track', action: () => alert('Stub: Video Track') },
        { divider: true },
        { label: 'Fullscreen', action: () => setFullscreen(true) },
        { label: 'Always Fit Window', action: () => alert('Stub: Fit Window') },
        { label: 'Aspect Ratio', action: () => alert('Stub: Aspect Ratio') },
        { label: 'Crop', action: () => alert('Stub: Crop') },
        { label: 'Zoom', action: () => alert('Stub: Zoom') },
        { divider: true },
        { label: 'Take Snapshot', action: () => alert('Stub: Take Snapshot') },
      ] 
    },
    { 
      label: 'Subtitle', 
      items: [
        { label: 'Add Subtitle File...', action: () => alert('Stub: Add Subtitle') },
        { label: 'Sub Track', action: () => alert('Stub: Sub Track') },
      ] 
    },
    { 
      label: 'Tools', 
      items: [
        { label: 'Effects and Filters (Ctrl+E)', action: () => setEffectsFiltersOpen(true) },
        { label: 'Track Synchronization', action: () => alert('Stub: Track Sync') },
        { divider: true },
        { label: 'Media Information (Ctrl+I)', action: () => setMediaInfoOpen(true) },
        { label: 'Codec Information (Ctrl+J)', action: () => alert('Stub: Codec Info') },
        { divider: true },
        { label: 'Preferences (Ctrl+P)', action: () => setPreferencesOpen(true) },
      ] 
    },
    { 
      label: 'View', 
      items: [
        { label: 'Playlist (Ctrl+L)', action: () => setPlaylistOpen(true) },
        { divider: true },
        { label: 'Minimal Interface', action: () => alert('Stub: Minimal Interface') },
        { label: 'Fullscreen Interface', action: () => alert('Stub: Fullscreen Interface') },
        { label: 'Advanced Controls', action: () => setAdvancedControlsOpen(!isAdvancedControlsOpen) },
      ] 
    },
    { 
      label: 'Help', 
      items: [
        { label: 'Help...', action: () => alert('Stub: Help') },
        { label: 'About', action: () => alert('LS Player - Enterprise Desktop Edition') },
      ] 
    },
  ];

  return (
    <div className="flex h-[22px] w-full items-center bg-white border-b border-border text-[12px] text-black shrink-0 relative z-50">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*" 
        className="hidden" 
      />
      
      {menuItems.map((menu, index) => (
        <div 
          key={index} 
          className="group relative flex h-full items-center px-[8px] hover:bg-vlc-menu-hover cursor-default"
        >
          {menu.label}
          {menu.items.length > 0 && (
            <div className="absolute left-0 top-[22px] hidden min-w-[200px] bg-white border border-border shadow-md group-hover:block py-1">
              {menu.items.map((item, i) => {
                if (item.divider) {
                  return <div key={i} className="my-1 border-t border-gray-300" />;
                }
                return (
                  <div 
                    key={i} 
                    className="px-6 py-1 hover:bg-primary hover:text-white flex justify-between"
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      if (item.action) item.action();
                    }}
                  >
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
