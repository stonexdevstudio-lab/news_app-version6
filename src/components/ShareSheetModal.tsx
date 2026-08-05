import React, { useState } from "react";
import { Article, ThemeConfig } from "../types";
import { X, Copy, Check, Share2, QrCode, MessageCircle, Mail, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  selectedText?: string | null;
  themeConfig: ThemeConfig;
}

export const ShareSheetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  article,
  selectedText,
  themeConfig
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !article) return null;

  const shareText = selectedText
    ? `"${selectedText}" — via ${article.title}`
    : `${article.title} - ${article.publisher}`;
  const shareUrl = `${window.location.origin}/#article-${article.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={`w-full max-w-lg rounded-t-3xl border-t shadow-2xl p-5 ${
            themeConfig.darkMode ? "bg-zinc-900 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Sheet Handle */}
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-4" />

          {/* Title & Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold">Android Share Sheet</h3>
            </div>
            <button
              id="share-sheet-close"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article / Text Snippet Preview Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 mb-5 flex items-start space-x-3">
            <img src={article.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold line-clamp-1">{article.title}</p>
              <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                {selectedText ? `"${selectedText}"` : article.summary}
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-500 mb-1">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </div>
              <span className="text-[11px] font-semibold">{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={() => setShowQR(!showQR)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="p-2.5 rounded-full bg-indigo-500/20 text-indigo-500 mb-1">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold">QR Code</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-500 mb-1">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold">Messages</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="p-2.5 rounded-full bg-rose-500/20 text-rose-500 mb-1">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold">Nearby</span>
            </button>
          </div>

          {/* QR Code Display if toggled */}
          {showQR && (
            <div className="p-4 rounded-2xl bg-white text-zinc-900 flex flex-col items-center justify-center text-center space-y-2 border">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  shareUrl
                )}`}
                alt="Article QR Code"
                className="w-32 h-32 rounded-lg"
              />
              <p className="text-[11px] font-bold text-zinc-600">Scan to read on device</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
