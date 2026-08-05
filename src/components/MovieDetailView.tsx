import React, { useState, useRef, useEffect } from "react";
import { Article, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import {
  X,
  Star,
  Play,
  Pause,
  Bookmark,
  Share2,
  Tv,
  Globe,
  Clapperboard,
  Users,
  Check,
  ChevronLeft,
  BarChart2,
  History,
  TrendingUp,
  Sparkles,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitUserRatingToFirestore } from "../lib/firebase";

interface Props {
  article: Article;
  onClose: () => void;
  onToggleBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  themeConfig: ThemeConfig;
}

interface RatingHistoryItem {
  id: string;
  movieTitle: string;
  posterUrl?: string;
  rating: number;
  date: string;
}

export const MovieDetailView: React.FC<Props> = ({
  article,
  onClose,
  onToggleBookmark,
  onOpenShare,
  themeConfig
}) => {
  const movie = article.movieDetails;
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [userStarRating, setUserStarRating] = useState<number>(movie?.userRating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingSavedMsg, setRatingSavedMsg] = useState(false);

  // Initial breakdown distribution data for FlickMeter graph
  const [distribution, setDistribution] = useState([
    { stars: 10, label: "10 ★", percent: 48, count: 259200 },
    { stars: 9, label: "9 ★", percent: 30, count: 162000 },
    { stars: 8, label: "8 ★", percent: 12, count: 64800 },
    { stars: 7, label: "7 ★", percent: 6, count: 32400 },
    { stars: 6, label: "6 ★", percent: 2, count: 10800 },
    { stars: 5, label: "5 ★", percent: 1, count: 5400 },
    { stars: 4, label: "4 ★", percent: 0.5, count: 2700 },
    { stars: 3, label: "3 ★", percent: 0.3, count: 1620 },
    { stars: 2, label: "2 ★", percent: 0.1, count: 540 },
    { stars: 1, label: "1 ★", percent: 0.1, count: 540 },
  ]);

  // Load User Rating History from LocalStorage or default
  const [history, setHistory] = useState<RatingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickmeter_user_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: "hist-1",
        movieTitle: "Dune: Part Two",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200",
        rating: 9,
        date: "Today, 5:00 PM"
      },
      {
        id: "hist-2",
        movieTitle: "Oppenheimer",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200",
        rating: 10,
        date: "Yesterday"
      }
    ];
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_user_history", JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history]);

  if (!movie) return null;

  const handleToggleTrailer = () => {
    if (videoRef.current) {
      if (isPlayingTrailer) {
        videoRef.current.pause();
        setIsPlayingTrailer(false);
      } else {
        videoRef.current.play().then(() => setIsPlayingTrailer(true)).catch(() => {});
      }
    }
  };

  const handleRateMovie = (stars: number) => {
    setUserStarRating(stars);
    setRatingSavedMsg(true);

    // Persist live user rating to Firestore via UPSERT
    submitUserRatingToFirestore(
      article.id,
      {
        id: "rev-" + Date.now(),
        userName: "FlickPulse User",
        userEmail: "devfourflicks@gmail.com",
        userScore: stars,
        reviewTitle: `Rated ${stars}/10 Stars`,
        reviewComment: `User rating logged from Movie Detail Reader View.`,
        date: "Just now"
      },
      {
        movieTitle: article.title,
        posterUrl: movie.posterUrl || article.imageUrl,
        category: article.category || "Mollywood",
        synopsis: movie.synopsis || article.summary,
        languages: movie.languages || ["Malayalam", "English"],
        cast: movie.cast?.map((c) => c.name) || [],
        whereToWatch: movie.streamingOn?.[0]?.platform || "Prime Video"
      }
    );

    // Update graph distribution dynamically
    setDistribution((prev) =>
      prev.map((item) => {
        if (item.stars === stars) {
          const newCount = item.count + 1;
          return { ...item, count: newCount, percent: Math.min(100, item.percent + 2) };
        }
        return item;
      })
    );

    // Add to User History
    const newHistoryItem: RatingHistoryItem = {
      id: "hist-" + Date.now(),
      movieTitle: article.title,
      posterUrl: movie.posterUrl || article.imageUrl,
      rating: stars,
      date: "Just now"
    };

    setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.movieTitle !== article.title)]);

    setTimeout(() => setRatingSavedMsg(false), 3500);
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <motion.div
      id="movie-detail-view"
      initial={{ x: "100%", opacity: 1 }}
      animate={{ x: "0%", opacity: 1 }}
      exit={{ x: "100%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`absolute inset-0 z-50 flex flex-col overflow-y-auto select-none transition-colors duration-300 ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-900 text-zinc-100"
      }`}
    >
      {/* Floating Top Header Controls */}
      <div className="sticky top-0 z-50 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/20 transition-all active:scale-90"
          title="Back to feed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleBookmark(article)}
            className={`p-2 rounded-full border transition-all active:scale-90 ${
              article.isBookmarked
                ? "bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/40"
                : "bg-black/60 border-white/20 text-white hover:bg-black/80"
            }`}
            title="Bookmark movie"
          >
            <Bookmark className={`w-4 h-4 ${article.isBookmarked ? "fill-black" : ""}`} />
          </button>
          <button
            onClick={() => onOpenShare(article)}
            className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 transition-all active:scale-90"
            title="Share movie"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. FIRST SECTION: TRAILER / POSTER + TITLE & RATING HEADER */}
      <div className="relative w-full shrink-0 -mt-14">
        {/* Poster / Trailer Stage */}
        <div className="relative w-full h-[320px] bg-black overflow-hidden group">
          {movie.trailerUrl ? (
            <video
              ref={videoRef}
              src={movie.trailerUrl}
              poster={movie.posterUrl || article.imageUrl}
              playsInline
              loop
              className="w-full h-full object-cover"
              onClick={handleToggleTrailer}
            />
          ) : (
            <img
              src={movie.posterUrl || article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

          {/* Play Trailer Button overlay */}
          {movie.trailerUrl && !isPlayingTrailer && (
            <button
              onClick={handleToggleTrailer}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-105 transition-all border border-amber-300 z-20"
            >
              <Play className="w-8 h-8 fill-black ml-1" />
            </button>
          )}

          {isPlayingTrailer && (
            <button
              onClick={handleToggleTrailer}
              className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 border border-white/20"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Trailer</span>
            </button>
          )}
        </div>

        {/* Title, Year, Duration, Rating Badge */}
        <div className="px-5 -mt-12 relative z-20 flex flex-col space-y-2">
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5">
            {movie.genres?.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40"
              >
                {g}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center space-x-3 text-xs font-semibold text-zinc-400">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.duration && (
              <>
                <span>•</span>
                <span>{movie.duration}</span>
              </>
            )}
            <span>•</span>
            <span className="text-zinc-300">{article.category}</span>
          </div>

          {/* FlickMeter Rating Banner */}
          <div className="flex items-center space-x-4 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-black text-white">{movie.rating}</span>
                  <span className="text-xs text-zinc-400">/ 10</span>
                </div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  FlickPulse™ Score
                </div>
              </div>
            </div>

            {/* Quick Rate Trigger button */}
            <a
              href="#flickmeter-section"
              className="ml-auto px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>Rate Movie Score</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 2. SYNOPSIS SECTION */}
        <div className="space-y-2 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Synopsis</span>
          </h3>
          <p className="text-sm leading-relaxed text-zinc-300 font-normal">
            {movie.synopsis}
          </p>
        </div>

        {/* 3. LANGUAGES AVAILABLE */}
        <div className="space-y-2.5 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Languages Available</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {movie.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/80"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* 4. CAST & DIRECTOR */}
        <div className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Cast & Crew</span>
          </h3>

          {/* Director */}
          <div className="text-xs font-semibold text-zinc-400 pb-2 border-b border-zinc-800">
            <span className="text-zinc-500">Director: </span>
            <span className="text-white font-bold">{movie.director}</span>
          </div>

          {/* Cast Horizontal Cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {movie.cast.map((actor) => (
              <div
                key={actor.name}
                className="flex items-center space-x-2.5 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80"
              >
                {actor.avatar ? (
                  <img
                    src={actor.avatar}
                    alt={actor.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                    {actor.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{actor.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{actor.character}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. WHERE AVAILABLE NOW (STREAMING) */}
        <div className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
            <Tv className="w-3.5 h-3.5" />
            <span>Where to Watch</span>
          </h3>
          <div className="space-y-2">
            {movie.streamingOn.map((platform) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">
                    {platform.platform.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{platform.platform}</div>
                    <div className="text-[10px] text-zinc-400">{platform.quality || "Stream Now"}</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow">
                  Watch Now
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. FLICKMETER SECTION (RATING + GRAPH + USER HISTORY) */}
        <div
          id="flickmeter-section"
          className="space-y-5 bg-gradient-to-br from-amber-950/50 via-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/40 text-left relative overflow-hidden shadow-2xl"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide flex items-center space-x-1.5">
                  <span>FlickPulse Rating</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold">
                    Live Score
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Audience Rating Graph & History Tracker</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-amber-400">{movie.rating} / 10</div>
              <div className="text-[10px] text-zinc-400">{movie.voteCount || "540K"} votes</div>
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="text-center py-2 bg-black/40 rounded-xl border border-amber-500/20 p-3 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 block">
              {userStarRating > 0
                ? `Your FlickPulse Rating: ${userStarRating} / 10 Stars`
                : "Tap a Star to Rate this Movie"}
            </span>

            {/* 10 Star Rating Row - Responsive Wrapped Box */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 py-1.5 max-w-full px-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
                const active = starVal <= (hoverRating || userStarRating);
                return (
                  <button
                    key={starVal}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRateMovie(starVal)}
                    className="p-0.5 transition-transform active:scale-125 focus:outline-none shrink-0"
                    title={`Rate ${starVal}/10`}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        active
                          ? "fill-amber-400 text-amber-400 drop-shadow-md"
                          : "text-zinc-600 fill-zinc-800"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {ratingSavedMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-xs font-bold text-amber-400 bg-amber-500/20 py-1.5 px-3 rounded-full inline-flex items-center space-x-1.5 border border-amber-500/40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Rating History!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FLICKPULSE GRAPH (AUDIENCE BREAKDOWN CHART) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Audience Rating Breakdown</span>
              </span>
              <span className="text-[10px] text-amber-400/90 font-mono">10 Stars Distribution</span>
            </div>

            {/* Horizontal Distribution Bars */}
            <div className="space-y-2 bg-black/50 p-3.5 rounded-xl border border-zinc-800/80">
              {distribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-2.5 text-xs">
                  <span className="w-8 text-[11px] font-extrabold text-zinc-400 text-right shrink-0">
                    {item.label}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-zinc-800 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        item.stars >= 8
                          ? "bg-gradient-to-r from-amber-500 to-amber-300"
                          : item.stars >= 5
                          ? "bg-amber-600/80"
                          : "bg-zinc-600"
                      }`}
                    />
                  </div>
                  <span className="w-12 text-[10px] font-mono text-zinc-400 text-right shrink-0">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* USER RATING HISTORY SECTION */}
          <div className="space-y-3 pt-2 border-t border-amber-500/20">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <History className="w-4 h-4 text-amber-400" />
                <span>Your Rating History</span>
              </span>
              <span className="text-[10px] text-zinc-400">{history.length} Movies Rated</span>
            </div>

            {history.length === 0 ? (
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-center text-xs text-zinc-400">
                No rating history yet. Rate this movie above to add your first entry!
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-zinc-800/90 text-xs hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {item.posterUrl ? (
                        <img
                          src={item.posterUrl}
                          alt={item.movieTitle}
                          className="w-9 h-11 rounded-lg object-cover border border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-11 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400 font-bold shrink-0">
                          <Clapperboard className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-extrabold text-white truncate">{item.movieTitle}</div>
                        <div className="text-[10px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0 ml-2">
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{item.rating} / 10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

