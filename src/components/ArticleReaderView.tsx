import React, { useState, useRef, useEffect } from "react";
import { Article, TextHighlight, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { X, Volume2, Pause, Bookmark, Share2, Type, ChevronLeft, Clock, ExternalLink, Sparkles, Zap, Flame } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  article: Article;
  onClose: () => void;
  onToggleBookmark: (article: Article) => void;
  onOpenShare: (article: Article) => void;
  onSelectText: (selectedText: string, paragraphIndex: number) => void;
  highlights: TextHighlight[];
  themeConfig: ThemeConfig;
  onOpenGeminiModal?: () => void;
}

export const ArticleReaderView: React.FC<Props> = ({
  article,
  onClose,
  onToggleBookmark,
  onOpenShare,
  onSelectText,
  highlights,
  themeConfig,
  onOpenGeminiModal
}) => {
  const activePalette = PALETTES[themeConfig.palette][themeConfig.darkMode ? "dark" : "light"];
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [isReadingAudio, setIsReadingAudio] = useState(false);
  const [speechRate] = useState<number>(1);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const articleContainerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Listener
  const handleScroll = () => {
    if (articleContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = articleContainerRef.current;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / totalScroll) * 100)));
      }
    }
  };

  // Browser Speech Synthesis for Article Audio Narration
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudioNarration = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isReadingAudio) {
      window.speechSynthesis.cancel();
      setIsReadingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.subtitle}. ${article.content.join(" ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsReadingAudio(false);
      utterance.onerror = () => setIsReadingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsReadingAudio(true);
    }
  };

  const handleParagraphClick = (pText: string, index: number) => {
    setActiveParagraphIndex(index);
    onSelectText(pText, index);
  };

  const fontClass = {
    sm: "text-xs sm:text-sm leading-relaxed",
    md: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-relaxed",
    xl: "text-lg sm:text-xl leading-relaxed"
  }[fontSize];

  const isEntertainmentAlert =
    article.category === "Entertainment" ||
    article.category === "Movies & TV Shows" ||
    article.category === "Celebrity & Pop Culture" ||
    article.title.toLowerCase().includes("alert") ||
    article.title.toLowerCase().includes("breaking");

  return (
    <motion.div
      id="article-reader-view"
      initial={{ x: "100%", opacity: 1 }}
      animate={{ x: "0%", opacity: 1 }}
      exit={{ x: "100%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`absolute inset-0 z-50 flex flex-col transition-colors duration-300 ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Scroll Reading Progress Bar at Top */}
      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-50 shrink-0">
        <div
          className={`h-full transition-all duration-150 ${activePalette.primary}`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Settings Header */}
      <header
        className={`px-3 py-2.5 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md shrink-0 ${
          themeConfig.darkMode ? "bg-zinc-950/95 border-zinc-900" : "bg-white/95 border-zinc-200"
        }`}
      >
        <button
          id="reader-back-btn"
          onClick={onClose}
          className={`p-1.5 rounded-full transition-all ${
            themeConfig.darkMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-700"
          }`}
          title="Back to Feed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Reader Controls: Font Size & TTS */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-0.5 px-2 py-1 rounded-full border border-zinc-300 dark:border-zinc-800 text-xs">
            <Type className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            <button
              onClick={() => setFontSize("sm")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                fontSize === "sm" ? "bg-[#00BBA7] text-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("md")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                fontSize === "md" ? "bg-[#00BBA7] text-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                fontSize === "lg" ? "bg-[#00BBA7] text-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              A+
            </button>
          </div>

          <button
            id="reader-tts-btn"
            onClick={toggleAudioNarration}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 border transition-all ${
              isReadingAudio
                ? "bg-[#00BBA7] text-black border-[#00BBA7] animate-pulse"
                : themeConfig.darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200"
            }`}
          >
            {isReadingAudio ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00BBA7]" />}
            <span className="hidden sm:inline">{isReadingAudio ? "Pause" : "Listen"}</span>
          </button>
        </div>

        {/* Right Header Actions: New Tab & Close Button */}
        <div className="flex items-center space-x-1.5">
          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-full border transition-all ${
              themeConfig.darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-[#00BBA7]"
                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-[#00BBA7]"
            }`}
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            id="reader-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            title="Close Article"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Readable Body Container */}
      <div
        ref={articleContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 max-w-2xl mx-auto w-full space-y-5 pb-28 min-h-0"
      >
        {/* Entertainment / Breaking News Alert Banner Badge */}
        {isEntertainmentAlert && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-black w-fit animate-pulse">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="uppercase tracking-wider">Entertainment Alert</span>
          </div>
        )}

        {/* Article Header Metadata */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-semibold mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#00BBA7]/15 text-[#00BBA7]">
              {article.category}
            </span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#00BBA7]" />
              <span>{article.publishedAt}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-2">
            {article.title}
          </h1>

          <p className="text-xs sm:text-sm font-medium opacity-85 leading-relaxed italic border-l-2 border-[#00BBA7] pl-3 py-0.5 text-zinc-400">
            {article.subtitle}
          </p>
        </div>

        {/* Feature Cover Image Stage with Responsive Framing */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-900 group">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full max-h-72 object-cover transition-transform duration-500 group-hover:scale-102"
          />
          {article.imageCaption && (
            <p className="p-2 text-[11px] text-center text-zinc-400 italic bg-zinc-900/90 border-t border-zinc-800">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Formatted Article Paragraphs */}
        <div className="space-y-3.5">
          {article.content.map((paragraph, index) => {
            const isSelected = activeParagraphIndex === index;
            const paragraphHighlights = highlights.filter(
              (h) => h.articleId === article.id && h.paragraphIndex === index
            );

            return (
              <p
                key={index}
                onClick={() => handleParagraphClick(paragraph, index)}
                className={`${fontClass} p-3 rounded-2xl transition-all cursor-pointer select-text ${
                  isSelected
                    ? "bg-[#00BBA7]/15 border border-[#00BBA7]/40 shadow-sm"
                    : paragraphHighlights.length > 0
                    ? "bg-teal-500/10 border-l-4 border-teal-500"
                    : "hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60"
                }`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Reader View Sticky Footer */}
      <footer
        className={`px-4 py-3 border-t flex items-center justify-between sticky bottom-0 z-40 backdrop-blur-xl shrink-0 ${
          themeConfig.darkMode
            ? "bg-zinc-950/95 border-zinc-800/80 text-zinc-100"
            : "bg-white/95 border-zinc-200 text-zinc-900"
        }`}
      >
        <div className="flex items-center space-x-2">
          {/* Bookmark / Save Button */}
          <button
            onClick={() => onToggleBookmark(article)}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 border transition-all ${
              article.isBookmarked
                ? "bg-[#00BBA7] text-black border-[#00BBA7] shadow-sm"
                : themeConfig.darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${article.isBookmarked ? "fill-black" : ""}`} />
            <span>{article.isBookmarked ? "Saved" : "Save"}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onOpenShare(article)}
            className={`p-1.5 rounded-full border transition-all ${
              themeConfig.darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-800"
            }`}
            title="Share Article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Reading Progress Indicator */}
        <span className="text-[11px] font-bold text-zinc-500">
          {Math.round(scrollProgress)}% Read • {article.readTime}
        </span>
      </footer>
    </motion.div>
  );
};

