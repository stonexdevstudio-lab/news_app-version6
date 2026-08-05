import React, { useState } from "react";
import { Article, ThemeConfig } from "../types";
import { Bookmark, Search, ArrowUpRight, Share2, Sparkles, CloudCheck, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  savedArticles: Article[];
  onOpenArticle: (article: Article) => void;
  onRemoveBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  onNavigateHome: () => void;
  themeConfig: ThemeConfig;
  isLoading?: boolean;
}

export const SavedView: React.FC<Props> = ({
  savedArticles,
  onOpenArticle,
  onRemoveBookmark,
  onOpenShare,
  onNavigateHome,
  themeConfig,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(savedArticles.map((a) => a.category)))];

  const filtered = savedArticles.filter((art) => {
    const matchesCategory = selectedCategoryFilter === "All" || art.category === selectedCategoryFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="saved-articles-section"
      className={`flex-1 w-full h-full flex flex-col pt-12 pb-20 px-4 overflow-y-auto ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-2xl bg-[#00BBA7]/10 text-[#00BBA7]">
              <Bookmark className="w-5 h-5 fill-[#00BBA7]" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Saved Stories</h2>
              <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-medium">
                <CloudCheck className="w-3 h-3 text-[#00BBA7]" />
                <span>Synced with Firestore Cloud</span>
              </div>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00BBA7]/15 text-[#00BBA7] border border-[#00BBA7]/30">
          {savedArticles.length} {savedArticles.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {/* Search Input Bar */}
      {savedArticles.length > 0 && (
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search saved articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs font-medium border outline-none transition-all ${
              themeConfig.darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-[#00BBA7]"
                : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#00BBA7]"
            }`}
          />
        </div>
      )}

      {/* Category Pills Filter */}
      {categories.length > 2 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? "bg-[#00BBA7] text-black shadow-sm"
                  : themeConfig.darkMode
                  ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                  : "bg-zinc-200 text-zinc-600 border border-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-3 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800 animate-pulse flex space-x-3"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-zinc-800 rounded" />
                <div className="w-1/2 h-3 bg-zinc-800/60 rounded" />
                <div className="w-1/3 h-3 bg-zinc-800/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto min-h-[300px]">
          <div className="p-4 rounded-full bg-zinc-800/50 text-zinc-400 mb-3 border border-zinc-700/50">
            <Bookmark className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-base font-bold">
            {savedArticles.length === 0 ? "No saved articles yet" : "No matches found"}
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-5">
            {savedArticles.length === 0
              ? "Tap the bookmark or like button on any news card in your feed to save it to your Firestore cloud library."
              : "Try clearing search filters or searching with a different term."}
          </p>
          {savedArticles.length === 0 && (
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#00BBA7] text-black flex items-center space-x-2 shadow-lg hover:bg-[#00cbb5] transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore News Feed</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5 mt-1">
          <AnimatePresence>
            {filtered.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3.5 rounded-3xl border transition-all flex flex-col gap-3 group hover:border-[#00BBA7]/40 ${
                  themeConfig.darkMode
                    ? "bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-900"
                    : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  {/* Article Thumbnail */}
                  <div
                    className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 cursor-pointer relative"
                    onClick={() => onOpenArticle(art)}
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-black/70 text-white backdrop-blur-sm">
                      {art.readTime}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-[#00BBA7] uppercase tracking-wider">
                          {art.category}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-[10px] text-zinc-500 line-clamp-1">
                          {art.publisher}
                        </span>
                      </div>
                      <h4
                        className="text-xs font-bold line-clamp-2 cursor-pointer hover:text-[#00BBA7] transition-colors leading-snug"
                        onClick={() => onOpenArticle(art)}
                      >
                        {art.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1">
                      {art.summary}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500">{art.publishedAt}</span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenShare(art)}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenArticle(art)}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#00BBA7] text-black flex items-center space-x-1 hover:bg-[#00cbb5] transition-colors"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
