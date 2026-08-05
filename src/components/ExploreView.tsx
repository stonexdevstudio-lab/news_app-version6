import React, { useState, useEffect } from "react";
import { NewsCategory, ThemeConfig } from "../types";
import {
  X,
  Vote,
  Check,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Flame,
  BarChart2,
  Search,
  Grid,
  TrendingUp,
  Bookmark,
  RefreshCw,
  SlidersHorizontal,
  Compass,
  Film
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  selectedCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSavedModal: () => void;
  onOpenThemeModal: () => void;
  onOpenGeminiModal: () => void;
  onResetFeed: () => void;
  onCloseExplore: () => void;
  themeConfig: ThemeConfig;
  savedCount: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface CinemaPoll {
  id: string;
  question: string;
  category: string;
  badge: string;
  totalVotes: number;
  options: PollOption[];
  userVotedOptionId?: string;
}

const LIVE_FAN_POLLS: CinemaPoll[] = [
  {
    id: "live-poll-1",
    question: "Which upcoming Malayalam mega-project are you most hyped for in 2025?",
    category: "MOLLYWOOD",
    badge: "Most Anticipated",
    totalVotes: 32480,
    options: [
      { id: "opt-1a", text: "L2: Empuraan (Mohanlal & Prithviraj)", votes: 18410 },
      { id: "opt-1b", text: "Lokah Chapter 1 (Kalyani & Dulquer)", votes: 7320 },
      { id: "opt-1c", text: "Barroz 3D Fantasy (Mohanlal Directorial)", votes: 4120 },
      { id: "opt-1d", text: "Premalu 2 (Girish AD & Bhavana Studios)", votes: 2630 }
    ]
  },
  {
    id: "live-poll-2",
    question: "Will L2 Empuraan break the ₹200 Crore worldwide box office record for Malayalam cinema?",
    category: "BOX OFFICE",
    badge: "Record Watch",
    totalVotes: 28150,
    options: [
      { id: "opt-2a", text: "Yes, 100% Guaranteed ₹200Cr+ All-Time Record", votes: 20890 },
      { id: "opt-2b", text: "It will cross ₹150Cr, but ₹200Cr will be tough", votes: 5120 },
      { id: "opt-2c", text: "Depends heavily on overseas GCC word-of-mouth", votes: 2140 }
    ]
  },
  {
    id: "live-poll-3",
    question: "Who delivered the best Lead Actor performance in Malayalam Cinema recently?",
    category: "STATE AWARDS",
    badge: "Best Actor",
    totalVotes: 19840,
    options: [
      { id: "opt-3a", text: "Prithviraj Sukumaran (Aadujeevitham - The Goat Life)", votes: 8950 },
      { id: "opt-3b", text: "Mammootty (Bramayugam & Turbo)", votes: 6810 },
      { id: "opt-3c", text: "Fahadh Faasil (Aavesham - Ranga Anna)", votes: 3180 },
      { id: "opt-3d", text: "Tovino Thomas (ARM & Identity)", votes: 900 }
    ]
  },
  {
    id: "live-poll-4",
    question: "Which Pan-India mega blockbuster crossover are you anticipating the most?",
    category: "PAN-INDIA",
    badge: "Blockbuster",
    totalVotes: 24300,
    options: [
      { id: "opt-4a", text: "Pushpa 2: The Rule (Allu Arjun)", votes: 11200 },
      { id: "opt-4b", text: "Kantara: Chapter 1 (Rishab Shetty)", votes: 6800 },
      { id: "opt-4c", text: "SSMB29 (Mahesh Babu & SS Rajamouli)", votes: 4500 },
      { id: "opt-4d", text: "Kalki 2898 AD Part 2 (Prabhas)", votes: 1800 }
    ]
  },
  {
    id: "live-poll-5",
    question: "Should Malayalam movies release same-day in GCC and European cinemas?",
    category: "GLOBAL RELEASE",
    badge: "Fan Battle",
    totalVotes: 18900,
    options: [
      { id: "opt-5a", text: "Yes, GCC is Mollywood's biggest overseas market", votes: 14400 },
      { id: "opt-5b", text: "Only for big star films (Mohanlal, Mammootty, Dulquer)", votes: 2820 },
      { id: "opt-5c", text: "Focus on domestic Kerala screens first", votes: 1680 }
    ]
  },
  {
    id: "live-poll-6",
    question: "Which film soundtrack / viral BGM went down as the top anthem of the year?",
    category: "MUSIC & SOUNDTRACKS",
    badge: "Viral Anthem",
    totalVotes: 15420,
    options: [
      { id: "opt-6a", text: "Aavesham - Illuminati (Sushin Shyam)", votes: 9120 },
      { id: "opt-6b", text: "Premalu - Mini Maharani (Vishnu Vijay)", votes: 3840 },
      { id: "opt-6c", text: "ARM - Kattu Payale / Theme (Dhibu Ninan)", votes: 1460 },
      { id: "opt-6d", text: "Bramayugam - Folk Chants (Christo Xavier)", votes: 1000 }
    ]
  }
];

const CATEGORIES: NewsCategory[] = [
  "All",
  "Movie Reviews",
  "Mollywood",
  "Movies & TV Shows",
  "Hollywood",
  "Bollywood",
  "Kollywood",
  "Tollywood",
  "OTT Releases",
  "Box Office",
  "Cinema News",
  "Pan-India",
  "Music & Podcasts",
  "Gaming & Live Streaming",
  "Celebrity & Pop Culture",
  "Football",
  "Red Carpet",
  "Fashion"
];

const TRENDING_HASHTAGS = [
  "#Empuraan",
  "#Barroz",
  "#MalayalamCinema",
  "#Aavesham",
  "#Mollywood",
  "#Premalu2",
  "#GTA6"
];

export const ExploreView: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenSavedModal,
  onResetFeed,
  onCloseExplore,
  themeConfig,
  savedCount
}) => {
  const [polls, setPolls] = useState<CinemaPoll[]>(() => {
    try {
      const saved = localStorage.getItem("flickmeter_live_fan_polls_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return LIVE_FAN_POLLS;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_live_fan_polls_data", JSON.stringify(polls));
    } catch (e) {
      // ignore
    }
  }, [polls]);

  const currentPoll = polls[currentIndex] || polls[0];
  const hasVoted = Boolean(currentPoll.userVotedOptionId);

  const handleVote = (pollId: string, optionId: string) => {
    if (hasVoted) return;

    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVotedOptionId) return poll;

        const updatedOptions = poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );

        return {
          ...poll,
          totalVotes: poll.totalVotes + 1,
          userVotedOptionId: optionId,
          options: updatedOptions
        };
      })
    );
  };

  const handleNext = () => {
    if (currentIndex < polls.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 220 : -220,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 220 : -220,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className={`absolute inset-0 z-30 flex flex-col p-4 sm:p-6 overflow-y-auto pb-20 ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#00BBA7] text-black font-extrabold shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight">Explore & Discover</h2>
            <p className="text-xs text-zinc-400">Live fan polls, cinema categories & trending topics</p>
          </div>
        </div>
        <button
          onClick={onCloseExplore}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          title="Close Explore"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5 max-w-xl mx-auto w-full">
        {/* BOX 1: LIVE FAN POLLS BOX */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-all ${
            themeConfig.darkMode
              ? "bg-zinc-900/70 border-zinc-800"
              : "bg-white border-zinc-200"
          }`}
        >
          {/* Box Title */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#00BBA7]/20 text-[#00BBA7]">
                <Vote className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#00BBA7]">
                Live Fan Polls Box
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1 animate-pulse">
              <Flame className="w-2.5 h-2.5" />
              <span>LIVE</span>
            </span>
          </div>

          {/* Poll Card Pagination Header */}
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-zinc-400">
            <span className="flex items-center space-x-1 text-[#00BBA7]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Poll {currentIndex + 1} of {polls.length}</span>
            </span>

            {/* Pagination Dots */}
            <div className="flex items-center space-x-1">
              {polls.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "w-4 bg-[#00BBA7]"
                      : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated Poll Card */}
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentPoll.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  else if (info.offset.x > 50) handlePrev();
                }}
                className={`w-full p-4 sm:p-5 rounded-2xl border flex flex-col justify-between select-none cursor-grab active:cursor-grabbing ${
                  themeConfig.darkMode
                    ? "bg-zinc-950/80 border-zinc-800 text-zinc-100"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#00BBA7]/15 text-[#00BBA7] border border-[#00BBA7]/30">
                      {currentPoll.category} • {currentPoll.badge}
                    </span>
                    <div className="flex items-center space-x-1 text-xs font-bold text-zinc-400 shrink-0">
                      <BarChart2 className="w-3.5 h-3.5 text-[#00BBA7]" />
                      <span>{currentPoll.totalVotes.toLocaleString()} Votes</span>
                    </div>
                  </div>

                  {/* Poll Question */}
                  <h4 className="text-sm sm:text-base font-extrabold leading-snug tracking-tight mb-4">
                    {currentPoll.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2 mb-3">
                    {currentPoll.options.map((option) => {
                      const isChosen = currentPoll.userVotedOptionId === option.id;
                      const percent =
                        currentPoll.totalVotes > 0
                          ? Math.round((option.votes / currentPoll.totalVotes) * 100)
                          : 0;

                      return (
                        <button
                          key={option.id}
                          disabled={hasVoted}
                          onClick={() => handleVote(currentPoll.id, option.id)}
                          className={`w-full relative overflow-hidden rounded-xl p-3 text-left border transition-all text-xs font-extrabold flex items-center justify-between group ${
                            hasVoted
                              ? isChosen
                                ? "border-[#00BBA7] bg-[#00BBA7]/10 text-white"
                                : themeConfig.darkMode
                                ? "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                                : "border-zinc-200 bg-white text-zinc-600"
                              : themeConfig.darkMode
                              ? "border-zinc-800 bg-zinc-900 hover:border-[#00BBA7] hover:bg-zinc-800 text-zinc-200"
                              : "border-zinc-200 bg-white hover:border-[#00BBA7] hover:bg-teal-50/50 text-zinc-800"
                          }`}
                        >
                          {hasVoted && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`absolute inset-y-0 left-0 opacity-20 ${
                                isChosen ? "bg-[#00BBA7]" : "bg-zinc-500"
                              }`}
                            />
                          )}

                          <span className="relative z-10 flex-1 pr-2 font-bold leading-tight">
                            {option.text}
                          </span>

                          {hasVoted ? (
                            <div className="relative z-10 flex items-center space-x-1 shrink-0 ml-2">
                              <span className="text-xs font-black">{percent}%</span>
                              {isChosen && (
                                <span className="p-0.5 rounded-full bg-[#00BBA7] text-black">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="relative z-10 text-[10px] font-black uppercase text-[#00BBA7] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                              Vote
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-[10px] font-bold text-zinc-400 italic">
                    {hasVoted ? "✓ Vote recorded" : "Tap an option to submit vote"}
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-[#00BBA7] transition-colors"
                    title="Share Poll"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedShare ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Controls */}
          <div className="flex items-center justify-between mt-3 px-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 border transition-all ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed border-transparent text-zinc-500"
                  : themeConfig.darkMode
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                  : "bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="text-[11px] font-bold text-zinc-400">
              Swipe or Tap
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === polls.length - 1}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 border transition-all ${
                currentIndex === polls.length - 1
                  ? "opacity-30 cursor-not-allowed border-transparent text-zinc-500"
                  : "bg-[#00BBA7] text-black border-[#00BBA7] hover:bg-[#00cbb5] shadow-sm"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BOX 2: TRENDING CATEGORIES BOX */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-all ${
            themeConfig.darkMode
              ? "bg-zinc-900/70 border-zinc-800"
              : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-[#00BBA7]/20 text-[#00BBA7]">
              <Grid className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#00BBA7]">
              Trending Categories Box
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3 font-medium">
            Filter your cinema newsfeed by popular movie & pop culture categories:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onCloseExplore();
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#00BBA7] text-black border-[#00BBA7] shadow-sm"
                      : themeConfig.darkMode
                      ? "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                      : "bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  <span className="truncate pr-1">{cat}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-black shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOX 3: SEARCH & TRENDING TOPICS BOX */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-all ${
            themeConfig.darkMode
              ? "bg-zinc-900/70 border-zinc-800"
              : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-[#00BBA7]/20 text-[#00BBA7]">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#00BBA7]">
              Search & Trending Hashtags Box
            </h3>
          </div>

          {/* Search Input Bar */}
          <div className="mb-3.5">
            <div className="flex items-center px-3.5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
              <Search className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search movies, Malayalam cinema, actors, trailers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange("")} className="p-1 text-zinc-400 hover:text-zinc-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Trending Hashtags */}
          <div>
            <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#00BBA7]" />
              <span>Trending Cinema Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_HASHTAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSearchChange(tag.replace("#", ""));
                    onCloseExplore();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                    themeConfig.darkMode
                      ? "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-[#00BBA7]"
                      : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-[#00BBA7]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOX 4: QUICK FEED CONTROLS & SAVED BOX */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-all flex items-center justify-between gap-3 ${
            themeConfig.darkMode
              ? "bg-zinc-900/70 border-zinc-800"
              : "bg-white border-zinc-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSavedModal}
              className="p-2.5 rounded-2xl bg-[#00BBA7]/15 text-[#00BBA7] border border-[#00BBA7]/30 flex items-center space-x-2 hover:bg-[#00BBA7]/25 transition-all text-xs font-extrabold"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Articles ({savedCount})</span>
            </button>
          </div>

          <button
            onClick={() => {
              onResetFeed();
              onCloseExplore();
            }}
            className="px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center space-x-1.5 text-xs font-extrabold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Feed</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};



