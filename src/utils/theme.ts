import { ThemePalette } from "../types";

export interface ColorScheme {
  primary: string;
  primaryBg: string;
  primaryText: string;
  surfaceContainer: string;
  surfaceElevated: string;
  accentBadge: string;
  highlightYellow: string;
  highlightTeal: string;
  highlightPurple: string;
  highlightCoral: string;
  cardBorder: string;
}

export const PALETTES: Record<ThemePalette, { light: ColorScheme; dark: ColorScheme }> = {
  teal: {
    light: {
      primary: "bg-[#00BBA7] hover:bg-[#00a392] text-white font-extrabold",
      primaryBg: "bg-[#00BBA7]/10",
      primaryText: "text-[#00BBA7]",
      surfaceContainer: "bg-zinc-100/90",
      surfaceElevated: "bg-white",
      accentBadge: "bg-[#00BBA7]/15 text-[#00BBA7] border-[#00BBA7]/30",
      highlightYellow: "bg-yellow-200/90 text-zinc-900",
      highlightTeal: "bg-[#00BBA7]/25 text-zinc-900 border-b-2 border-[#00BBA7]",
      highlightPurple: "bg-purple-200/90 text-purple-950",
      highlightCoral: "bg-rose-200/90 text-rose-950",
      cardBorder: "border-[#00BBA7]/20"
    },
    dark: {
      primary: "bg-[#00BBA7] hover:bg-[#00cbb5] text-black font-extrabold",
      primaryBg: "bg-zinc-950",
      primaryText: "text-[#00BBA7]",
      surfaceContainer: "bg-zinc-900/90",
      surfaceElevated: "bg-zinc-900",
      accentBadge: "bg-[#00BBA7]/20 text-[#00BBA7] border-[#00BBA7]/40",
      highlightYellow: "bg-amber-400/30 text-amber-200 border-b-2 border-amber-400",
      highlightTeal: "bg-[#00BBA7]/30 text-[#00BBA7] border-b-2 border-[#00BBA7]",
      highlightPurple: "bg-purple-500/30 text-purple-200 border-b-2 border-purple-400",
      highlightCoral: "bg-rose-500/30 text-rose-200 border-b-2 border-rose-400",
      cardBorder: "border-zinc-800"
    }
  },
  peach: {
    light: {
      primary: "bg-rose-500 hover:bg-rose-600 text-white",
      primaryBg: "bg-rose-50/50",
      primaryText: "text-rose-950",
      surfaceContainer: "bg-rose-50/80",
      surfaceElevated: "bg-white",
      accentBadge: "bg-rose-100 text-rose-800 border-rose-200",
      highlightYellow: "bg-yellow-200/90 text-zinc-900",
      highlightTeal: "bg-teal-200/90 text-teal-950",
      highlightPurple: "bg-purple-200/90 text-purple-950",
      highlightCoral: "bg-rose-200/90 text-rose-950",
      cardBorder: "border-rose-100"
    },
    dark: {
      primary: "bg-rose-400 hover:bg-rose-300 text-rose-950 font-bold",
      primaryBg: "bg-zinc-950",
      primaryText: "text-rose-100",
      surfaceContainer: "bg-zinc-900",
      surfaceElevated: "bg-zinc-900",
      accentBadge: "bg-rose-950/80 text-rose-300 border-rose-800/60",
      highlightYellow: "bg-amber-400/30 text-amber-200 border-b-2 border-amber-400",
      highlightTeal: "bg-teal-500/30 text-teal-200 border-b-2 border-teal-400",
      highlightPurple: "bg-purple-500/30 text-purple-200 border-b-2 border-purple-400",
      highlightCoral: "bg-rose-500/30 text-rose-200 border-b-2 border-rose-400",
      cardBorder: "border-zinc-800"
    }
  },
  violet: {
    light: {
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      primaryBg: "bg-indigo-50/50",
      primaryText: "text-indigo-950",
      surfaceContainer: "bg-zinc-100/90",
      surfaceElevated: "bg-white",
      accentBadge: "bg-indigo-100 text-indigo-800 border-indigo-200",
      highlightYellow: "bg-yellow-200/90 text-zinc-900",
      highlightTeal: "bg-teal-200/90 text-teal-950",
      highlightPurple: "bg-indigo-200/90 text-indigo-950",
      highlightCoral: "bg-rose-200/90 text-rose-950",
      cardBorder: "border-indigo-100"
    },
    dark: {
      primary: "bg-indigo-400 hover:bg-indigo-300 text-indigo-950 font-bold",
      primaryBg: "bg-zinc-950",
      primaryText: "text-indigo-100",
      surfaceContainer: "bg-zinc-900",
      surfaceElevated: "bg-zinc-900",
      accentBadge: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60",
      highlightYellow: "bg-amber-400/30 text-amber-200 border-b-2 border-amber-400",
      highlightTeal: "bg-teal-500/30 text-teal-200 border-b-2 border-teal-400",
      highlightPurple: "bg-indigo-500/30 text-indigo-200 border-b-2 border-indigo-400",
      highlightCoral: "bg-rose-500/30 text-rose-200 border-b-2 border-rose-400",
      cardBorder: "border-zinc-800"
    }
  },
  forest: {
    light: {
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      primaryBg: "bg-emerald-50/40",
      primaryText: "text-emerald-950",
      surfaceContainer: "bg-zinc-100/90",
      surfaceElevated: "bg-white",
      accentBadge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      highlightYellow: "bg-yellow-200/90 text-zinc-900",
      highlightTeal: "bg-emerald-200/90 text-emerald-950",
      highlightPurple: "bg-purple-200/90 text-purple-950",
      highlightCoral: "bg-rose-200/90 text-rose-950",
      cardBorder: "border-emerald-100"
    },
    dark: {
      primary: "bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold",
      primaryBg: "bg-zinc-950",
      primaryText: "text-emerald-100",
      surfaceContainer: "bg-zinc-900",
      surfaceElevated: "bg-zinc-900",
      accentBadge: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
      highlightYellow: "bg-amber-400/30 text-amber-200 border-b-2 border-amber-400",
      highlightTeal: "bg-emerald-500/30 text-emerald-200 border-b-2 border-emerald-400",
      highlightPurple: "bg-purple-500/30 text-purple-200 border-b-2 border-purple-400",
      highlightCoral: "bg-rose-500/30 text-rose-200 border-b-2 border-rose-400",
      cardBorder: "border-zinc-800"
    }
  },
  monet: {
    light: {
      primary: "bg-sky-600 hover:bg-sky-700 text-white",
      primaryBg: "bg-sky-50/40",
      primaryText: "text-sky-950",
      surfaceContainer: "bg-zinc-100/90",
      surfaceElevated: "bg-white",
      accentBadge: "bg-sky-100 text-sky-800 border-sky-200",
      highlightYellow: "bg-yellow-200/90 text-zinc-900",
      highlightTeal: "bg-sky-200/90 text-sky-950",
      highlightPurple: "bg-purple-200/90 text-purple-950",
      highlightCoral: "bg-rose-200/90 text-rose-950",
      cardBorder: "border-sky-100"
    },
    dark: {
      primary: "bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold",
      primaryBg: "bg-zinc-950",
      primaryText: "text-sky-100",
      surfaceContainer: "bg-zinc-900",
      surfaceElevated: "bg-zinc-900",
      accentBadge: "bg-sky-950/80 text-sky-300 border-sky-800/60",
      highlightYellow: "bg-amber-400/30 text-amber-200 border-b-2 border-amber-400",
      highlightTeal: "bg-sky-500/30 text-sky-200 border-b-2 border-sky-400",
      highlightPurple: "bg-purple-500/30 text-purple-200 border-b-2 border-purple-400",
      highlightCoral: "bg-rose-500/30 text-rose-200 border-b-2 border-rose-400",
      cardBorder: "border-zinc-800"
    }
  }
};
