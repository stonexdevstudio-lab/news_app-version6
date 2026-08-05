import React, { useState, useRef } from "react";
import { Article, ThemeConfig, Poll } from "../types";
import { PALETTES } from "../utils/theme";
import { Bookmark, Share2, Play, Pause, Film, Volume2, VolumeX, BarChart2, Images, ChevronLeft, ChevronRight, Star, Clapperboard, Globe } from "lucide-react";
import { PollWidget } from "./PollWidget";
import { PollCard } from "./PollCard";
import { CardPersonalizationWidget } from "./CardPersonalizationWidget";

const EMBEDDED_CARD_POLLS: Poll[] = [
  {
    id: "card-poll-1",
    question: "Hyped for L2 Empuraan in 2025?",
    options: [
      { id: "cp-o1", text: "🔥 Massive Hype", votes: 1240 },
      { id: "cp-o2", text: "👍 Will Watch", votes: 410 }
    ],
    totalVotes: 1650
  },
  {
    id: "card-poll-2",
    question: "Will L2 Empuraan break ₹200Cr Box Office worldwide?",
    options: [
      { id: "cp-o3", text: "✅ Yes easily", votes: 1980 },
      { id: "cp-o4", text: "❌ Not sure", votes: 310 }
    ],
    totalVotes: 2290
  },
  {
    id: "card-poll-3",
    question: "Who gave the best performance of the year?",
    options: [
      { id: "cp-o5", text: "👑 Fahadh Faasil (Aavesham)", votes: 1850 },
      { id: "cp-o6", text: "🎭 Mammootty (Bramayugam)", votes: 1620 }
    ],
    totalVotes: 3470
  },
  {
    id: "card-poll-4",
    question: "Should Malayalam cinema release same-day in GCC & Europe?",
    options: [
      { id: "cp-o7", text: "🌍 Yes, same-day global release", votes: 2150 },
      { id: "cp-o8", text: "🍿 India first, then GCC", votes: 420 }
    ],
    totalVotes: 2570
  }
];

interface Props {
  article: Article;
  onExpandArticle: (article: Article) => void;
  onToggleBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  onTapBodyText?: () => void;
  themeConfig: ThemeConfig;
  isActive?: boolean;
  onInterestFeedback?: (articleId: string, preference: "interested" | "not_interested" | null) => void;
}

export const NewsCard: React.FC<Props> = ({
  article,
  onExpandArticle,
  onToggleBookmark,
  onOpenShare,
  onTapBodyText,
  themeConfig,
  isActive = true,
  onInterestFeedback
}) => {
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showGalleryActions, setShowGalleryActions] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const galleryImages = article.galleryImages && article.galleryImages.length > 0 ? article.galleryImages : [article.imageUrl];
  const galleryCaptions = article.galleryCaptions || [];

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const isMovieCard = article.cardType === "movie" || !!article.movieDetails;
  const isVideoCard = article.cardType === "video" || !!article.videoUrl;
  const isPollCard = article.cardType === "poll" && !!article.poll;
  const isGalleryCard = article.cardType === "gallery" || galleryImages.length > 1;

  return (
    <div
      id={`news-card-${article.id}`}
      className={`w-full h-full max-w-md mx-auto rounded-3xl overflow-hidden transition-all duration-300 ${
        isGalleryCard
          ? "border-0 shadow-none bg-black text-white"
          : themeConfig.darkMode
          ? "bg-zinc-900/95 border border-zinc-800 text-zinc-100 shadow-2xl shadow-black/70"
          : "bg-white border-0 text-zinc-900 shadow-lg shadow-zinc-300/30"
      } flex flex-col justify-between`}
    >
      {isGalleryCard ? (
        /* ----------------- 1. GALLERY CARD TYPE ----------------- */
        <div
          className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black text-white select-none group"
          onClick={() => {
            if (onTapBodyText) onTapBodyText();
          }}
          onTouchStart={(e) => {
            (window as any)._touchStartX = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const startX = (window as any)._touchStartX;
            if (startX !== undefined) {
              const diffX = e.changedTouches[0].clientX - startX;
              if (diffX < -40) {
                setGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
              } else if (diffX > 40) {
                setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
              }
            }
          }}
        >
          {/* Ambient Blurred Background Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-55 scale-110 transition-all duration-700 pointer-events-none"
            style={{ backgroundImage: `url(${galleryImages[galleryIndex]})` }}
          />
          {/* Dark Gradient Overlay for optimal contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none z-10" />

          {/* Foreground Main Image Stage (Bit smaller & object-contain for transparent designed text) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
            <img
              src={galleryImages[galleryIndex]}
              alt={article.title}
              className="max-w-[88%] max-h-[75%] object-contain rounded-2xl drop-shadow-2xl transition-all duration-500"
            />
          </div>

          {/* Top Header Overlay (Always Visible) */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00BBA7] text-black flex items-center space-x-1 shadow-lg">
              <Images className="w-3.5 h-3.5" />
              <span>Photo Gallery</span>
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-[#00BBA7] backdrop-blur-md border border-white/20 shadow">
              {galleryIndex + 1} / {galleryImages.length}
            </span>
          </div>

          {/* Left & Right Chevron Arrow Navigation Buttons */}
          {galleryImages.length > 1 && (
            <div className="z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage(e);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md border border-white/20 transition-all active:scale-90 z-30 shadow-xl"
                title="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage(e);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md border border-white/20 transition-all active:scale-90 z-30 shadow-xl"
                title="Next Photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Bottom Content & Navigation Overlay (Always Visible) */}
          <div className="relative z-20 p-4 sm:p-5 flex flex-col space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-8">
            {/* Centered Gallery Header Title */}
            <h2 className="text-center font-bold text-sm sm:text-base text-white drop-shadow-md line-clamp-2 px-2 leading-snug">
              {article.title}
            </h2>

            {/* Dot Navigation Bar (Centered, No border) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center space-x-1.5 self-center px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md shadow-md">
                {galleryImages.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === galleryIndex
                        ? "w-5 bg-[#00BBA7] shadow-sm shadow-[#00BBA7]/80"
                        : "w-1.5 bg-white/40 hover:bg-white/80"
                    }`}
                    title={`Go to photo ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Bottom Actions & Photo Counter Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/15">
              {/* Share & Bookmark buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article);
                  }}
                  className={`p-2 rounded-full backdrop-blur-md transition-all ${
                    article.isBookmarked
                      ? "bg-[#00BBA7] text-black shadow-lg shadow-[#00BBA7]/40"
                      : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                  title="Bookmark gallery"
                >
                  <Bookmark className={`w-4 h-4 ${article.isBookmarked ? "fill-black" : ""}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(article);
                  }}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-md"
                  title="Share gallery"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Number in the Bottom */}
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white shadow-lg">
                {galleryIndex + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        </div>
      ) : isMovieCard ? (
        /* ----------------- MOVIE REVIEW CARD TYPE ----------------- */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white">
          {/* Poster Header */}
          <div
            className="relative w-full h-[48%] min-h-[180px] bg-black overflow-hidden group cursor-pointer"
            onClick={() => onExpandArticle(article)}
          >
            <img
              src={article.movieDetails?.posterUrl || article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-black/60 pointer-events-none" />

            {/* Top Gold Badge & Rating */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-black flex items-center space-x-1 shadow-lg border border-amber-300">
                <Clapperboard className="w-3.5 h-3.5 fill-black" />
                <span>Movie Review</span>
              </span>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/40 text-xs font-black shadow-xl">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{article.movieDetails?.rating || 8.9} / 10</span>
              </div>
            </div>

            {/* Director & Year Badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-xs">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-200 border border-white/20 text-[10px] font-semibold">
                <span>Dir: {article.movieDetails?.director || article.author.name}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {article.movieDetails?.releaseYear || "2025"} • {article.movieDetails?.duration || "2h 30m"}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2
                onClick={() => onExpandArticle(article)}
                className="text-base sm:text-lg font-black tracking-tight leading-snug text-white cursor-pointer hover:text-amber-400 transition-colors line-clamp-2 mb-1.5"
              >
                {article.title}
              </h2>

              {/* Genres */}
              {article.movieDetails?.genres && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.movieDetails.genres.slice(0, 3).map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-amber-300 border border-zinc-700">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTapBodyText) onTapBodyText();
                }}
                className="text-xs text-zinc-300 line-clamp-2 cursor-pointer mb-3 leading-relaxed"
              >
                {article.subtitle || article.summary}
              </p>
            </div>

            {/* CTA Button to Open FlickMeter & Full Review */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => onExpandArticle(article)}
                className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Star className="w-4 h-4 fill-black" />
                <span>View Full Movie Review & Rate (IMDb Formula)</span>
              </button>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1 pt-1">
                <span>{article.movieDetails?.voteCount || "250K"} votes logged</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(article);
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${article.isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShare(article);
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isVideoCard ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Video Container */}
          <div className="relative w-full h-[52%] bg-black shrink-0 overflow-hidden group">
            <video
              ref={videoRef}
              src={article.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
              poster={article.imageUrl}
              playsInline
              loop
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Video Header Category Badge */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00BBA7] text-black flex items-center space-x-1 shadow">
                <Film className="w-3 h-3" />
                <span>Video Story</span>
              </span>
              {article.videoDuration && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-zinc-200 border border-white/20">
                  {article.videoDuration}
                </span>
              )}
            </div>

            {/* Play/Pause Overlay Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#00BBA7] text-black flex items-center justify-center shadow-2xl transition-transform active:scale-90 hover:scale-110 z-20"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
            </button>

            {/* Bottom Mute & Publisher Badge Bar */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold">
                <Film className="w-3 h-3 text-[#00BBA7] shrink-0" />
                <span className="truncate max-w-[150px]">{article.publisher || "FlickPulse Cinema"}</span>
              </div>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/20"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Video Text Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto min-h-0">
            <div>
              <h2
                onClick={() => onExpandArticle(article)}
                className="text-base sm:text-lg font-bold tracking-tight leading-snug cursor-pointer hover:text-[#00BBA7] transition-colors mb-2"
              >
                {article.title}
              </h2>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTapBodyText) onTapBodyText();
                }}
                className={`text-xs sm:text-sm line-clamp-3 mb-2 cursor-pointer ${
                  themeConfig.darkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {article.subtitle || article.summary}
              </p>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/40 dark:border-zinc-800/60 mt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    article.isBookmarked
                      ? "bg-[#00BBA7]/20 text-[#00BBA7]"
                      : themeConfig.darkMode
                      ? "hover:bg-zinc-800 text-zinc-400"
                      : "hover:bg-zinc-100 text-zinc-600"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${article.isBookmarked ? "fill-[#00BBA7]" : ""}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(article);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    themeConfig.darkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-zinc-400">{article.publishedAt}</span>
            </div>
          </div>
        </div>
      ) : isPollCard ? (
        /* ----------------- 2. INDEPENDENT POLL CARD TYPE (WHITE THEME) ----------------- */
        <div className="w-full h-full p-2 bg-zinc-100 dark:bg-zinc-950 flex flex-col justify-center">
          <PollCard
            poll={{
              id: article.poll?.id || article.id,
              question: article.poll?.question || article.title,
              category: article.poll?.category || article.category,
              badge: article.poll?.badge || "Live Vote",
              totalVotes: article.poll?.totalVotes || 0,
              options: article.poll?.options || [],
              userVotedOptionId: article.poll?.userVotedOptionId
            }}
            themeConfig={themeConfig}
            onOpenShare={() => onOpenShare(article)}
            isActive={isActive}
          />
        </div>
      ) : (
        /* ----------------- 3. STANDARD NEWS ARTICLE CARD ----------------- */
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Cover Image Container */}
          <div className="relative w-full h-[44%] max-h-60 shrink-0 overflow-hidden group cursor-pointer" onClick={() => onExpandArticle(article)}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Top Category / Breaking Entertainment Alert Badge */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
                article.category === "Entertainment" || article.category === "Movies & TV Shows" || article.category === "Celebrity & Pop Culture" || article.title.toLowerCase().includes("alert")
                  ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                  : "bg-black/60 text-white border-white/20"
              }`}>
                {article.category === "Entertainment" || article.title.toLowerCase().includes("alert")
                  ? "Entertainment Alert"
                  : article.category}
              </span>
            </div>

            {/* Publisher Badge & Date */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-white">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold shadow">
                <Film className="w-3 h-3 text-[#00BBA7] shrink-0" />
                <span className="truncate max-w-[170px]">{article.publisher || "FlickPulse News"}</span>
              </div>
              <span className="text-[11px] text-zinc-300 font-light">{article.publishedAt}</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3.5 sm:p-4 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2
                onClick={() => onExpandArticle(article)}
                className="text-sm sm:text-base font-extrabold tracking-tight leading-snug cursor-pointer hover:text-[#00BBA7] transition-colors line-clamp-2 mb-1"
              >
                {article.title}
              </h2>

              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTapBodyText) onTapBodyText();
                }}
                className={`text-[11px] sm:text-xs line-clamp-2 cursor-pointer transition-colors hover:text-[#00BBA7]/90 active:scale-[0.99] mb-2 ${
                  themeConfig.darkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
                title="Tap text to toggle navigation bar"
              >
                {article.subtitle || article.summary}
              </p>

              {/* EMBEDDED SINGLE LIVE FAN POLL IN CARD */}
              <div className="pt-1.5 border-t border-zinc-200/40 dark:border-zinc-800/60">
                <PollWidget
                  poll={
                    article.poll ||
                    EMBEDDED_CARD_POLLS[
                      Math.abs(article.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
                        EMBEDDED_CARD_POLLS.length
                    ]
                  }
                  themeConfig={themeConfig}
                />
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-200/50 dark:border-zinc-800/80 mt-2 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  id={`bookmark-btn-${article.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    article.isBookmarked
                      ? "bg-[#00BBA7]/20 text-[#00BBA7]"
                      : themeConfig.darkMode
                      ? "hover:bg-zinc-800 text-zinc-400"
                      : "hover:bg-zinc-100 text-zinc-600"
                  }`}
                  title={article.isBookmarked ? "Remove Bookmark" : "Save Article"}
                >
                  <Bookmark className={`w-4 h-4 ${article.isBookmarked ? "fill-[#00BBA7]" : ""}`} />
                </button>

                <button
                  id={`share-btn-${article.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(article);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    themeConfig.darkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                  }`}
                  title="Share Story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-zinc-400 font-medium">{article.readTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
