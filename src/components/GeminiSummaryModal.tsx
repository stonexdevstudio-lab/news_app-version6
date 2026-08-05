import React, { useState, useEffect } from "react";
import { Article, ThemeConfig } from "../types";
import { PALETTES } from "../utils/theme";
import { Sparkles, X, RefreshCw, Send, CheckCircle2, HelpCircle, FileText, Lightbulb, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  selectedText?: string | null;
  initialMode?: "bullet_points" | "eli5" | "key_takeaways" | "qa";
  themeConfig: ThemeConfig;
}

export const GeminiSummaryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  article,
  selectedText,
  initialMode = "bullet_points",
  themeConfig
}) => {
  const [activeTab, setActiveTab] = useState<"bullet_points" | "eli5" | "key_takeaways" | "qa">(initialMode);
  const [loading, setLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string>("");
  const [aiSource, setAiSource] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen && article && activeTab !== "qa") {
      fetchSummary(activeTab);
    }
  }, [isOpen, article, activeTab]);

  const fetchSummary = async (mode: "bullet_points" | "eli5" | "key_takeaways") => {
    if (!article) return;
    setLoading(true);
    setSummaryResult("");
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: selectedText || article.content.join(" "),
          mode
        })
      });
      const data = await res.json();
      setSummaryResult(data.summary || "No summary response.");
      setAiSource(data.source || "gemini");
    } catch (err) {
      console.error(err);
      setSummaryResult("Failed to generate summary. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuestion.trim() || !article) return;

    const q = userQuestion.trim();
    setUserQuestion("");
    setChatHistory((prev) => [...prev, { sender: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.content.join(" "),
          question: q
        })
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: "ai", text: data.answer || "No response received." }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { sender: "ai", text: "Error asking Gemini assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={`w-full max-w-lg rounded-t-3xl border-t shadow-2xl flex flex-col max-h-[85vh] ${
            themeConfig.darkMode ? "bg-zinc-900 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Material Bottom Sheet Drag Pill Header */}
          <div className="pt-3 pb-2 flex flex-col items-center">
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-2" />

            <div className="w-full px-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-amber-300 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-1.5">
                    Gemini AI Reader Assistant
                    {aiSource && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {aiSource.includes("gemini") ? "Gemini 3.6 Flash" : "Active"}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate max-w-[220px]">{article.title}</p>
                </div>
              </div>

              <button
                id="gemini-modal-close"
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Tabs Row */}
          <div className="px-5 pt-2 pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("bullet_points")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                activeTab === "bullet_points"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3 Bullets</span>
            </button>

            <button
              onClick={() => setActiveTab("key_takeaways")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                activeTab === "key_takeaways"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Takeaways</span>
            </button>

            <button
              onClick={() => setActiveTab("eli5")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                activeTab === "eli5"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ELI5 Simple</span>
            </button>

            <button
              onClick={() => setActiveTab("qa")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                activeTab === "qa"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Modal Body / Content Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[220px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs font-semibold text-zinc-500 animate-pulse">
                  Gemini AI analyzing article context...
                </p>
              </div>
            ) : activeTab === "qa" ? (
              <div className="space-y-3">
                {chatHistory.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300">
                    <p className="font-bold mb-1">Ask anything about this story!</p>
                    <p className="opacity-80">
                      Examples: "What are the main consequences?", "Who was interviewed?", or "Explain the technical term used."
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl text-xs sm:text-sm ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white ml-8 rounded-tr-none font-medium"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 mr-8 rounded-tl-none border border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                {summaryResult}
              </div>
            )}
          </div>

          {/* Q&A Chat Input Row */}
          {activeTab === "qa" && (
            <form onSubmit={handleSendQuestion} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask Gemini about this article..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim() || loading}
                className="p-2.5 rounded-full bg-amber-500 text-black disabled:opacity-40 hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
