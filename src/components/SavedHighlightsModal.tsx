import React from "react";
import { Article, TextHighlight, ThemeConfig } from "../types";
import { Bookmark, Highlighter, X, ArrowUpRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  highlights: TextHighlight[];
  onOpenArticle: (article: Article) => void;
  onRemoveBookmark: (article: Article) => void;
  onRemoveHighlight: (id: string) => void;
  themeConfig: ThemeConfig;
}

export const SavedHighlightsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedArticles,
  highlights,
  onOpenArticle,
  onRemoveBookmark,
  onRemoveHighlight,
  themeConfig
}) => {
  const [activeTab, setActiveTab] = React.useState<"articles" | "highlights">("articles");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`w-full max-w-md max-h-[80vh] rounded-3xl p-5 border shadow-2xl flex flex-col ${
            themeConfig.darkMode ? "bg-zinc-900 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-[#00BBA7] fill-[#00BBA7]" />
              <h3 className="text-base font-bold">Library & Highlights</h3>
            </div>
            <button id="saved-modal-close" onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex space-x-2 my-3 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "articles" ? "bg-white dark:bg-zinc-900 text-[#00BBA7] shadow-sm" : "text-zinc-500"
              }`}
            >
              Saved Stories ({savedArticles.length})
            </button>
            <button
              onClick={() => setActiveTab("highlights")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "highlights" ? "bg-white dark:bg-zinc-900 text-[#00BBA7] shadow-sm" : "text-zinc-500"
              }`}
            >
              Highlights ({highlights.length})
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {activeTab === "articles" ? (
              savedArticles.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No saved articles yet. Tap the bookmark icon on any card to save it.</p>
                </div>
              ) : (
                savedArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpenArticle(art)}>
                      <p className="text-xs font-bold line-clamp-1 hover:text-[#00BBA7] transition-colors">{art.title}</p>
                      <p className="text-[10px] text-zinc-500">{art.publisher} • {art.readTime}</p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onOpenArticle(art)}
                        className="px-3 py-1.5 rounded-full bg-[#00BBA7] text-black font-extrabold text-xs hover:bg-[#00cbb5] transition-all flex items-center space-x-1"
                        title="Read Story"
                      >
                        <span>Read</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : highlights.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-500">
                <Highlighter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No text highlights created yet. Tap inside article text to highlight sentences.</p>
              </div>
            ) : (
              highlights.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-2xl bg-[#00BBA7]/10 border border-[#00BBA7]/30 text-xs relative group"
                >
                  <p className="font-semibold italic mb-1">"{h.text}"</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="truncate">{h.articleTitle}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
