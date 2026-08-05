import React, { useState, useRef, useEffect } from "react";
import { Article, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Music,
  Film
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "motion/react";

interface Props {
  articles: Article[];
  onToggleBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  onOpenArticle: (article: Article) => void;
  themeConfig: ThemeConfig;
}

const REEL_VIDEOS = [
  {
    id: "reel-1",
    title: "Inside Google's Next-Gen Quantum Lab: A Video Deep-Dive",
    category: "Technology",
    publisher: "Express News Video",
    writer: "Klaus Lindner",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    likesCount: 3200,
    sharesCount: 940,
    audioTrack: "Original Sound - Express Quantum Desk",
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "reel-2",
    title: "SpaceX Starship Orbital Flight Test & Plasma Entry Highlights",
    category: "Science & Space",
    publisher: "Express Space",
    writer: "Dr. Samantha Reed",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    likesCount: 6100,
    sharesCount: 2100,
    audioTrack: "Starship Audio - Live Telemetry Stream",
    isLiked: false,
    isBookmarked: true
  },
  {
    id: "reel-3",
    title: "WebGPU Acceleration Unleashes On-Device AI Models for Browsers",
    category: "AI & Future",
    publisher: "Express AI Tech",
    writer: "Dr. Marcus Vance",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    likesCount: 4500,
    sharesCount: 1200,
    audioTrack: "Neural Pulse Synth - AI Lab Audio",
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "reel-4",
    title: "Global Clean Energy Surge: Solar & Offshore Wind Breaks Records",
    category: "World News",
    publisher: "Express World Desk",
    writer: "Amara Okezie",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
    likesCount: 2890,
    sharesCount: 780,
    audioTrack: "Ambient Nature - Clean Grid Beats",
    isLiked: false,
    isBookmarked: false
  }
];

export const NewsReelsView: React.FC<Props> = ({
  articles,
  onToggleBookmark,
  onOpenShare,
  onOpenArticle,
  themeConfig
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [reelsState, setReelsState] = useState(REEL_VIDEOS);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down">("up");

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reelsState[currentIndex];
  const nextReel = currentIndex < reelsState.length - 1 ? reelsState[currentIndex + 1] : reelsState[0];

  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReelsState((prev) =>
      prev.map((r, i) =>
        i === currentIndex
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1
            }
          : r
      )
    );
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleNext = () => {
    setSwipeDirection("up");
    if (currentIndex < reelsState.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    setSwipeDirection("down");
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 40;
    const velocityThreshold = 200;
    if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
      handleNext();
    } else if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
      handlePrev();
    }
  };

  // Convert reel to article for full modal reading or sharing
  const getArticleFromReel = (): Article => {
    const matching = articles.find((a) => a.title === currentReel.title);
    if (matching) return matching;

    return {
      id: currentReel.id,
      cardType: "video",
      title: currentReel.title,
      subtitle: currentReel.title,
      category: currentReel.category as any,
      author: { name: currentReel.writer, avatar: "", role: "Video Journalist" },
      publisher: currentReel.publisher,
      publishedAt: "Just now",
      readTime: "2 min watch",
      imageUrl: currentReel.posterUrl,
      videoUrl: currentReel.videoUrl,
      summary: currentReel.title,
      keyTakeaways: [currentReel.title],
      content: [currentReel.title],
      likesCount: currentReel.likesCount,
      sharesCount: currentReel.sharesCount,
      isBookmarked: currentReel.isBookmarked,
      isLiked: currentReel.isLiked
    };
  };

  return (
    <div className="absolute inset-0 z-30 bg-black text-white flex flex-col justify-between overflow-hidden pb-16">
      {/* Top Reel Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-amber-500 text-black animate-pulse">
            <Film className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">News Reels</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
            LIVE
          </span>
        </div>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Main Swipeable Fullscreen Video Stage */}
      <div className="relative w-full h-full flex-1 bg-black overflow-hidden">
        
        {/* Background Next Reel Preview */}
        {nextReel && (
          <div className="absolute inset-0 z-10 opacity-30 scale-95 pointer-events-none">
            <img src={nextReel.posterUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Swipable Active Reel Container */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentReel.id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            initial={
              swipeDirection === "up"
                ? { y: "100%", opacity: 0.9 }
                : { y: "-100%", opacity: 0.9 }
            }
            animate={{ y: "0%", opacity: 1 }}
            exit={
              swipeDirection === "up"
                ? { y: "-100%", opacity: 0.3 }
                : { y: "100%", opacity: 0.3 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={handleTogglePlay}
            className="absolute inset-0 z-20 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
          >
            <video
              ref={videoRef}
              src={currentReel.videoUrl}
              poster={currentReel.posterUrl}
              playsInline
              loop
              autoPlay
              muted={isMuted}
              className="w-full h-full object-cover pointer-events-none"
              onEnded={handleNext}
            />

            {/* Vignette Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

            {/* Play/Pause Center Overlay Animation */}
            {!isPlaying && (
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 pointer-events-none">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            )}

            {/* Heart Animation Overlay */}
            {showHeartAnim && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 m-auto w-20 h-20 text-amber-500 flex items-center justify-center pointer-events-none z-50"
              >
                <Heart className="w-20 h-20 fill-amber-500 drop-shadow-2xl" />
              </motion.div>
            )}

            {/* Right Action Sidebar Controls (Like, Bookmark, Share - NO AI READ BUTTON) */}
            <div className="absolute right-3.5 bottom-28 z-40 flex flex-col items-center space-y-5">
              {/* Like Button */}
              <button onClick={handleLike} className="flex flex-col items-center group">
                <div
                  className={`p-3 rounded-full backdrop-blur-md border transition-all active:scale-75 ${
                    currentReel.isLiked
                      ? "bg-amber-500/90 border-amber-400 text-black shadow-lg shadow-amber-500/40"
                      : "bg-black/50 border-white/20 text-white group-hover:bg-black/70"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${currentReel.isLiked ? "fill-black" : ""}`} />
                </div>
                <span className="text-[10px] font-bold mt-1 drop-shadow">{currentReel.likesCount}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(getArticleFromReel());
                  setReelsState((prev) =>
                    prev.map((r, i) => (i === currentIndex ? { ...r, isBookmarked: !r.isBookmarked } : r))
                  );
                }}
                className="flex flex-col items-center group"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md border transition-all active:scale-75 ${
                    currentReel.isBookmarked
                      ? "bg-amber-500/90 border-amber-400 text-black shadow-lg shadow-amber-500/40"
                      : "bg-black/50 border-white/20 text-white group-hover:bg-black/70"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${currentReel.isBookmarked ? "fill-black" : ""}`} />
                </div>
                <span className="text-[10px] font-bold mt-1 drop-shadow">Save</span>
              </button>

              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShare(getArticleFromReel());
                }}
                className="flex flex-col items-center group"
              >
                <div className="p-3 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white group-hover:bg-black/70 transition-all active:scale-75">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-1 drop-shadow">{currentReel.sharesCount}</span>
              </button>

              {/* Spinning Audio Record Disk */}
              <div className="pt-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center animate-spin overflow-hidden shadow-xl">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Bottom Reel Caption Bar (NO AUTHOR ICONS OR FOLLOW BUTTON) */}
            <div className="absolute left-3.5 bottom-28 right-16 z-40 text-left">
              {/* Category Badge */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow">
                  {currentReel.category}
                </span>
                <span className="text-xs font-semibold text-zinc-300 drop-shadow">
                  {currentReel.publisher}
                </span>
              </div>

              {/* Headline Title */}
              <h2
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenArticle(getArticleFromReel());
                }}
                className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-md cursor-pointer hover:text-amber-400 transition-colors mb-2"
              >
                {currentReel.title}
              </h2>

              {/* Audio Track Marquee */}
              <div className="flex items-center space-x-2 text-[11px] text-zinc-300 font-medium">
                <Music className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[200px]">{currentReel.audioTrack}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
