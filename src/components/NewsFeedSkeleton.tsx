import React from "react";
import { ThemeConfig } from "../types";

interface Props {
  themeConfig: ThemeConfig;
}

export const NewsFeedSkeleton: React.FC<Props> = ({ themeConfig }) => {
  const isDark = themeConfig.darkMode;

  return (
    <div className="w-full max-w-md h-full flex flex-col justify-between p-4 sm:p-5 rounded-3xl border shadow-xl animate-pulse transition-all bg-zinc-900/90 border-zinc-800">
      {/* Top Header Row Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          {/* Publisher Avatar */}
          <div className="w-8 h-8 rounded-full bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="w-24 h-3 rounded bg-zinc-800" />
            <div className="w-16 h-2 rounded bg-zinc-800/60" />
          </div>
        </div>
        {/* Category Pill Skeleton */}
        <div className="w-20 h-6 rounded-full bg-zinc-800" />
      </div>

      {/* Main Image Banner Skeleton */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-zinc-800 overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Title & Subtitle Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="w-full h-5 rounded-md bg-zinc-800" />
        <div className="w-4/5 h-5 rounded-md bg-zinc-800" />
        <div className="w-3/5 h-3 rounded-md bg-zinc-800/60 mt-1" />
      </div>

      {/* Summary Content Lines Skeleton */}
      <div className="space-y-2 flex-1 my-2">
        <div className="w-full h-3 rounded bg-zinc-800/80" />
        <div className="w-11/12 h-3 rounded bg-zinc-800/80" />
        <div className="w-4/5 h-3 rounded bg-zinc-800/80" />
      </div>

      {/* Bottom Action Controls Skeleton */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Like button */}
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
          {/* Bookmark button */}
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
          {/* Share button */}
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
        </div>
        {/* Read Article Pill */}
        <div className="w-28 h-10 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
};
