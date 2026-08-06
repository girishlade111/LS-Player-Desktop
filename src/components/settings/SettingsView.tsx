import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Subtitles,
  Film,
  Keyboard,
  Cpu,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { LSLogo } from '../assets/LSLogo';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'playback' | 'subtitles' | 'library' | 'shortcuts' | 'advanced' | 'about'
  >('general');

  const {
    settings,
    updateGeneral,
    updatePlayback,
    updateSubtitleStyle,
    resetSettings,
  } = useSettingsStore();

  const { general, playback, subtitles } = settings;

  return (
    <div className="flex flex-1 overflow-hidden bg-[#080c14] text-slate-100">
      {/* Left Settings Section Nav */}
      <div className="w-56 border-r border-slate-800/80 bg-[#0b0f19] p-4 flex flex-col gap-1">
        <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Preferences
        </h2>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'general' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <SettingsIcon size={16} />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('playback')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'playback' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Sliders size={16} />
          <span>Playback & Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('subtitles')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'subtitles' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Subtitles size={16} />
          <span>Subtitles</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'library' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Film size={16} />
          <span>Library & Cache</span>
        </button>

        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'shortcuts' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Keyboard size={16} />
          <span>Shortcuts</span>
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'advanced' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Cpu size={16} />
          <span>Advanced</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'about' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Info size={16} />
          <span>About LS Player</span>
        </button>
      </div>

      {/* Main Settings Panel Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">General Settings</h2>
              <p className="text-xs text-slate-400">Configure core app behavior and UI theme preferences.</p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              {/* Theme Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Theme Mode</h3>
                  <p className="text-xs text-slate-400">Choose preferred appearance mode.</p>
                </div>
                <select
                  value={general.theme}
                  onChange={(e) => updateGeneral({ theme: e.target.value as any })}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 outline-none"
                >
                  <option value="dark">Dark Theme (Default)</option>
                  <option value="light">Light Theme</option>
                  <option value="system">Sync System Theme</option>
                </select>
              </div>

              <div className="border-t border-slate-800" />

              {/* Resume Playback */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Resume Playback</h3>
                  <p className="text-xs text-slate-400">Automatically jump to last watched timestamp when opening files.</p>
                </div>
                <input
                  type="checkbox"
                  checked={general.resumePlayback}
                  onChange={(e) => updateGeneral({ resumePlayback: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PLAYBACK TAB */}
        {activeTab === 'playback' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Playback & Hardware Engine</h2>
              <p className="text-xs text-slate-400">Configure decoding acceleration, jump intervals, and audio controls.</p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              {/* Hardware Acceleration */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Hardware Video Acceleration (DXVA2 / NVDEC)</h3>
                  <p className="text-xs text-slate-400">Enable GPU decoding for smooth 4K/8K HDR video rendering.</p>
                </div>
                <input
                  type="checkbox"
                  checked={playback.hardwareAcceleration}
                  onChange={(e) => updatePlayback({ hardwareAcceleration: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-800" />

              {/* Seek Interval */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Seek Jump Interval (Arrow Keys)</h3>
                  <p className="text-xs text-slate-400">Seconds to jump forward/backward on key press.</p>
                </div>
                <select
                  value={playback.seekIntervalShort}
                  onChange={(e) => updatePlayback({ seekIntervalShort: parseInt(e.target.value) })}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 outline-none"
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds (Default)</option>
                  <option value={10}>10 Seconds</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. SUBTITLES TAB */}
        {activeTab === 'subtitles' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Subtitle Styling & Options</h2>
              <p className="text-xs text-slate-400">Customize subtitle font size, color, background opacity, and placement.</p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              {/* Font Size */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Subtitle Font Size ({subtitles.style.fontSize}px)</h3>
                  <p className="text-xs text-slate-400">Adjust rendered subtitle text size.</p>
                </div>
                <input
                  type="range"
                  min="14"
                  max="42"
                  value={subtitles.style.fontSize}
                  onChange={(e) => updateSubtitleStyle({ fontSize: parseInt(e.target.value) })}
                  className="w-36 accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-800" />

              {/* Background Opacity */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Background Box Opacity ({Math.round(subtitles.style.backgroundOpacity * 100)}%)</h3>
                  <p className="text-xs text-slate-400">Controls contrast box behind subtitles.</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={subtitles.style.backgroundOpacity}
                  onChange={(e) => updateSubtitleStyle({ backgroundOpacity: parseFloat(e.target.value) })}
                  className="w-36 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. KEYBOARD SHORTCUTS TAB */}
        {activeTab === 'shortcuts' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts Reference</h2>
              <p className="text-xs text-slate-400">Fast keyboard controls for power users.</p>
            </div>

            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 text-xs">
              {[
                { key: 'Space / K', desc: 'Play or Pause Video' },
                { key: 'F', desc: 'Toggle Fullscreen Mode' },
                { key: 'Esc', desc: 'Exit Fullscreen or Close Player Overlay' },
                { key: 'M', desc: 'Mute or Unmute Audio' },
                { key: 'Right / Left Arrow', desc: 'Seek Forward / Backward 5 seconds' },
                { key: 'Up / Down Arrow', desc: 'Increase / Decrease Volume' },
                { key: 'J / L', desc: 'Seek Backward / Forward 10 seconds' },
                { key: '[ / ]', desc: 'Decrease / Increase Playback Speed' },
                { key: 'S', desc: 'Cycle Subtitle Track' },
                { key: 'A', desc: 'Cycle Audio Track' },
                { key: 'I', desc: 'View Media & Codec Information' },
                { key: 'Ctrl + O', desc: 'Open Local Media File' },
                { key: 'Ctrl + K', desc: 'Open Command Palette' },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5">
                  <span className="font-semibold text-slate-200">{s.desc}</span>
                  <kbd className="rounded bg-slate-800 border border-slate-700 px-2 py-1 font-mono font-bold text-cyan-400">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="flex flex-col items-center gap-6 text-center py-6">
            <LSLogo size={64} />
            <div>
              <h2 className="text-2xl font-bold text-white">LS Player Enterprise</h2>
              <p className="text-xs text-cyan-400 font-mono mt-1">Version 2.4.0 (Windows x64 Build)</p>
            </div>

            <p className="max-w-md text-xs text-slate-400 leading-relaxed">
              LS Player is a high-performance local media player engineered for Windows desktop with broad format compatibility, hardware accelerated decoding adapters, custom Fluent design aesthetics, and zero external tracking.
            </p>

            <button
              onClick={resetSettings}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              <RotateCcw size={14} />
              <span>Reset Settings to Defaults</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
