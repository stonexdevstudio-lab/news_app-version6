import React from "react";
import { ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { Home, Compass, User, Film, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

export type NavTab = "home" | "reels" | "explore" | "profile";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  themeConfig: ThemeConfig;
  isVisible: boolean;
  savedCount?: number;
}

export const BottomNavBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  themeConfig,
  isVisible
}) => {
  if (!isVisible) return null;

  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  const tabs: { id: NavTab; icon: React.FC<{ className?: string }>; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "reels", icon: Film, label: "Reels" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "profile", icon: User, label: "Profile" }
  ];

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`absolute bottom-0 left-0 right-0 w-full z-40 border-t backdrop-blur-xl transition-colors ${
        themeConfig.darkMode
          ? "bg-zinc-950/95 border-zinc-900 text-zinc-100"
          : "bg-white/95 border-zinc-200/90 text-zinc-900"
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 relative ${
                isActive
                  ? "text-[#00BBA7] font-bold"
                  : themeConfig.darkMode
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all relative ${
                  isActive ? "bg-[#00BBA7] text-black font-extrabold shadow-md shadow-[#00BBA7]/30" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

