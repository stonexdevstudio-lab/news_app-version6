import React, { useState, useEffect } from "react";
import { ThemeConfig, NewsCategory, Article } from "../types";
import { PALETTES } from "../utils/theme";
import { UserSession } from "./AuthLoginModal";
import {
  User,
  Bookmark,
  Flame,
  Moon,
  Sun,
  X,
  Edit2,
  Check,
  Bell,
  Sliders,
  Mail,
  BookOpen,
  Film,
  Star,
  ChevronRight,
  Vote,
  LogIn,
  ShieldCheck,
  UserCheck,
  Link2,
  Copy,
  ExternalLink,
  Share2,
  Building2,
  Download,
  Award,
  QrCode
} from "lucide-react";
import { motion } from "motion/react";

interface RatingHistoryItem {
  id: string;
  movieTitle: string;
  posterUrl?: string;
  rating: number;
  date: string;
}

interface PollHistoryItem {
  id: string;
  question: string;
  votedOption: string;
  date: string;
}

interface Props {
  themeConfig: ThemeConfig;
  onUpdateTheme: (updated: Partial<ThemeConfig>) => void;
  savedCount: number;
  highlightsCount: number;
  onCloseProfile: () => void;
  savedArticles?: Article[];
  onExpandArticle?: (article: Article) => void;
  onToggleBookmark?: (article: Article) => void;
  userSession?: UserSession;
  onOpenAuthModal?: (initialMode?: "login" | "staff") => void;
}

const ALL_CATEGORIES: NewsCategory[] = [
  "Movies & TV Shows",
  "Music & Podcasts",
  "Gaming & Live Streaming",
  "Celebrity & Pop Culture",
  "Live Events & Shows",
  "Football",
  "Gaming",
  "Pan-India",
  "Red Carpet",
  "Fashion",
  "Mollywood",
  "Hollywood"
];

export const ProfileView: React.FC<Props> = ({
  themeConfig,
  onUpdateTheme,
  savedCount,
  highlightsCount,
  onCloseProfile,
  savedArticles = [],
  onExpandArticle,
  onToggleBookmark,
  userSession,
  onOpenAuthModal
}) => {
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  // Profile Preferences State
  const [userName, setUserName] = useState(userSession?.name || "Sanjoob Jaya Mohan");
  const [userEmail, setUserEmail] = useState(userSession?.email || "msmohanan64@gmail.com");
  const [userTagline, setUserTagline] = useState("Entertainment & Sports Digest Reader");
  const [preferredTopics, setPreferredTopics] = useState<NewsCategory[]>([
    "Movies & TV Shows",
    "Football",
    "Mollywood"
  ]);
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true);

  useEffect(() => {
    if (userSession?.isLoggedIn) {
      setUserName(userSession.name);
      setUserEmail(userSession.email);
    }
  }, [userSession]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const [showAllSaved, setShowAllSaved] = useState<boolean>(false);
  const [showAllRatings, setShowAllRatings] = useState<boolean>(false);
  const [showAllPolls, setShowAllPolls] = useState<boolean>(false);

  // Poll Participation History State
  const [pollHistory, setPollHistory] = useState<PollHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickmeter_user_poll_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: "poll-1",
        question: "Which superhero franchise are you most excited for in 2025?",
        votedOption: "Marvel Cinematic Universe (Avengers & X-Men)",
        date: "Today, 2:15 PM"
      },
      {
        id: "poll-2",
        question: "Will L2 Empuraan break Malayalam Box Office records worldwide?",
        votedOption: "Yes, 100% Guaranteed Blockbuster",
        date: "Yesterday"
      },
      {
        id: "poll-3",
        question: "Which movie genre do you enjoy watching most?",
        votedOption: "Sci-Fi & Action Blockbusters",
        date: "3 days ago"
      },
      {
        id: "poll-4",
        question: "Who should win Best Actor at Oscars 2025?",
        votedOption: "Timothée Chalamet (Dune: Part Two)",
        date: "5 days ago"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_user_poll_history", JSON.stringify(pollHistory));
    } catch (e) {
      // ignore
    }
  }, [pollHistory]);

  // Movie Rating History State (synced with localStorage)
  const [movieHistory, setMovieHistory] = useState<RatingHistoryItem[]>(() => {
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
        movieTitle: "Gladiator II",
        posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=200",
        rating: 8,
        date: "Yesterday"
      },
      {
        id: "hist-3",
        movieTitle: "L2 Empuraan",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200",
        rating: 10,
        date: "3 days ago"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_user_history", JSON.stringify(movieHistory));
    } catch (e) {
      // ignore
    }
  }, [movieHistory]);

  const toggleCategoryPreference = (cat: NewsCategory) => {
    if (preferredTopics.includes(cat)) {
      setPreferredTopics(preferredTopics.filter((c) => c !== cat));
    } else {
      setPreferredTopics([...preferredTopics, cat]);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className={`absolute inset-0 z-30 flex flex-col p-4 sm:p-6 overflow-y-auto pb-20 sm:pb-24 ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Top Bar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Profile & Activity</h2>
          <p className="text-xs text-zinc-400">Manage your account, cinema preferences, saved items & history</p>
        </div>
        <button
          onClick={onCloseProfile}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Saved Feedback Toast */}
      {showSavedToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 rounded-2xl bg-teal-500 text-white text-xs font-bold flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Profile saved successfully!</span>
          </div>
        </motion.div>
      )}

      {/* Editable Profile Identity Card */}
      <div
        className={`p-5 rounded-3xl border mb-5 transition-all ${
          themeConfig.darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        {/* Account Status & Action Buttons Banner */}
        {onOpenAuthModal && (
          <div className="mb-4 pb-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#00BBA7]/20 text-[#00BBA7]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-300">
                  {userSession?.isLoggedIn ? "Member Account" : "Cinema Profile"}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {userSession?.isLoggedIn ? "Preferences & saved items active" : "Sign in for full watchlist access"}
                </p>
              </div>
            </div>

            {userSession?.isLoggedIn ? (
              <button
                onClick={() => onOpenAuthModal("login")}
                className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#00BBA7] text-black hover:bg-[#00cbb5] flex items-center space-x-1 shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Account</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 shrink-0 flex-nowrap">
                <button
                  onClick={() => onOpenAuthModal("login")}
                  className="px-3 py-1.5 rounded-full text-[11px] font-extrabold bg-[#00BBA7] text-black hover:bg-[#00cbb5] transition-all whitespace-nowrap cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md bg-[#00BBA7]`}
            >
              {getInitials(userName || "MR")}
            </div>
            <div>
              <h3 className="text-base font-extrabold">{userName}</h3>
              <p className="text-xs text-zinc-400 font-medium">{userTagline}</p>
            </div>
          </div>

          {/* ICON ONLY EDIT / SAVE BUTTON */}
          <button
            onClick={() => {
              if (!userSession?.isLoggedIn) {
                if (onOpenAuthModal) onOpenAuthModal("login");
                return;
              }
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            className={`p-2.5 rounded-full transition-all shadow-md shrink-0 ${
              isEditing
                ? "bg-[#00BBA7] text-black hover:bg-[#00cbb5]"
                : themeConfig.darkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
            }`}
            title={!userSession?.isLoggedIn ? "Sign in to edit profile" : isEditing ? "Save Profile" : "Edit Profile"}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Profile Inputs (Editable Mode) */}
        {isEditing && (
          <div className="space-y-3 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Full Name</label>
              <div className="flex items-center px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                <User className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-semibold text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Reader Bio</label>
              <input
                type="text"
                value={userTagline}
                onChange={(e) => setUserTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reader Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        <div
          className={`p-3.5 rounded-2xl border text-center ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-base font-extrabold">12</div>
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Day Streak</div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border text-center ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <Bookmark className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-base font-extrabold">{savedArticles.length || savedCount}</div>
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Saved Items</div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border text-center ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <Film className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-base font-extrabold">{movieHistory.length}</div>
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Movie Ratings</div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border text-center ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <Vote className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-base font-extrabold">{pollHistory.length}</div>
          <div className="text-[10px] text-zinc-400 uppercase font-bold">Poll Votes</div>
        </div>
      </div>

      {/* Saved Items Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold tracking-tight">Saved Items</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
              {savedArticles.length}
            </span>
          </div>
        </div>

        {savedArticles.length === 0 ? (
          <div
            className={`p-5 rounded-2xl border text-center ${
              themeConfig.darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"
            }`}
          >
            <Bookmark className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No saved articles or movies yet.</p>
            <p className="text-[11px] opacity-75 mt-0.5">Bookmark items in feed to view them here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(showAllSaved ? savedArticles : savedArticles.slice(0, 3)).map((item) => (
              <div
                key={item.id}
                onClick={() => onExpandArticle && onExpandArticle(item)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer group transition-all ${
                  themeConfig.darkMode
                    ? "bg-zinc-900/80 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900"
                    : "bg-white border-zinc-200 hover:border-amber-500/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block truncate">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400">{item.publishedAt} • {item.readTime}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            ))}

            {savedArticles.length > 3 && (
              <button
                onClick={() => setShowAllSaved(!showAllSaved)}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 text-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                {showAllSaved ? "Show Less" : `Show More (${savedArticles.length - 3} more)`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Movie Rating History Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-extrabold tracking-tight">Movie Rating History</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              {movieHistory.length}
            </span>
          </div>
        </div>

        {movieHistory.length === 0 ? (
          <div
            className={`p-5 rounded-2xl border text-center ${
              themeConfig.darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"
            }`}
          >
            <Film className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No movie ratings recorded yet.</p>
            <p className="text-[11px] opacity-75 mt-0.5">Rate movies in FlickPulse Cinema to build history.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(showAllRatings ? movieHistory : movieHistory.slice(0, 3)).map((hist) => (
              <div
                key={hist.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  themeConfig.darkMode ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {hist.posterUrl ? (
                    <img
                      src={hist.posterUrl}
                      alt={hist.movieTitle}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold truncate">{hist.movieTitle}</h4>
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                      <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-extrabold">{hist.rating} / 10</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 shrink-0">• {hist.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {movieHistory.length > 3 && (
              <button
                onClick={() => setShowAllRatings(!showAllRatings)}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 text-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                {showAllRatings ? "Show Less" : `Show More (${movieHistory.length - 3} more)`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Poll Participation History Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Vote className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold tracking-tight">Poll Participation History</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
              {pollHistory.length}
            </span>
          </div>
        </div>

        {pollHistory.length === 0 ? (
          <div
            className={`p-5 rounded-2xl border text-center ${
              themeConfig.darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"
            }`}
          >
            <Vote className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No poll participation recorded yet.</p>
            <p className="text-[11px] opacity-75 mt-0.5">Vote on polls in stories to build history.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(showAllPolls ? pollHistory : pollHistory.slice(0, 3)).map((poll) => (
              <div
                key={poll.id}
                className={`p-3.5 rounded-2xl border flex items-start justify-between transition-all ${
                  themeConfig.darkMode ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200"
                }`}
              >
                <div className="space-y-1 pr-2 overflow-hidden">
                  <h4 className="text-xs font-bold leading-snug">{poll.question}</h4>
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-500 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{poll.votedOption}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block">{poll.date}</span>
                </div>
              </div>
            ))}

            {pollHistory.length > 3 && (
              <button
                onClick={() => setShowAllPolls(!showAllPolls)}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 text-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                {showAllPolls ? "Show Less" : `Show More (${pollHistory.length - 3} more)`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preferred News Categories Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span>Preferred Feed Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isPreferred = preferredTopics.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategoryPreference(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  isPreferred
                    ? activePalette.primary + " text-white border-transparent shadow"
                    : themeConfig.darkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <span>{cat}</span>
                {isPreferred && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* App Preferences & Settings */}
      <div className="space-y-2.5 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">Reader Settings</h4>

        {/* Dark Mode Switch */}
        <div
          onClick={() => onUpdateTheme({ darkMode: !themeConfig.darkMode })}
          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            {themeConfig.darkMode ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <div>
              <div className="text-xs font-bold">Dark Mode</div>
              <div className="text-[10px] text-zinc-400">Eye-safe OLED dark canvas</div>
            </div>
          </div>

          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              themeConfig.darkMode ? "bg-amber-500" : "bg-zinc-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                themeConfig.darkMode ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Push Notifications Toggle */}
        <div
          onClick={() => setEnableNotifications(!enableNotifications)}
          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            themeConfig.darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-rose-500" />
            <div>
              <div className="text-xs font-bold">Breaking Entertainment Alerts</div>
              <div className="text-[10px] text-zinc-400">Instant top story notifications</div>
            </div>
          </div>

          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              enableNotifications ? "bg-teal-500" : "bg-zinc-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                enableNotifications ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
