import React, { useState } from "react";
import { Article, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { Highlighter, Share2, Bookmark, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  selectedText: string | null;
  paragraphIndex: number | null;
  article: Article;
  onHighlight: (text: string, color: "yellow" | "teal" | "purple" | "coral", pIndex: number) => void;
  onOpenShare: (article: Article) => void;
  onToggleSave: (article: Article) => void;
  onCloseBar: () => void;
  themeConfig: ThemeConfig;
}

export const FloatingBottomActionBar: React.FC<Props> = ({
  selectedText,
  paragraphIndex,
  article,
  onHighlight,
  onOpenShare,
  onToggleSave,
  onCloseBar,
  themeConfig
}) => {
  const [highlightSuccess, setHighlightSuccess] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  if (!selectedText) return null;

  const handleApplyHighlight = (color: "yellow" | "teal" | "purple" | "coral") => {
    if (paragraphIndex !== null) {
      onHighlight(selectedText, color, paragraphIndex);
      setHighlightSuccess(true);
      setTimeout(() => setHighlightSuccess(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="floating-bottom-action-bar"
        initial={{ y: "100%", opacity: 1 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="fixed bottom-12 left-0 right-0 z-50 px-4 max-w-lg mx-auto pointer-events-auto"
      >
        <div
          className={`p-3 rounded-full border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2 ${
            themeConfig.darkMode
              ? "bg-zinc-900/95 border-zinc-700/80 text-zinc-100 shadow-black/80"
              : "bg-white/95 border-zinc-300 text-zinc-900 shadow-xl"
          }`}
        >
          {/* Active Text Preview Badge */}
          <div className="flex-1 min-w-0 px-2 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <p className="text-xs font-semibold truncate italic opacity-90">
              "{selectedText.substring(0, 42)}..."
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* 1. HIGHLIGHT Button with Color Picker Popover */}
            <div className="relative">
              <button
                id="floating-action-highlight"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 transition-all ${
                  highlightSuccess
                    ? "bg-emerald-500 text-white"
                    : themeConfig.darkMode
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200"
                }`}
                title="Highlight Text"
              >
                {highlightSuccess ? <Check className="w-3.5 h-3.5" /> : <Highlighter className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{highlightSuccess ? "Highlighted" : "Highlight"}</span>
              </button>

              {/* Highlight Color Picker Popover */}
              {showColorPicker && (
                <div className="absolute bottom-12 left-0 bg-zinc-900 text-white p-2 rounded-2xl shadow-xl border border-zinc-700 flex items-center space-x-2 z-50">
                  <button
                    onClick={() => {
                      handleApplyHighlight("yellow");
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full bg-yellow-400 hover:scale-110 transition-transform"
                    title="Yellow Highlight"
                  />
                  <button
                    onClick={() => {
                      handleApplyHighlight("teal");
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full bg-teal-400 hover:scale-110 transition-transform"
                    title="Teal Highlight"
                  />
                  <button
                    onClick={() => {
                      handleApplyHighlight("purple");
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full bg-purple-400 hover:scale-110 transition-transform"
                    title="Purple Highlight"
                  />
                  <button
                    onClick={() => {
                      handleApplyHighlight("coral");
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full bg-rose-400 hover:scale-110 transition-transform"
                    title="Coral Highlight"
                  />
                </div>
              )}
            </div>

            {/* 2. SHARE Button */}
            <button
              id="floating-action-share"
              onClick={() => onOpenShare(article)}
              className={`p-2 rounded-full transition-all ${
                themeConfig.darkMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-700"
              }`}
              title="Share Text & Article"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* 3. SAVE Button */}
            <button
              id="floating-action-save"
              onClick={() => onToggleSave(article)}
              className={`p-2 rounded-full transition-all ${
                article.isBookmarked
                  ? "bg-rose-500/20 text-rose-500"
                  : themeConfig.darkMode
                  ? "hover:bg-zinc-800 text-zinc-300"
                  : "hover:bg-zinc-100 text-zinc-700"
              }`}
              title={article.isBookmarked ? "Saved" : "Save Article"}
            >
              <Bookmark className={`w-4 h-4 ${article.isBookmarked ? "fill-rose-500" : ""}`} />
            </button>

            {/* Close Button */}
            <button
              id="floating-action-close"
              onClick={onCloseBar}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
