import React, { useRef } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const VlcMenuBar: React.FC = () => {
  const { loadMedia, stop } = usePlayerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const menuItems = [
    { label: 'Media', items: [{ label: 'Open File...', action: handleOpenFileClick }, { label: 'Quit', action: () => window.close() }] },
    { label: 'Playback', items: [{ label: 'Stop', action: stop }] },
    { label: 'Audio', items: [] },
    { label: 'Video', items: [] },
    { label: 'Subtitle', items: [] },
    { label: 'Tools', items: [] },
    { label: 'View', items: [] },
    { label: 'Help', items: [] },
  ];

  return (
    <div className="flex h-6 w-full items-center bg-white border-b border-border text-[12px] text-black">
      {/* Hidden file input for native OS file picking in browser environment */}
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
          className="group relative flex h-full items-center px-2 hover:bg-vlc-menu-hover cursor-pointer"
        >
          {menu.label}
          {menu.items.length > 0 && (
            <div className="absolute left-0 top-6 hidden min-w-[150px] bg-white border border-border shadow-md group-hover:block z-50">
              {menu.items.map((item, i) => (
                <div 
                  key={i} 
                  className="px-4 py-1 hover:bg-primary hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
