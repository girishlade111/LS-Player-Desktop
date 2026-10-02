# LS Player (Desktop)

A modern, sleek cross-platform media player built with **React 19 + Vite + Tailwind CSS 4**, packaged as a native desktop app with **Tauri 2**. LS Player offers a VLC-style experience with a polished, customizable UI — playlists, playback controls, subtitles, audio/video settings, and more.

The same React frontend can also be built as a static web demo — a live demo is linked below.

## Features

- **Modern media playback UI** — clean player shell with custom window chrome (frameless, transparent, centered window)
- **Playback controls** — play/pause, seek, volume, speed, fullscreen (via `components/player/`)
- **Playlists & queue management** — drag-and-drop files/folders, persisted state via Zustand stores
- **Settings & dialogs** — VLC-style settings dialogs, subtitle handling, preferences (`components/settings`, `components/vlc-dialogs`)
- **Playback engine** — pluggable engine layer under `src/engine/` with hooks (`src/hooks/`)
- **Dark, polished design** — Tailwind CSS 4, Radix UI primitives, Framer Motion animations, Lucide icons
- **Native desktop packaging** — Tauri 2 config (`src-tauri/`): bundles to installers for Windows, macOS, Linux

## Tech Stack

| Layer    | Tech                                   |
|----------|----------------------------------------|
| Frontend | React 19, TypeScript, Vite 8           |
| Styling  | Tailwind CSS 4, Radix UI, Framer Motion |
| State    | Zustand                                |
| Lint     | Oxlint                                 |
| Desktop  | Tauri 2 (Rust, `src-tauri/`)           |

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- (For native builds) Rust toolchain + Tauri system dependencies — see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/)

### Run in the browser (web dev server)

```bash
npm install
npm run dev        # http://localhost:5173
```

### Build the web demo (static)

```bash
npm run build       # outputs to dist/
npm run preview     # preview the static build
```

### Build the desktop app

```bash
npm install -g @tauri-apps/cli   # or npx tauri
npx tauri build                  # native installer in src-tauri/target/release/bundle
```

## Project Structure

```
LS-Player-Desktop/
├── src/                      # React frontend
│   ├── components/
│   │   ├── layout/           # AppShell, window chrome
│   │   ├── player/           # Player controls, progress, volume
│   │   ├── dialogs/          # Open file / URL dialogs
│   │   ├── vlc-dialogs/      # VLC-style dialogs
│   │   ├── settings/         # Preferences panels
│   │   └── ui/               # Reusable UI primitives (Radix-based)
│   ├── engine/               # Playback engine abstraction
│   ├── stores/               # Zustand stores (playlist, player, settings)
│   ├── hooks/                # React hooks
│   ├── lib/ utils/ types/    # Helpers, types
│   └── assets/ styles/       # Media assets, global CSS
├── src-tauri/                # Tauri 2 native shell
│   ├── tauri.conf.json       # Window config, bundle targets, icons
│   ├── Cargo.toml            # Rust deps
│   └── src/                  # Rust main
├── public/                   # Static assets
├── vite.config.ts            # Vite config (base set for GitHub Pages)
└── package.json
```

## Deploy Notes

- The web frontend builds to a static `dist/` via `npm run build` (pure client-side, no server required).
- Deployed as a static site on **GitHub Pages** at `https://girishlade111.github.io/LS-Player-Desktop/` — the built output is committed on the default branch so Pages can serve it.
- Native desktop installers require a local Tauri build (`npx tauri build`); CI/CD per-platform runners can produce the artifacts as GitHub Releases.

## License

Free for personal use. See repository for details.

---

**Built by Girish Lade** — [ladestack.in](https://ladestack.in)
