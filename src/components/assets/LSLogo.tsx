import React from 'react';

interface LSLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const LSLogo: React.FC<LSLogoProps> = ({ size = 32, className = '', showText = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Inner Dark Core */}
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90 backdrop-blur-sm">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3/4 w-3/4 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
          >
            {/* Geometric L shape stroke */}
            <path
              d="M8 8V23C8 23.5523 8.44772 24 9 24H17"
              stroke="url(#ls-grad-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Abstract S curve & Play Mark */}
            <path
              d="M12 11.5L22 16L12 20.5V11.5Z"
              fill="url(#ls-grad-2)"
            />
            <defs>
              <linearGradient id="ls-grad-1" x1="8" y1="8" x2="17" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="ls-grad-2" x1="12" y1="11.5" x2="22" y2="20.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-wider text-slate-100 font-sans">
            LS <span className="text-cyan-400 font-extrabold">PLAYER</span>
          </span>
          <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
            Enterprise Desktop
          </span>
        </div>
      )}
    </div>
  );
};
