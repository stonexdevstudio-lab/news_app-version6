import React, { useState } from "react";
import { PollData, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { CheckCircle2, BarChart2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  poll: PollData;
  themeConfig: ThemeConfig;
  onVote?: (optionId: string) => void;
}

export const PollWidget: React.FC<Props> = ({ poll, themeConfig, onVote }) => {
  const [votedOptionId, setVotedOptionId] = useState<string | undefined>(poll.userVotedOptionId);
  const [optionVotes, setOptionVotes] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    poll.options.forEach((opt) => {
      map[opt.id] = opt.votes;
    });
    return map;
  });

  const totalVotes: number = (Object.values(optionVotes) as number[]).reduce(
    (a: number, b: number) => a + b,
    0
  );
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];

  const handleSelectOption = (optionId: string) => {
    if (votedOptionId === optionId) return;

    setOptionVotes((prev) => {
      const next = { ...prev };
      if (votedOptionId) {
        next[votedOptionId] = Math.max(0, next[votedOptionId] - 1);
      }
      next[optionId] = (next[optionId] || 0) + 1;
      return next;
    });
    setVotedOptionId(optionId);
    if (onVote) {
      onVote(optionId);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-full my-3 p-3.5 rounded-2xl border transition-all ${
        themeConfig.darkMode
          ? "bg-zinc-900/80 border-zinc-800 text-zinc-100"
          : "bg-[#00BBA7]/5 border-[#00BBA7]/20 text-zinc-900"
      }`}
    >
      {/* Poll Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00BBA7]">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Interactive Poll</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">
          {totalVotes.toLocaleString()} votes
        </span>
      </div>

      {/* Poll Question */}
      <p className="text-xs sm:text-sm font-bold mb-2.5 leading-tight">
        {poll.question}
      </p>

      {/* Options List */}
      <div className="space-y-1.5">
        {poll.options.map((opt) => {
          const votes = optionVotes[opt.id] || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = votedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`relative w-full p-2.5 rounded-xl text-left text-xs font-semibold overflow-hidden border transition-all flex items-center justify-between ${
                isSelected
                  ? "border-[#00BBA7] text-[#00BBA7] dark:text-[#00BBA7] shadow-sm bg-[#00BBA7]/10"
                  : themeConfig.darkMode
                  ? "border-zinc-800 bg-zinc-800/40 text-zinc-200 hover:border-zinc-700"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
              }`}
            >
              {/* Progress Bar Fill on Vote */}
              {votedOptionId && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 pointer-events-none opacity-20 ${
                    isSelected ? "bg-[#00BBA7]" : "bg-zinc-500"
                  }`}
                />
              )}

              {/* Option Text & Checkmark */}
              <div className="relative z-10 flex items-center space-x-2">
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00BBA7] shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-400/60 shrink-0" />
                )}
                <span className="truncate">{opt.text}</span>
              </div>

              {/* Percentage Badge */}
              {votedOptionId && (
                <span className="relative z-10 text-[11px] font-bold ml-2 shrink-0">
                  {percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
