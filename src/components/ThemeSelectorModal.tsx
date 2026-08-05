import React from "react";
import { ThemeConfig, ThemePalette } from "../types";
import { X, Palette, Moon, Sun, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onUpdateTheme: (updated: Partial<ThemeConfig>) => void;
}

const PALETTE_OPTIONS: { id: ThemePalette; name: string; colorClass: string; desc: string }[] = [
  { id: "teal", name: "Dynamic Teal", colorClass: "bg-teal-500", desc: "Material You default aquatic seed" },
  { id: "peach", name: "Sunset Coral", colorClass: "bg-rose-500", desc: "Warm vibrant peach & rose contrast" },
  { id: "violet", name: "Deep Violet", colorClass: "bg-indigo-600", desc: "Modern indigo & amethyst spectrum" },
  { id: "forest", name: "Forest Mint", colorClass: "bg-emerald-600", desc: "Natural organic sage & emerald" },
  { id: "monet", name: "Sky Monet", colorClass: "bg-sky-500", desc: "Android 15 Monet dynamic light blue" }
];

export const ThemeSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  themeConfig,
  onUpdateTheme
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl ${
            themeConfig.darkMode ? "bg-zinc-900 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold">Material You Theme</h3>
            </div>
            <button id="theme-modal-close" onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dark / Light Mode Switch */}
          <div className="mb-5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
              Color Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <button
                onClick={() => onUpdateTheme({ darkMode: false })}
                className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  !themeConfig.darkMode ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => onUpdateTheme({ darkMode: true })}
                className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  themeConfig.darkMode ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500"
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Dynamic Palette Seed Options */}
          <div className="mb-5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
              Dynamic Palette Seed
            </label>
            <div className="space-y-2">
              {PALETTE_OPTIONS.map((opt) => {
                const isSelected = themeConfig.palette === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateTheme({ palette: opt.id })}
                    className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? "border-amber-500/80 bg-amber-500/10"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full ${opt.colorClass} shadow-sm`} />
                      <div>
                        <p className="text-xs font-bold">{opt.name}</p>
                        <p className="text-[10px] text-zinc-500">{opt.desc}</p>
                      </div>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Android Device Frame Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
              Device Preview Frame
            </label>
            <button
              onClick={() => onUpdateTheme({ useDeviceFrame: !themeConfig.useDeviceFrame })}
              className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                themeConfig.useDeviceFrame
                  ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center space-x-2 text-xs">
                <Smartphone className="w-4 h-4" />
                <span>Pixel 8 Device Frame</span>
              </div>
              <span className="text-xs font-bold">{themeConfig.useDeviceFrame ? "ENABLED" : "FULLSCREEN"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
