import React, { useState, useEffect } from "react";
import { Wifi, Signal, Battery, Bell } from "lucide-react";

interface Props {
  darkMode?: boolean;
  transparentBackground?: boolean;
}

export const AndroidStatusBar: React.FC<Props> = ({ darkMode = false, transparentBackground = false }) => {
  const [timeStr, setTimeStr] = useState("09:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const textColor = transparentBackground
    ? "text-white drop-shadow-md"
    : darkMode
    ? "text-zinc-200"
    : "text-zinc-800";

  return (
    <div
      id="android-status-bar"
      className={`w-full px-5 py-2.5 flex items-center justify-between text-xs font-semibold tracking-tight select-none z-50 ${
        transparentBackground ? "bg-gradient-to-b from-black/60 to-transparent" : darkMode ? "bg-zinc-950" : "bg-zinc-100"
      } ${textColor}`}
    >
      <div className="flex items-center space-x-2">
        <span>{timeStr}</span>
        <Bell className="w-3 h-3 opacity-70" />
      </div>

      <div className="flex items-center space-x-2.5">
        <span className="text-[10px] font-bold tracking-wider px-1 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
          5G
        </span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-medium">88%</span>
          <Battery className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </div>
  );
};
