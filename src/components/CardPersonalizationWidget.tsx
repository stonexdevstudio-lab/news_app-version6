import React, { useState } from "react";
import { Article, ThemeConfig } from "../types";
import { ThumbsUp, ThumbsDown, Sparkles, Check, RotateCcw, Frown, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  article: Article;
  themeConfig: ThemeConfig;
  onInterestFeedback?: (articleId: string, preference: "interested" | "not_interested" | null) => void;
  compact?: boolean;
}

export const CardPersonalizationWidget: React.FC<Props> = ({
  article,
  themeConfig,
  onInterestFeedback,
  compact = false
}) => {
  const [interestState, setInterestState] = useState<"interested" | "not_interested" | null>(
    article.userInterest || null
  );

  const handleSelectInterest = (preference: "interested" | "not_interested") => {
    const newState = interestState === preference ? null : preference;
    setInterestState(newState);
    if (onInterestFeedback) {
      onInterestFeedback(article.id, newState);
    }
  };

  return (
    <div
      className={`w-full mt-2 transition-all ${
        compact ? "py-1" : "py-1.5"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {interestState === "interested" ? (
          <motion.div
            key="interested-feedback"
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold shadow-md backdrop-blur-md"
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              <Smile className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
              <span className="truncate">
                Interested! We'll show more <strong className="text-white font-extrabold">{article.category}</strong>
              </span>
            </div>
            <button
              onClick={() => handleSelectInterest("interested")}
              className="ml-2 text-emerald-400 hover:text-white underline text-[10px] shrink-0 flex items-center space-x-0.5"
              title="Undo choice"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo</span>
            </button>
          </motion.div>
        ) : interestState === "not_interested" ? (
          <motion.div
            key="not-interested-feedback"
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold shadow-md backdrop-blur-md"
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              <Frown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">
                Got it! Showing fewer <strong className="text-white font-extrabold">{article.category}</strong> cards
              </span>
            </div>
            <button
              onClick={() => handleSelectInterest("not_interested")}
              className="ml-2 text-rose-400 hover:text-white underline text-[10px] shrink-0 flex items-center space-x-0.5"
              title="Undo choice"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="default-ask-feedback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
              themeConfig.darkMode
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
                : "bg-zinc-100/90 border-zinc-200 text-zinc-700"
            }`}
          >
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0 animate-pulse" />
              <span className="truncate text-[10.5px]">Personalize feed?</span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Interested Button */}
              <button
                onClick={() => handleSelectInterest("interested")}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold flex items-center space-x-1 transition-all active:scale-95 ${
                  themeConfig.darkMode
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
                title="Show more content like this"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Interested</span>
              </button>

              {/* Not Interested Button */}
              <button
                onClick={() => handleSelectInterest("not_interested")}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold flex items-center space-x-1 transition-all active:scale-95 ${
                  themeConfig.darkMode
                    ? "bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
                title="Show less content like this"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>Not Interested</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
