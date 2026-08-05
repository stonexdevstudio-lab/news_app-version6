import React from "react";
import { ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { Film, RefreshCw, Newspaper } from "lucide-react";

interface Props {
  themeConfig: ThemeConfig;
  onResetFeed?: () => void;
  onToggleDeviceFrame?: () => void;
}

export const MaterialTopAppBar: React.FC<Props> = ({
  themeConfig,
  onResetFeed,
}) => {
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  return (
    <header
      id="material-top-app-bar"
      className={`w-full py-2.5 px-3.5 transition-colors duration-300 border-b flex items-center justify-between ${
        themeConfig.darkMode
          ? "bg-zinc-950/95 border-zinc-900 text-zinc-100"
          : "bg-white/95 border-zinc-200/80 text-zinc-900"
      } backdrop-blur-md sticky top-0 z-40`}
    >
      {/* Brand Title & Icon */}
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-xl shadow-md bg-[#00BBA7] text-black font-extrabold">
          <Film className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <span className="text-sm font-extrabold tracking-tight">FlickPulse</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {onResetFeed && (
          <button
            onClick={onResetFeed}
            className={`p-1.5 rounded-xl transition-all active:scale-90 ${
              themeConfig.darkMode
                ? "hover:bg-zinc-800 text-zinc-300 active:bg-zinc-700"
                : "hover:bg-zinc-100 text-zinc-700 active:bg-zinc-200"
            }`}
            title="Reload Deck"
          >
            <RefreshCw className="w-4 h-4 text-[#00BBA7]" />
          </button>
        )}
      </div>
    </header>
  );
};


