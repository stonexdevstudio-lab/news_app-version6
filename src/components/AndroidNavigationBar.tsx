import React from "react";

interface Props {
  darkMode?: boolean;
}

export const AndroidNavigationBar: React.FC<Props> = ({ darkMode = false }) => {
  return (
    <div
      id="android-nav-bar"
      className={`w-full py-2.5 flex items-center justify-center select-none z-50 ${
        darkMode ? "bg-zinc-950" : "bg-zinc-100"
      }`}
    >
      <div
        className={`w-32 h-1.5 rounded-full transition-all duration-300 ${
          darkMode ? "bg-zinc-500 hover:bg-zinc-300" : "bg-zinc-400 hover:bg-zinc-600"
        }`}
      />
    </div>
  );
};
