import React from 'react';
import {
  Home,
  Film,
  ListVideo,
  Clock,
  Settings,
  Keyboard,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { NavigationTab } from '../../types';

interface SidebarItemProps {
  tab: NavigationTab;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  badge?: number | string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active,
  collapsed,
  onClick,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? 'bg-blue-600/90 text-white shadow-md shadow-blue-500/20'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
      title={collapsed ? label : undefined}
    >
      <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>

      {!collapsed && <span className="truncate">{label}</span>}

      {!collapsed && badge && (
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    setShortcutsModalOpen,
  } = useUiStore();
  const { isFullscreen } = usePlayerStore();
  const { settings, updateGeneral } = useSettingsStore();

  if (isFullscreen) return null;

  const isDark = settings.general.theme === 'dark';

  const toggleTheme = () => {
    updateGeneral({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-slate-800/80 bg-[#0b0f19] p-3 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation Group */}
      <div className="flex flex-col gap-1.5">
        <SidebarItem
          tab="home"
          label="Home"
          icon={<Home size={18} />}
          active={activeTab === 'home'}
          collapsed={isSidebarCollapsed}
          onClick={() => setActiveTab('home')}
        />
        <SidebarItem
          tab="library"
          label="Library"
          icon={<Film size={18} />}
          active={activeTab === 'library'}
          collapsed={isSidebarCollapsed}
          onClick={() => setActiveTab('library')}
        />
        <SidebarItem
          tab="playlists"
          label="Playlists"
          icon={<ListVideo size={18} />}
          active={activeTab === 'playlists'}
          collapsed={isSidebarCollapsed}
          onClick={() => setActiveTab('playlists')}
        />
        <SidebarItem
          tab="recent"
          label="Recent Videos"
          icon={<Clock size={18} />}
          active={activeTab === 'recent'}
          collapsed={isSidebarCollapsed}
          onClick={() => setActiveTab('recent')}
        />
        <SidebarItem
          tab="settings"
          label="Settings"
          icon={<Settings size={18} />}
          active={activeTab === 'settings'}
          collapsed={isSidebarCollapsed}
          onClick={() => setActiveTab('settings')}
        />
      </div>

      {/* Footer / Utilities Group */}
      <div className="flex flex-col gap-2 border-t border-slate-800/80 pt-3">
        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200`}
          title="View Keyboard Shortcuts (F1)"
        >
          <Keyboard size={16} />
          {!isSidebarCollapsed && <span>Shortcuts</span>}
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
          {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
          {!isSidebarCollapsed && <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>}
        </button>

        {/* Collapse Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="mt-1 flex h-8 w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Version label */}
        {!isSidebarCollapsed && (
          <div className="mt-2 text-center text-[10px] font-mono text-slate-600">
            LS Player Engine v2.4
          </div>
        )}
      </div>
    </aside>
  );
};
