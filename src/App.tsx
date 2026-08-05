import React, { useState, useEffect, useRef, useCallback } from "react";
import { NewsCategory, Article, TextHighlight, ThemeConfig } from "./types";
import { MOCK_ARTICLES } from "./data/mockNews";
import { MaterialTopAppBar } from "./components/MaterialTopAppBar";
import { NewsCardDeck } from "./components/NewsCardDeck";
import { ArticleReaderView } from "./components/ArticleReaderView";
import { MovieDetailView } from "./components/MovieDetailView";
import { FloatingBottomActionBar } from "./components/FloatingBottomActionBar";
import { AndroidStatusBar } from "./components/AndroidStatusBar";
import { AndroidNavigationBar } from "./components/AndroidNavigationBar";
import { GeminiSummaryModal } from "./components/GeminiSummaryModal";
import { ShareSheetModal } from "./components/ShareSheetModal";
import { ThemeSelectorModal } from "./components/ThemeSelectorModal";
import { SavedHighlightsModal } from "./components/SavedHighlightsModal";
import { AuthLoginModal, UserSession } from "./components/AuthLoginModal";
import {
  auth,
  onAuthStateChanged,
  saveArticleToFirestore,
  removeArticleFromFirestore,
  subscribeSavedArticles
} from "./lib/firebase";
import { BottomNavBar, NavTab } from "./components/BottomNavBar";
import { ExploreView } from "./components/ExploreView";
import { ProfileView } from "./components/ProfileView";
import { SavedView } from "./components/SavedView";
import { NewsReelsView } from "./components/NewsReelsView";
import { DeveloperDashboardView } from "./components/DeveloperDashboardView";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  // Application State
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Navigation State & Auto-Hiding Control Menu Timer (3-second timeout)
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Resets or starts the 3-second auto-hide timer for top & bottom menus
  const resetAutoHideTimer = useCallback(() => {
    setIsNavVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsNavVisible(false);
    }, 3000); // 3 seconds
  }, []);

  // Screen touch trigger: reveals menus instantly or resets 3s timer on active touch
  const handleScreenTouch = useCallback(() => {
    resetAutoHideTimer();
  }, [resetAutoHideTimer]);

  // Start 3-second auto-hide timer on mount & activeTab changes
  useEffect(() => {
    resetAutoHideTimer();
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [activeTab, resetAutoHideTimer]);
  
  // Dashboard / Admin URL routing state - Defaults to true for Virtual Anchoring Landing Flow
  const [isDevDashboardOpen, setIsDevDashboardOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reader") === "true" || params.get("mode") === "reader") {
        return false;
      }
    }
    return true; // Default to true so user lands on the Virtual Anchoring Landing Page
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("crm") === "true" ||
        params.get("mode") === "crm" ||
        params.get("admin") === "true" ||
        window.location.hash === "#crm" ||
        window.location.hash === "#admin"
      ) {
        setIsDevDashboardOpen(true);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // User Auth Session State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "staff">("login");
  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem("flickmeter_user_session");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      isLoggedIn: false,
      name: "Cinema Fan",
      email: "member@flickpulse.app",
      provider: "guest"
    };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "Member";
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        setUserSession({
          isLoggedIn: true,
          name: formattedName,
          email: user.email || "user@flickpulse.app",
          avatarUrl: user.photoURL || undefined,
          provider: (user.providerData[0]?.providerId.includes("google") ? "google" : "email") as any,
          uid: user.uid
        });
      } else {
        // Unauthenticated default
        setUserSession((prev) => {
          if (prev.provider === "apple" || prev.provider === "facebook") return prev; // keep simulated session if active
          return {
            isLoggedIn: false,
            name: "Cinema Fan",
            email: "member@flickpulse.app",
            provider: "guest"
          };
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setUserSession({
      isLoggedIn: false,
      name: "Cinema Fan",
      email: "member@flickpulse.app",
      provider: "guest"
    });
    try {
      localStorage.removeItem("flickmeter_user_session");
    } catch (e) {
      console.error(e);
    }
    setIsDevDashboardOpen(true);
    setAuthModalMode("login");
    setAuthModalOpen(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem("flickmeter_user_session", JSON.stringify(userSession));
    } catch (e) {
      // ignore
    }
  }, [userSession]);

  // Subscribe to Firestore saved articles
  useEffect(() => {
    setIsLoadingFeed(true);
    const userId = userSession.uid || "guest_flickpulse_user";
    const unsubscribe = subscribeSavedArticles(
      userId,
      (savedIds) => {
        setArticles((prev) =>
          prev.map((art) => ({
            ...art,
            isBookmarked: savedIds.includes(art.id)
          }))
        );
        setIsLoadingFeed(false);
      },
      (err) => {
        console.warn("Firestore subscription note:", err);
        setIsLoadingFeed(false);
      }
    );

    // Initial timeout to ensure smooth loading skeleton transition
    const timer = setTimeout(() => {
      setIsLoadingFeed(false);
    }, 800);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [userSession.uid]);

  // Theme & Layout Settings
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    palette: "teal",
    darkMode: true,
    useDeviceFrame: true,
    deviceModel: "pixel"
  });

  // Modal Views & Detailed Article State
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [paragraphIndex, setParagraphIndex] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);

  // Dialog Modals State
  const [geminiModalOpen, setGeminiModalOpen] = useState(false);
  const [geminiMode, setGeminiMode] = useState<"bullet_points" | "ask_ai">("bullet_points");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareArticle, setActiveShareArticle] = useState<Article | null>(null);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Filter Articles according to active Category and Search Query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Bookmarking & Firestore Saving Handlers
  const handleToggleBookmark = (articleToToggle: Article) => {
    const isCurrentlyBookmarked = !!articleToToggle.isBookmarked;
    const newBookmarkedState = !isCurrentlyBookmarked;
    const userId = userSession.uid || "guest_flickpulse_user";

    setArticles((prev) =>
      prev.map((art) =>
        art.id === articleToToggle.id ? { ...art, isBookmarked: newBookmarkedState } : art
      )
    );
    if (expandedArticle && expandedArticle.id === articleToToggle.id) {
      setExpandedArticle((prev) => (prev ? { ...prev, isBookmarked: newBookmarkedState } : null));
    }

    if (newBookmarkedState) {
      saveArticleToFirestore(userId, { ...articleToToggle, isBookmarked: true }).catch((e) =>
        console.error("Error saving article to Firestore:", e)
      );
    } else {
      removeArticleFromFirestore(userId, articleToToggle.id).catch((e) =>
        console.error("Error removing article from Firestore:", e)
      );
    }
  };

  const savedArticles = articles.filter((art) => art.isBookmarked);

  // Share Dialog Handler
  const handleOpenShare = (article: Article) => {
    setActiveShareArticle(article);
    setShareModalOpen(true);
  };

  // Text Selection & Highlighting
  const handleTextSelectedInReader = (text: string, pIndex: number) => {
    setSelectedText(text);
    setParagraphIndex(pIndex);
  };

  const handleHighlightText = (color: string) => {
    if (!expandedArticle || !selectedText || paragraphIndex === null) return;
    const newHighlight: TextHighlight = {
      id: `hl-${Date.now()}`,
      articleId: expandedArticle.id,
      articleTitle: expandedArticle.title,
      text: selectedText,
      paragraphIndex,
      color: color as "yellow" | "teal" | "purple" | "coral",
      timestamp: "Just now"
    };
    setHighlights((prev) => [newHighlight, ...prev]);
    setSelectedText(null);
    setParagraphIndex(null);
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen w-full flex items-center justify-center p-0 sm:p-4 transition-colors duration-300 select-none ${
        themeConfig.darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-200 text-zinc-900"
      }`}
    >
      {/* Phone Canvas Container */}
      <div
        id="device-frame-wrapper"
        className={`relative w-full ${
          themeConfig.useDeviceFrame ? "sm:max-w-[410px] sm:h-[840px] sm:rounded-[48px] sm:shadow-2xl" : "max-w-md h-screen sm:h-[840px] sm:rounded-3xl"
        } overflow-hidden border transition-all duration-300 flex flex-col ${
          themeConfig.darkMode
            ? "bg-zinc-950 border-zinc-800 shadow-black/80"
            : "bg-white border-zinc-300 shadow-zinc-400/50"
        }`}
      >
        {/* Hardware Notch / Speaker Punch Cutout */}
        {themeConfig.useDeviceFrame && (
          <div className="hidden sm:block absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-full z-50 pointer-events-none flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-zinc-800/80 border border-zinc-700/60" />
          </div>
        )}

        {/* System Status Bar */}
        <AndroidStatusBar darkMode={themeConfig.darkMode} />

        {/* Main Application Container */}
        <div
          className="flex-1 flex flex-col min-h-0 relative overflow-hidden"
          onClick={handleScreenTouch}
          onTouchStart={handleScreenTouch}
        >
          {/* Main Top Header Bar - Positioned absolute so card position is fixed */}
          <AnimatePresence>
            {isNavVisible && !expandedArticle && activeTab === "home" && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="absolute top-0 left-0 right-0 z-40 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  resetAutoHideTimer();
                }}
              >
                <MaterialTopAppBar
                  themeConfig={themeConfig}
                  onResetFeed={() => {
                    setArticles(MOCK_ARTICLES);
                    resetAutoHideTimer();
                  }}
                  onToggleDeviceFrame={() => {
                    setThemeConfig((prev) => ({ ...prev, useDeviceFrame: !prev.useDeviceFrame }));
                    resetAutoHideTimer();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Tab View Rendering */}
          {activeTab === "home" && (
            <NewsCardDeck
              articles={filteredArticles}
              onExpandArticle={(art) => setExpandedArticle(art)}
              onToggleBookmark={handleToggleBookmark}
              onOpenShare={handleOpenShare}
              onTapBodyText={() => handleScreenTouch()}
              themeConfig={themeConfig}
              isNavVisible={isNavVisible}
              isLoading={isLoadingFeed}
              onResetStack={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                resetAutoHideTimer();
              }}
            />
          )}

          {/* News Reels View (Instagram Reel style video feed) */}
          {activeTab === "reels" && (
            <NewsReelsView
              articles={articles}
              onToggleBookmark={handleToggleBookmark}
              onOpenShare={handleOpenShare}
              onOpenArticle={(art) => setExpandedArticle(art)}
              themeConfig={themeConfig}
            />
          )}

          {/* Saved Articles Screen */}
          <AnimatePresence>
            {activeTab === "saved" && (
              <SavedView
                savedArticles={savedArticles}
                onOpenArticle={(art) => setExpandedArticle(art)}
                onRemoveBookmark={handleToggleBookmark}
                onOpenShare={handleOpenShare}
                onNavigateHome={() => setActiveTab("home")}
                themeConfig={themeConfig}
                isLoading={isLoadingFeed}
              />
            )}
          </AnimatePresence>

          {/* Explore Screen */}
          <AnimatePresence>
            {activeTab === "explore" && (
              <ExploreView
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenSavedModal={() => setSavedModalOpen(true)}
                onOpenThemeModal={() => setThemeModalOpen(true)}
                onOpenGeminiModal={() => {
                  setGeminiMode("bullet_points");
                  setGeminiModalOpen(true);
                }}
                onResetFeed={() => setArticles(MOCK_ARTICLES)}
                onCloseExplore={() => setActiveTab("home")}
                themeConfig={themeConfig}
                savedCount={savedArticles.length}
              />
            )}
          </AnimatePresence>

          {/* Profile Screen */}
          <AnimatePresence>
            {activeTab === "profile" && (
              <ProfileView
                themeConfig={themeConfig}
                onUpdateTheme={(updated) => setThemeConfig((prev) => ({ ...prev, ...updated }))}
                savedCount={savedArticles.length}
                highlightsCount={highlights.length}
                onCloseProfile={() => setActiveTab("home")}
                savedArticles={savedArticles}
                onExpandArticle={(art) => setExpandedArticle(art)}
                onToggleBookmark={handleToggleBookmark}
                userSession={userSession}
                onOpenAuthModal={(mode) => {
                  setAuthModalMode(mode || "login");
                  setAuthModalOpen(true);
                }}
              />
            )}
          </AnimatePresence>

          {/* Developer Admin Dashboard Modal */}
          <AnimatePresence>
            {isDevDashboardOpen && (
              <DeveloperDashboardView
                themeConfig={themeConfig}
                onClose={() => setIsDevDashboardOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Full Width Bottom Navigation Bar */}
          <AnimatePresence>
            {isNavVisible && !expandedArticle && !isDevDashboardOpen && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="absolute bottom-0 left-0 right-0 z-40 w-full pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  resetAutoHideTimer();
                }}
              >
                <BottomNavBar
                  activeTab={activeTab}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    resetAutoHideTimer();
                  }}
                  themeConfig={themeConfig}
                  isVisible={true}
                  savedCount={savedArticles.length}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded Article or Movie Full View */}
          {expandedArticle && (
            expandedArticle.cardType === "movie" || expandedArticle.movieDetails ? (
              <MovieDetailView
                article={expandedArticle}
                onClose={() => {
                  setExpandedArticle(null);
                  setSelectedText(null);
                  setParagraphIndex(null);
                }}
                onToggleBookmark={handleToggleBookmark}
                onOpenShare={handleOpenShare}
                themeConfig={themeConfig}
              />
            ) : (
              <ArticleReaderView
                article={expandedArticle}
                onClose={() => {
                  setExpandedArticle(null);
                  setSelectedText(null);
                  setParagraphIndex(null);
                }}
                onToggleBookmark={handleToggleBookmark}
                onOpenShare={handleOpenShare}
                onSelectText={handleTextSelectedInReader}
                highlights={highlights}
                themeConfig={themeConfig}
                onOpenGeminiModal={() => {
                  setGeminiMode("bullet_points");
                  setGeminiModalOpen(true);
                }}
              />
            )
          )}

          {/* Interactive Floating Bottom Action Sheet Bar */}
          {expandedArticle && selectedText && (
            <FloatingBottomActionBar
              selectedText={selectedText}
              paragraphIndex={paragraphIndex}
              article={expandedArticle}
              onHighlight={handleHighlightText}
              onOpenShare={handleOpenShare}
              onToggleSave={handleToggleBookmark}
              onCloseBar={() => {
                setSelectedText(null);
                setParagraphIndex(null);
              }}
              themeConfig={themeConfig}
            />
          )}
        </div>
      </div>

      {/* Gemini AI Summarizer & Q&A Modal */}
      <GeminiSummaryModal
        isOpen={geminiModalOpen}
        onClose={() => setGeminiModalOpen(false)}
        article={expandedArticle || (filteredArticles.length > 0 ? filteredArticles[0] : null)}
        selectedText={selectedText}
        initialMode={geminiMode}
        themeConfig={themeConfig}
      />

      {/* Share Sheet Dialog Modal */}
      <ShareSheetModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        article={activeShareArticle}
        selectedText={selectedText}
        themeConfig={themeConfig}
      />

      {/* Material You Theme & Frame Customizer Modal */}
      <ThemeSelectorModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themeConfig={themeConfig}
        onUpdateTheme={(updated) => setThemeConfig((prev) => ({ ...prev, ...updated }))}
      />

      {/* Saved Articles & Highlights Gallery Modal */}
      <SavedHighlightsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedArticles={savedArticles}
        highlights={highlights}
        onOpenArticle={(art) => {
          setSavedModalOpen(false);
          setExpandedArticle(art);
        }}
        onRemoveBookmark={handleToggleBookmark}
        onRemoveHighlight={handleRemoveHighlight}
        themeConfig={themeConfig}
      />

      {/* Social Auth & Sign in with Apple Login Modal */}
      <AuthLoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        themeConfig={themeConfig}
        userSession={userSession}
        initialMode={authModalMode}
        onLoginSuccess={(newSession) => setUserSession(newSession)}
        onLogout={handleLogout}
      />


    </div>
  );
}
