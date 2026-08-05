import React, { useEffect, useState } from "react";
import { Film, Trophy, Vote, Sparkles, Flame, Play, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 200);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-zinc-950 text-white select-none cursor-pointer overflow-hidden"
    >
      {/* Background Ambient Glow FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00BBA7]/20 via-teal-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#00BBA7]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="pt-6 flex items-center space-x-2 z-10"
      >
        <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#00BBA7]/20 text-[#00BBA7] border border-[#00BBA7]/30 flex items-center space-x-1.5 shadow-lg">
          <Sparkles className="w-3 h-3 text-[#00BBA7] animate-pulse" />
          <span>FlickMeter 2025 Edition</span>
        </span>
      </motion.div>

      {/* Center Hero Identity */}
      <div className="flex flex-col items-center text-center z-10 my-auto">
        {/* Animated Brand Badge */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          {/* Pulsing Back Ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#00BBA7] to-teal-400 opacity-30 blur-xl animate-pulse" />
          
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00BBA7] via-teal-400 to-emerald-500 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
              <Film className="w-10 h-10 text-[#00BBA7] stroke-[2.2]" />
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-[#00BBA7] text-black">
                <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title & Tagline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-200 via-[#00BBA7] to-teal-300 bg-clip-text text-transparent mb-2"
        >
          FlickMeter
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-xs font-semibold text-zinc-400 max-w-xs leading-relaxed mb-6"
        >
          Sports & Entertainment Digest • Cinema Polls & Ratings
        </motion.p>

        {/* Content Highlights Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-xs"
        >
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center space-x-1.5">
            <Film className="w-3.5 h-3.5 text-[#00BBA7]" />
            <span>Movies & OTT</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#00BBA7]" />
            <span>Live Sports</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center space-x-1.5">
            <Vote className="w-3.5 h-3.5 text-[#00BBA7]" />
            <span>Fan Polls</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Progress Bar & Skip Prompt */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-xs z-10 pb-4 text-center"
      >
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-3 border border-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00BBA7] to-teal-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <span>Loading Feed... {progress}%</span>
          <span className="text-[#00BBA7] hover:text-[#00cbb5] flex items-center space-x-1 font-extrabold">
            <span>Tap to skip</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
