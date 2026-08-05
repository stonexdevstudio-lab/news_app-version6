import React, { useState } from "react";
import { Article, ThemeConfig } from "../types";
import { NewsCard } from "./NewsCard";
import { NewsFeedSkeleton } from "./NewsFeedSkeleton";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Layers, RefreshCw, CheckCircle2, ArrowDown } from "lucide-react";

interface Props {
  articles: Article[];
  onExpandArticle: (article: Article) => void;
  onToggleBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  onTapBodyText?: () => void;
  themeConfig: ThemeConfig;
  onResetStack: () => void;
  isNavVisible?: boolean;
  isLoading?: boolean;
}

export const NewsCardDeck: React.FC<Props> = ({
  articles,
  onExpandArticle,
  onToggleBookmark,
  onOpenShare,
  onTapBodyText,
  themeConfig,
  onResetStack,
  isNavVisible = true,
  isLoading = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down">("up");
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);

  if (isLoading) {
    return (
      <div className={`relative flex-1 w-full h-full flex flex-col items-center justify-center px-4 transition-all duration-300 overflow-hidden ${
        isNavVisible ? "pt-14 pb-16" : "pt-2 pb-2"
      }`}>
        <NewsFeedSkeleton themeConfig={themeConfig} />
      </div>
    );
  }

  const safeIndex = Math.max(0, Math.min(currentIndex, articles ? articles.length - 1 : 0));
  const activeArticle = articles ? articles[safeIndex] : undefined;
  const nextArticle = articles && safeIndex < articles.length - 1 ? articles[safeIndex + 1] : null;

  if (!articles || articles.length === 0 || !activeArticle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px] pb-20">
        <Layers className="w-12 h-12 text-zinc-400 mb-3 animate-bounce" />
        <h3 className="text-lg font-bold">No articles in this feed</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-4">
          Try changing the category or clearing search filters to see more news cards.
        </p>
        <button
          onClick={onResetStack}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#00BBA7] text-black flex items-center space-x-1.5 shadow-md hover:bg-[#00cbb5] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Feed</span>
        </button>
      </div>
    );
  }

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(0);
    setTimeout(() => {
      setIsRefreshing(false);
      setCurrentIndex(0);
      onResetStack();
      setShowRefreshToast(true);
      setTimeout(() => setShowRefreshToast(false), 3000);
    }, 1200);
  };

  const handleNext = () => {
    if (safeIndex < articles.length - 1) {
      setSwipeDirection("up");
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setSwipeDirection("down");
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (safeIndex === 0 && info.offset.y > 0 && !isRefreshing) {
      setPullDistance(Math.min(100, info.offset.y));
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 40;
    const velocityThreshold = 200;

    if (safeIndex === 0 && (info.offset.y >= 65 || pullDistance >= 65) && !isRefreshing) {
      triggerRefresh();
      return;
    }

    setPullDistance(0);

    if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
      handleNext();
    } else if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
      handlePrev();
    }
  };

  const pullProgress = Math.min(1, pullDistance / 65);

  return (
    <div
      id="news-card-deck"
      className={`relative flex-1 w-full h-full flex flex-col items-center justify-center px-1 sm:px-2 transition-all duration-300 overflow-hidden select-none ${
        isNavVisible ? "pt-14 pb-16" : "pt-1 pb-1"
      }`}
    >
      {/* Pull-To-Refresh Indicator at Top */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-14 z-40 px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-[#00BBA7] backdrop-blur-md border border-[#00BBA7]/30 text-xs font-bold flex items-center space-x-2 shadow-xl"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#00BBA7] ${isRefreshing ? "animate-spin" : ""}`}
              style={{
                transform: !isRefreshing ? `rotate(${pullProgress * 180}deg)` : undefined
              }}
            />
            <span>
              {isRefreshing
                ? "Fetching new stories..."
                : pullProgress >= 1
                ? "Release to refresh feed"
                : "Pull down to refresh"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification on Successful Feed Refresh */}
      <AnimatePresence>
        {showRefreshToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="absolute top-14 z-50 px-4 py-2 rounded-full bg-[#00BBA7] text-black text-xs font-extrabold flex items-center space-x-2 shadow-2xl"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>Feed updated with fresh cinema stories!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container holding card stack with bottom nav bar clearance */}
      <div className="relative w-full max-w-md h-full flex-1 flex items-center justify-center overflow-hidden">
        {/* Foreground Active Card */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeArticle.id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={
              swipeDirection === "up"
                ? { y: "100%", opacity: 0.9, scale: 0.98 }
                : { y: "-100%", opacity: 0.9, scale: 0.98 }
            }
            animate={{
              y: isRefreshing ? 20 : "0%",
              scale: 1,
              opacity: 1
            }}
            exit={
              swipeDirection === "up"
                ? { y: "-100%", opacity: 0.2, scale: 0.95 }
                : { y: "100%", opacity: 0.2, scale: 0.95 }
            }
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
              mass: 0.8
            }}
            className="w-full h-full relative z-20 cursor-grab active:cursor-grabbing"
          >
            <NewsCard
              article={activeArticle}
              onExpandArticle={onExpandArticle}
              onToggleBookmark={onToggleBookmark}
              onOpenShare={onOpenShare}
              onTapBodyText={onTapBodyText}
              themeConfig={themeConfig}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

