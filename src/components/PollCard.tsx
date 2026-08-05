import React, { useState } from "react";
import { ThemeConfig } from "../types";
import { DevPollItem, voteOnPollInFirestore } from "../lib/firebase";
import { Vote, CheckCircle2, Share2, Sparkles, BarChart2, Radio, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PollCardProps {
  poll: DevPollItem;
  userId?: string;
  userVotedOptionId?: string;
  themeConfig?: ThemeConfig;
  onOpenShare?: (poll: DevPollItem) => void;
  isActive?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  userId = "guest_user",
  userVotedOptionId,
  onOpenShare,
  isActive = true
}) => {
  const [localVotedId, setLocalVotedId] = useState<string | undefined>(
    userVotedOptionId || poll.userVotedOptionId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedNotice, setVotedNotice] = useState(false);

  // Derive total votes and option breakdown
  const currentVotedId = userVotedOptionId || localVotedId;
  const totalVotes = poll.totalVotes || poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = async (optionId: string) => {
    if (isSubmitting) return;
    const prevOptionId = currentVotedId;
    setLocalVotedId(optionId);
    setVotedNotice(true);
    setTimeout(() => setVotedNotice(false), 2500);

    try {
      setIsSubmitting(true);
      await voteOnPollInFirestore(poll.id, optionId, userId, prevOptionId);
    } catch (err) {
      console.warn("Poll vote error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id={`poll-card-${poll.id}`}
      className="w-full h-full max-w-md mx-auto rounded-3xl bg-white border border-zinc-200/80 text-zinc-900 shadow-xl shadow-zinc-200/60 overflow-hidden flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 relative select-none"
    >
      {/* ---------------- TOP HEADER ---------------- */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center space-x-1">
              <Vote className="w-3.5 h-3.5 text-amber-600" />
              <span>{poll.category || "Mollywood"}</span>
            </span>
            {poll.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-zinc-100 text-zinc-600 border border-zinc-200">
                {poll.badge}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </span>
            {onOpenShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShare(poll);
                }}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                title="Share Poll"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ---------------- POLL QUESTION ---------------- */}
        <div className="space-y-1.5 mb-4">
          <h2 className="text-base sm:text-lg font-black text-zinc-900 leading-snug tracking-tight">
            {poll.question}
          </h2>
          <p className="text-xs text-zinc-500 font-medium flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Cast your vote. Results update live from the FlickPulse community.</span>
          </p>
        </div>

        {/* ---------------- OPTIONS LIST (WHITE THEME) ---------------- */}
        <div className="space-y-2.5 my-3">
          {poll.options.map((option) => {
            const isSelected = currentVotedId === option.id;
            const votesCount = option.votes || 0;
            const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;

            return (
              <button
                key={option.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(option.id);
                }}
                disabled={isSubmitting}
                className={`relative w-full p-3.5 rounded-2xl text-left text-xs font-bold overflow-hidden border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/80 text-amber-950 shadow-sm"
                    : "bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/90 text-zinc-800 hover:border-zinc-300"
                }`}
              >
                {/* Smooth Animated Vote Percentage Fill */}
                {currentVotedId && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 pointer-events-none ${
                      isSelected ? "bg-amber-400/25" : "bg-zinc-200/60"
                    }`}
                  />
                )}

                {/* Option Left Side: Checkmark / Bullet + Text */}
                <div className="relative z-10 flex items-center space-x-2.5 min-w-0 pr-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? "bg-amber-500 border-amber-500 text-black shadow-xs"
                        : "border-zinc-300 bg-white group-hover:border-zinc-400"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <span className="truncate text-xs sm:text-sm text-zinc-900 font-bold">
                    {option.text}
                  </span>
                </div>

                {/* Option Right Side: Live Percentage & Vote Count */}
                {currentVotedId && (
                  <div className="relative z-10 flex items-center space-x-1.5 shrink-0 ml-2">
                    <span
                      className={`text-xs font-black ${
                        isSelected ? "text-amber-700" : "text-zinc-600"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- FOOTER & VOTE STATUS ---------------- */}
      <div className="pt-3 border-t border-zinc-100 mt-2">
        <AnimatePresence>
          {votedNotice && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Vote recorded! Synced to Firebase real-time database.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-1.5">
            <BarChart2 className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold text-zinc-800">
              {totalVotes.toLocaleString()} Total Votes
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] font-bold text-zinc-400">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Firebase Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
