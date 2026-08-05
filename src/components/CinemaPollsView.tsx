import React, { useState, useEffect } from "react";
import { ThemeConfig } from "../types";
import { Vote, Check, Sparkles, TrendingUp, BarChart2, Award, Film, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface CinemaPoll {
  id: string;
  question: string;
  category: "Box Office" | "Oscars & Awards" | "Fan Battles" | "Casting";
  totalVotes: number;
  options: PollOption[];
  userVotedOptionId?: string;
  badge?: string;
}

interface Props {
  themeConfig: ThemeConfig;
  onVoteCast?: (pollId: string, question: string, optionText: string) => void;
}

const INITIAL_POLLS: CinemaPoll[] = [
  {
    id: "cinema-poll-1",
    question: "Which upcoming Malayalam mega-project are you most hyped for in 2025?",
    category: "Casting",
    badge: "Mollywood",
    totalVotes: 32480,
    options: [
      { id: "opt-1a", text: "L2: Empuraan (Mohanlal & Prithviraj Sukumaran)", votes: 18410 },
      { id: "opt-1b", text: "Lokah Chapter 1 (Kalyani & Dulquer Salmaan)", votes: 7320 },
      { id: "opt-1c", text: "Barroz 3D Fantasy (Mohanlal Directorial)", votes: 4120 },
      { id: "opt-1d", text: "Premalu 2 (Girish AD & Bhavana Studios)", votes: 2630 }
    ]
  },
  {
    id: "cinema-poll-2",
    question: "Will L2 Empuraan break the ₹200 Crore worldwide box office record for Malayalam cinema?",
    category: "Box Office",
    badge: "Box Office",
    totalVotes: 28150,
    options: [
      { id: "opt-2a", text: "Yes, 100% Guaranteed ₹200Cr+ All-Time Record", votes: 20890 },
      { id: "opt-2b", text: "It will cross ₹150Cr, but ₹200Cr will be tough", votes: 5120 },
      { id: "opt-2c", text: "Depends heavily on overseas GCC word-of-mouth", votes: 2140 }
    ]
  },
  {
    id: "cinema-poll-3",
    question: "Who delivered the best Lead Actor performance in Malayalam Cinema recently?",
    category: "Oscars & Awards",
    badge: "Kerala State Awards",
    totalVotes: 19840,
    options: [
      { id: "opt-3a", text: "Prithviraj Sukumaran (Aadujeevitham - The Goat Life)", votes: 8950 },
      { id: "opt-3b", text: "Mammootty (Bramayugam & Turbo)", votes: 6810 },
      { id: "opt-3c", text: "Fahadh Faasil (Aavesham - Ranga Anna)", votes: 3180 },
      { id: "opt-3d", text: "Tovino Thomas (ARM & Identity)", votes: 900 }
    ]
  },
  {
    id: "cinema-poll-4",
    question: "Should Malayalam movies release same-day in GCC and European cinemas?",
    category: "Fan Battles",
    badge: "Global Release",
    totalVotes: 18900,
    options: [
      { id: "opt-4a", text: "Yes, GCC is Mollywood's biggest overseas market", votes: 14400 },
      { id: "opt-4b", text: "Only for big star films (Mohanlal, Mammootty, Dulquer)", votes: 2820 },
      { id: "opt-4c", text: "Focus on domestic Kerala screens first", votes: 1680 }
    ]
  }
];

export const CinemaPollsView: React.FC<Props> = ({ themeConfig, onVoteCast }) => {
  const [polls, setPolls] = useState<CinemaPoll[]>(() => {
    try {
      const saved = localStorage.getItem("flickmeter_cinema_polls_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_POLLS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_cinema_polls_data", JSON.stringify(polls));
    } catch (e) {
      // ignore
    }
  }, [polls]);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVotedOptionId) return poll; // Already voted

        const chosenOption = poll.options.find((o) => o.id === optionId);
        if (onVoteCast && chosenOption) {
          onVoteCast(poll.id, poll.question, chosenOption.text);
        }

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

  const categories = ["All", "Box Office", "Oscars & Awards", "Casting", "Fan Battles"];

  const filteredPolls =
    activeCategory === "All"
      ? polls
      : polls.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Radio Button Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar" role="radiogroup" aria-label="Poll Category Filter">
        {categories.map((cat) => {
          const isChecked = activeCategory === cat;
          return (
            <label
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 border ${
                isChecked
                  ? "bg-[#00BBA7] text-black border-[#00BBA7] shadow-md scale-105"
                  : themeConfig.darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isChecked ? "border-black bg-black" : "border-zinc-400 bg-transparent"
                }`}
              >
                {isChecked && <span className="w-1 h-1 rounded-full bg-[#00BBA7]" />}
              </span>
              <span>{cat}</span>
            </label>
          );
        })}
      </div>

      {/* Poll Cards Stack */}
      <div className="space-y-4">
        {filteredPolls.map((poll) => {
          const hasVoted = Boolean(poll.userVotedOptionId);

          return (
            <motion.div
              key={poll.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
                  : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              {/* Poll Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00BBA7]/20 text-[#00BBA7] border border-[#00BBA7]/30">
                    {poll.badge || poll.category}
                  </span>
                  {hasVoted && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center space-x-0.5">
                      <Check className="w-3 h-3" />
                      <span>Voted</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-medium">
                  <Vote className="w-3.5 h-3.5 text-[#00BBA7]" />
                  <span>{poll.totalVotes.toLocaleString()} votes</span>
                </div>
              </div>

              {/* Poll Question */}
              <h3 className="text-sm font-bold leading-snug mb-3">{poll.question}</h3>

              {/* Options */}
              <div className="space-y-2">
                {poll.options.map((option) => {
                  const percentage =
                    poll.totalVotes > 0
                      ? Math.round((option.votes / poll.totalVotes) * 100)
                      : 0;
                  const isSelected = poll.userVotedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={hasVoted}
                      className={`relative w-full p-3 rounded-xl border text-left overflow-hidden transition-all ${
                        isSelected
                          ? "border-[#00BBA7] ring-1 ring-[#00BBA7]/50 bg-[#00BBA7]/10"
                          : hasVoted
                          ? "border-zinc-200 dark:border-zinc-800 opacity-90 cursor-default"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-[#00BBA7]/60 hover:bg-[#00BBA7]/5 active:scale-[0.99]"
                      }`}
                    >
                      {/* Animated Progress Bar Fill */}
                      {hasVoted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`absolute left-0 top-0 bottom-0 z-0 ${
                            isSelected
                              ? "bg-[#00BBA7]/25 dark:bg-[#00BBA7]/30"
                              : "bg-zinc-200/80 dark:bg-zinc-800/80"
                          }`}
                        />
                      )}

                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center space-x-2 pr-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#00BBA7] border-[#00BBA7] text-black ring-2 ring-[#00BBA7]/30"
                                : "border-zinc-400 dark:border-zinc-600 bg-transparent"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <span
                            className={
                              isSelected
                                ? "text-[#00BBA7] font-extrabold"
                                : themeConfig.darkMode
                                ? "text-zinc-200"
                                : "text-zinc-800"
                            }
                          >
                            {option.text}
                          </span>
                        </div>

                        {hasVoted && (
                          <span
                            className={`font-extrabold shrink-0 ml-2 ${
                              isSelected ? "text-[#00BBA7]" : "text-zinc-400"
                            }`}
                          >
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
