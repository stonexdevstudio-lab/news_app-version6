import React, { useState, useEffect } from "react";
import { ThemeConfig, Article, PollData, MovieReviewItem, UserReview, MedicalArticle, MedicalArticleStatus, CardType } from "../types";
import {
  DevPollItem,
  subscribePolls,
  savePollToFirestore,
  deletePollFromFirestore,
  seedInitialPollsIfEmpty,
  saveMovieReviewToFirestore,
  deleteMovieReviewFromFirestore,
  subscribeMovieReviews,
  seedInitialMovieReviewsIfEmpty,
  submitUserRatingToFirestore,
  subscribeAllUserMovieRatings,
  wipeAllUserMovieRatingsFromFirestore,
  saveMedicalArticleToFirestore,
  deleteMedicalArticleFromFirestore,
  subscribeMedicalArticles,
  seedInitialMedicalArticlesIfEmpty
} from "../lib/firebase";
import { INITIAL_MEDICAL_ARTICLES } from "../data/medicalNews";
import { LiveUserMovieRatingRecord } from "../types";
import {
  Code,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Vote,
  Star,
  Image as ImageIcon,
  Film,
  Newspaper,
  BarChart2,
  RefreshCw,
  Sparkles,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  Calculator,
  Copy,
  Search,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Users,
  ThumbsUp,
  Layers,
  Activity,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Award,
  Calendar,
  Clock,
  Pin,
  LogOut,
  KeyRound,
  User,
  Lock,
  Building2,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  themeConfig: ThemeConfig;
  onClose: () => void;
  onArticlesUpdated?: () => void;
}

type DevSection = "articles" | "reviews" | "polls" | "ratings" | "gallery" | "reels" | "rates" | "schema";

// Types for developer manual management
export type { DevPollItem };

export interface DevMovieRating {
  id: string;
  movieTitle: string;
  category: string;
  posterUrl: string;
  rating: number;
  reviewNote?: string;
  date: string;
}

export interface DevGalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  likes: number;
}

export interface DevReelItem {
  id: string;
  title: string;
  category: string;
  publisher: string;
  videoUrl: string;
  posterUrl: string;
  likes: number;
  audioTrack: string;
}

const INITIAL_MOVIE_REVIEWS: MovieReviewItem[] = [
  {
    id: "mov-rev-1",
    movieTitle: "L2 Empuraan",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    releaseYear: "2025",
    duration: "2h 45m",
    genres: ["Action", "Thriller", "Drama"],
    director: "Prithviraj Sukumaran",
    cast: ["Mohanlal", "Prithviraj Sukumaran", "Manju Warrier", "Tovino Thomas"],
    synopsis: "Stephen Nedumpally returns in the epic sequel to Lucifer. A globe-trotting political action spectacle following the rise of Khureshi Ab'raam across continents.",
    averageRating: 9.4,
    totalVotes: 32450,
    ratingDistribution: {
      stars10: 18500,
      stars9: 9200,
      stars8: 3100,
      stars7: 1200,
      stars6: 300,
      stars5: 100,
      stars4: 30,
      stars3: 10,
      stars2: 5,
      stars1: 5
    },
    reviews: [
      {
        id: "rev-1",
        userName: "CinemaBuff_99",
        userEmail: "devfourflicks@gmail.com",
        userScore: 10,
        reviewTitle: "Pure Masterclass in Mass Cinema!",
        reviewComment: "Prithviraj's direction is world class. Mohanlal screen presence is unmatched!",
        date: "Today"
      },
      {
        id: "rev-2",
        userName: "Anand M.",
        userEmail: "anand@gmail.com",
        userScore: 9,
        reviewTitle: "High Voltage BGM & Stunning Visuals",
        reviewComment: "Deep character arcs, international scale, and incredible cinematography.",
        date: "Yesterday"
      }
    ]
  },
  {
    id: "mov-rev-2",
    movieTitle: "Aavesham",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    releaseYear: "2024",
    duration: "2h 38m",
    genres: ["Action", "Comedy"],
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Hipzster", "Mithun Jai Shankar"],
    synopsis: "Three engineering students in Bengaluru end up seeking the help of a local gangster named Ranga to deal with their college seniors.",
    averageRating: 9.2,
    totalVotes: 48900,
    ratingDistribution: {
      stars10: 26000,
      stars9: 14000,
      stars8: 6000,
      stars7: 2000,
      stars6: 600,
      stars5: 200,
      stars4: 60,
      stars3: 20,
      stars2: 10,
      stars1: 10
    },
    reviews: [
      {
        id: "rev-3",
        userName: "RangaFan",
        userEmail: "rangaff@flickpulse.app",
        userScore: 10,
        reviewTitle: "Eda Moneee! Absolute Blast!",
        reviewComment: "Fahadh Faasil performance is iconic. Sushin Shyam BGM elevates every frame!",
        date: "3 days ago"
      }
    ]
  },
  {
    id: "mov-rev-3",
    movieTitle: "ARM (Ajayante Randam Mosanam)",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    releaseYear: "2024",
    duration: "2h 30m",
    genres: ["Action", "Fantasy"],
    director: "Jithin Laal",
    cast: ["Tovino Thomas", "Krithi Shetty", "Aishwarya Rajesh"],
    synopsis: "Set in Northern Kerala across three timelines: 1900, 1950, and 1990. Three generations of heroes attempt to protect a mystical treasure.",
    averageRating: 8.8,
    totalVotes: 21500,
    ratingDistribution: {
      stars10: 9800,
      stars9: 7200,
      stars8: 3100,
      stars7: 1000,
      stars6: 300,
      stars5: 70,
      stars4: 20,
      stars3: 5,
      stars2: 3,
      stars1: 2
    },
    reviews: [
      {
        id: "rev-4",
        userName: "TovinoClub",
        userEmail: "tovino@flickpulse.app",
        userScore: 9,
        reviewTitle: "Triple Role Triumph for Tovino!",
        reviewComment: "Visual spectacle with rich folklore elements and high action sequences.",
        date: "1 week ago"
      }
    ]
  }
];

const INITIAL_DEV_POLLS: DevPollItem[] = [
  {
    id: "dpoll-1",
    category: "Mollywood",
    badge: "Anticipation",
    question: "Which upcoming Malayalam mega-project are you most hyped for in 2025?",
    totalVotes: 32450,
    options: [
      { id: "opt-1", text: "L2 Empuraan (Mohanlal & Prithviraj)", votes: 16800 },
      { id: "opt-2", text: "Barroz 3D (Mohanlal Directorial)", votes: 6200 },
      { id: "opt-3", text: "Lokah Samasthah (Pan-India Sci-Fi)", votes: 5400 },
      { id: "opt-4", text: "Premalu 2 (Girish A.D.)", votes: 4050 }
    ]
  },
  {
    id: "dpoll-2",
    category: "Box Office",
    badge: "Record Tracker",
    question: "Will L2 Empuraan break the ₹200 Crore worldwide box office mark for Malayalam cinema?",
    totalVotes: 28900,
    options: [
      { id: "opt-11", text: "Yes, easily ₹250Cr+ worldwide", votes: 19800 },
      { id: "opt-12", text: "Crosses ₹150Cr-₹200Cr mark", votes: 6100 },
      { id: "opt-13", text: "Depends heavily on GCC & OTT deals", votes: 3000 }
    ]
  },
  {
    id: "dpoll-3",
    category: "Performances",
    badge: "Fan Choice",
    question: "Who delivered the best Lead Actor performance in Malayalam Cinema recently?",
    totalVotes: 41200,
    options: [
      { id: "opt-21", text: "Fahadh Faasil (Aavesham)", votes: 18200 },
      { id: "opt-22", text: "Mammootty (Bramayugam)", votes: 15400 },
      { id: "opt-23", text: "Prithviraj (Aadujeevitham)", votes: 5200 },
      { id: "opt-24", text: "Tovino Thomas (ARM)", votes: 2400 }
    ]
  }
];

const INITIAL_DEV_RATINGS: DevMovieRating[] = [
  {
    id: "rat-1",
    movieTitle: "Aavesham",
    category: "Action Comedy",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=300",
    rating: 9.5,
    reviewNote: "Fahadh Faasil was energetic and chaotic as Ranga. Top tier Sushin Shyam BGM!",
    date: "Analyzed Data"
  },
  {
    id: "rat-2",
    movieTitle: "Bramayugam",
    category: "Horror Mystery",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300",
    rating: 10,
    reviewNote: "Black & white atmospheric masterpiece. Mammootty's performance is legendary.",
    date: "Analyzed Data"
  },
  {
    id: "rat-3",
    movieTitle: "Dune: Part Two",
    category: "Sci-Fi Epic",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300",
    rating: 9,
    reviewNote: "Insane IMAX scale and sound design by Hans Zimmer.",
    date: "Analyzed Data"
  }
];

const INITIAL_DEV_GALLERY: DevGalleryItem[] = [
  {
    id: "gal-1",
    title: "L2 Empuraan - Mohanlal First Look Still",
    category: "Mollywood",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    caption: "Exclusive high-resolution still from Prithviraj Sukumaran's L2 Empuraan.",
    likes: 14200
  },
  {
    id: "gal-2",
    title: "Aavesham - Fahadh Faasil Ranga Look",
    category: "Mollywood",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
    caption: "Fahadh Faasil as Ranga in Jithu Madhavan's blockbuster entertainer Aavesham.",
    likes: 18900
  },
  {
    id: "gal-3",
    title: "Barroz 3D - Cinematic Canvas",
    category: "Pan-India",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200",
    caption: "Behind-the-scenes visual composition from Mohanlal's 3D fantasy Barroz.",
    likes: 9800
  }
];

const INITIAL_DEV_REELS: DevReelItem[] = [
  {
    id: "reel-1",
    title: "L2 Empuraan Teaser Breakdown & Easter Eggs",
    category: "Mollywood",
    publisher: "FlickPulse Reels",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    likes: 15400,
    audioTrack: "L2 Theme BGM - Stephen Devassy"
  },
  {
    id: "reel-2",
    title: "Top 5 Box Office Records Broken by Malayalam Cinema",
    category: "Box Office",
    publisher: "Mollywood Buzz",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    likes: 21800,
    audioTrack: "Aavesham BGM - Sushin Shyam"
  }
];

export const DeveloperDashboardView: React.FC<Props> = ({
  themeConfig,
  onClose,
  onArticlesUpdated
}) => {
  // Staff Auth Gate State & Role Routing
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem("flickpulse_staff_auth");
      if (stored === "false") return false;
      return true;
    } catch (e) {
      return true;
    }
  });
  const [userRole, setUserRole] = useState<'developer' | 'employee'>(() => {
    try {
      return (localStorage.getItem("flickpulse_staff_role") as 'developer' | 'employee') || 'developer';
    } catch (e) {
      return 'developer';
    }
  });
  const [staffEmail, setStaffEmail] = useState(() => {
    try {
      return localStorage.getItem("flickpulse_staff_email") || "devfourflicks@gmail.com";
    } catch (e) {
      return "devfourflicks@gmail.com";
    }
  });
  const [staffPassword, setStaffPassword] = useState("");
  const [staffAuthError, setStaffAuthError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail.trim() || !staffPassword.trim()) {
      setStaffAuthError("Please provide both Username / Corporate Email and Password.");
      return;
    }

    const emailLower = staffEmail.trim().toLowerCase();
    let role: 'developer' | 'employee' = 'developer';

    if (emailLower.includes("employee") || emailLower === "employee@flickpulse.app") {
      role = 'employee';
    } else {
      role = 'developer';
    }

    setIsStaffAuthenticated(true);
    setUserRole(role);
    setStaffAuthError(null);

    try {
      localStorage.setItem("flickpulse_staff_auth", "true");
      localStorage.setItem("flickpulse_staff_role", role);
      localStorage.setItem("flickpulse_staff_email", staffEmail.trim());
    } catch (e) {}

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  const handleStaffLogout = () => {
    setIsStaffAuthenticated(false);
    try {
      localStorage.removeItem("flickpulse_staff_auth");
      localStorage.removeItem("flickpulse_staff_role");
    } catch (e) {}

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  const [activeSection, setActiveSection] = useState<DevSection>("articles");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // App Emulation Modal state
  const [showAppEmulationModal, setShowAppEmulationModal] = useState(false);
  const [emulationDevice, setEmulationDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // --- ARTICLES & CONTENT STUDIO STATE (Firestore & REST API Synced) ---
  const [articles, setArticles] = useState<MedicalArticle[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_published_articles");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MEDICAL_ARTICLES;
  });

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState("L2 Empuraan Teaser Drops: Mohanlal & Prithviraj Redefine Indian Mass Cinema");
  const [articleCategory, setArticleCategory] = useState("Cinema");
  const [articleStoryType, setArticleStoryType] = useState<CardType>("article");
  const [articleAuthor, setArticleAuthor] = useState("Alex Rivers");
  const [articleExcerpt, setArticleExcerpt] = useState("The awaited teaser for L2 Empuraan showcases breathtaking international scale, high-octane action sequences, and Khureshi Ab'raam's formidable return.");
  const [articleContent, setArticleContent] = useState(
    "The cinematic landscape of Indian cinema witnessed a seismic event today as the official teaser for L2 Empuraan was released across global digital platforms.\n\nDirected by Prithviraj Sukumaran and starring Legendary Superstar Mohanlal, the film expands the universe established in 2019's Lucifer into an international crime thrill saga.\n\nWith high-definition visuals shot across Europe, Asia, and North America, Empuraan promises unprecedented production values."
  );
  const [articleImageUrl, setArticleImageUrl] = useState("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800");
  const [articleGalleryImages, setArticleGalleryImages] = useState(
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800"
  );
  const [articleVideoUrl, setArticleVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [articlePollQuestion, setArticlePollQuestion] = useState("Which upcoming Pan-India release are you most excited for?");
  const [articlePollOptions, setArticlePollOptions] = useState("L2 Empuraan, Barroz 3D, Toxic, Coolie");
  const [articleMovieRating, setArticleMovieRating] = useState<number>(9.5);
  const [articleIsPinned, setArticleIsPinned] = useState<boolean>(true);
  const [articlePinPosition, setArticlePinPosition] = useState<number>(1);
  const [articleScheduledTime, setArticleScheduledTime] = useState<string>("2025-08-10T18:00");
  const [pushAlertToggle, setPushAlertToggle] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<"card" | "detail" | "comments">("detail");
  const [isSavingArticle, setIsSavingArticle] = useState<boolean>(false);

  // Firestore Sync for Articles
  useEffect(() => {
    seedInitialMedicalArticlesIfEmpty(INITIAL_MEDICAL_ARTICLES);
    const unsubscribe = subscribeMedicalArticles(
      (liveArticles) => {
        if (liveArticles && liveArticles.length > 0) {
          setArticles(liveArticles);
          try {
            localStorage.setItem("flickpulse_published_articles", JSON.stringify(liveArticles));
          } catch (e) {}
        }
      },
      (err) => {
        console.warn("Firestore medical articles sync warning:", err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Form Reset Helper
  const handleResetArticleForm = () => {
    setEditingArticleId(null);
    setArticleTitle("");
    setArticleExcerpt("");
    setArticleContent("");
    setArticleImageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800");
    setArticleIsPinned(false);
  };

  // 1. PUBLISH Story Handler
  const handlePublishArticle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Comprehensive Form Validations
    if (!articleTitle.trim()) {
      showToast("Validation Error: Article Title is required!");
      return;
    }
    if (!articleCategory) {
      showToast("Validation Error: Please select a Category!");
      return;
    }
    if (!articleContent.trim() && !articleExcerpt.trim()) {
      showToast("Validation Error: Main Content or Excerpt is required!");
      return;
    }
    if (!articleImageUrl.trim()) {
      showToast("Validation Error: Featured Image URL is required!");
      return;
    }

    setIsSavingArticle(true);
    const id = editingArticleId || "art-" + Date.now();
    const contentParagraphs = articleContent.split("\n\n").map((p) => p.trim()).filter(Boolean);
    const galleryList = articleGalleryImages.split(",").map((s) => s.trim()).filter(Boolean);
    const pollOptList = articlePollOptions.split(",").map((s) => s.trim()).filter(Boolean);

    const newArticle: MedicalArticle = {
      id,
      title: articleTitle.trim(),
      category: articleCategory,
      cardType: articleStoryType,
      doctorName: articleAuthor.trim() || "Staff Reporter",
      doctorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      excerpt: articleExcerpt.trim() || "Story overview...",
      content: contentParagraphs.length > 0 ? contentParagraphs : [articleExcerpt],
      date: new Date().toISOString().split("T")[0],
      views: Math.floor(Math.random() * 5000) + 1200,
      status: "Active",
      imageUrl: articleImageUrl.trim() || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
      galleryImages: galleryList,
      videoUrl: articleVideoUrl.trim(),
      pollQuestion: articlePollQuestion.trim(),
      pollOptions: pollOptList,
      movieRating: articleMovieRating,
      pinPosition: articleIsPinned ? articlePinPosition : undefined
    };

    const updated = [newArticle, ...articles.filter((a) => a.id !== id)];
    setArticles(updated);
    try {
      localStorage.setItem("flickpulse_published_articles", JSON.stringify(updated));
    } catch (err) {}

    // Save to Firestore
    await saveMedicalArticleToFirestore(newArticle);

    // Call REST API backend endpoint
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newArticle, isPinned: articleIsPinned })
      });
    } catch (err) {}

    // 5-Minute Delayed Push Notification Engine Trigger
    if (pushAlertToggle) {
      try {
        await fetch("/api/push/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId: newArticle.id,
            title: newArticle.title,
            category: newArticle.category,
            delayMinutes: 5
          })
        });
      } catch (err) {}
    }

    if (onArticlesUpdated) onArticlesUpdated();
    setIsSavingArticle(false);

    if (pushAlertToggle) {
      showToast(`Published successfully. Push alert queued for 5 minutes.`);
    } else {
      showToast(`Story "${newArticle.title.slice(0, 25)}..." Published Live to Mobile Database!`);
    }
  };

  // Cancel scheduled push handler
  const handleCancelScheduledPush = async (articleId: string) => {
    try {
      await fetch("/api/push/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId })
      });
      showToast("Scheduled push alert CANCELLED for story.");
    } catch (err) {
      showToast("Cancelled scheduled push notification.");
    }
  };

  // 2. SAVE DRAFT Story Handler
  const handleSaveDraftArticle = async () => {
    if (!articleTitle.trim()) {
      showToast("Error: Provide a Title before saving a draft!");
      return;
    }

    setIsSavingArticle(true);
    const id = editingArticleId || "art-" + Date.now();
    const contentParagraphs = articleContent.split("\n\n").map((p) => p.trim()).filter(Boolean);

    const draftArticle: MedicalArticle = {
      id,
      title: articleTitle.trim(),
      category: articleCategory,
      cardType: articleStoryType,
      doctorName: articleAuthor.trim() || "Staff Author",
      excerpt: articleExcerpt.trim() || "Draft overview...",
      content: contentParagraphs,
      date: "Draft",
      views: 0,
      status: "Draft",
      imageUrl: articleImageUrl.trim() || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
    };

    const updated = [draftArticle, ...articles.filter((a) => a.id !== id)];
    setArticles(updated);
    try {
      localStorage.setItem("flickpulse_published_articles", JSON.stringify(updated));
    } catch (err) {}

    await saveMedicalArticleToFirestore(draftArticle);
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftArticle)
      });
    } catch (err) {}

    setIsSavingArticle(false);
    showToast("Story saved as Draft in database.");
  };

  // 3. SCHEDULE Story Handler
  const handleScheduleArticle = async () => {
    if (!articleTitle.trim()) {
      showToast("Error: Title is required to schedule!");
      return;
    }

    setIsSavingArticle(true);
    const id = editingArticleId || "art-" + Date.now();
    const formattedDate = articleScheduledTime ? articleScheduledTime.replace("T", " ") : "2025-08-10 18:00";

    const scheduledArticle: MedicalArticle = {
      id,
      title: articleTitle.trim(),
      category: articleCategory,
      cardType: articleStoryType,
      doctorName: articleAuthor.trim() || "Staff Journalist",
      excerpt: articleExcerpt.trim(),
      content: articleContent.split("\n\n"),
      date: formattedDate,
      views: 0,
      status: "Scheduled",
      imageUrl: articleImageUrl.trim() || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
    };

    const updated = [scheduledArticle, ...articles.filter((a) => a.id !== id)];
    setArticles(updated);
    try {
      localStorage.setItem("flickpulse_published_articles", JSON.stringify(updated));
    } catch (err) {}

    await saveMedicalArticleToFirestore(scheduledArticle);
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scheduledArticle, scheduledTime: formattedDate })
      });
    } catch (err) {}

    setIsSavingArticle(false);
    showToast(`Story scheduled for ${formattedDate}!`);
  };

  // 4. PIN / UNPIN Toggle Handler
  const handleTogglePinArticle = (targetArticleId?: string) => {
    if (targetArticleId) {
      const updated = articles.map((a) => {
        if (a.id === targetArticleId) {
          const newPinned = !(a.pinPosition && a.pinPosition > 0);
          return { ...a, pinPosition: newPinned ? 1 : undefined };
        }
        return a;
      });
      setArticles(updated);
      showToast("Story Pin status toggled!");
    } else {
      setArticleIsPinned(!articleIsPinned);
      showToast(articleIsPinned ? "Story Unpinned" : "Story Pinned to Slot #1!");
    }
  };

  // 5. LOAD ARTICLE FOR EDIT Handler
  const handleLoadArticleForEdit = (art: MedicalArticle) => {
    setEditingArticleId(art.id);
    setArticleTitle(art.title);
    setArticleCategory(art.category || "Cinema");
    setArticleStoryType(art.cardType || "article");
    setArticleAuthor(art.doctorName || "Staff Author");
    setArticleExcerpt(art.excerpt || "");
    setArticleContent(Array.isArray(art.content) ? art.content.join("\n\n") : art.excerpt || "");
    setArticleImageUrl(art.imageUrl || "");
    setArticleGalleryImages(art.galleryImages ? art.galleryImages.join(", ") : "");
    setArticleVideoUrl(art.videoUrl || "");
    setArticlePollQuestion(art.pollQuestion || "");
    setArticlePollOptions(art.pollOptions ? art.pollOptions.join(", ") : "");
    setArticleMovieRating(art.movieRating || 9.0);
    setArticleIsPinned(Boolean(art.pinPosition && art.pinPosition > 0));
    setArticlePinPosition(art.pinPosition || 1);
    showToast(`Loaded "${art.title.slice(0, 25)}..." into WYSIWYG Editor!`);
  };

  // 6. DELETE Story Handler
  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure you want to delete this story from the database?")) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      try {
        localStorage.setItem("flickpulse_published_articles", JSON.stringify(updated));
      } catch (e) {}

      await deleteMedicalArticleFromFirestore(id);
      try {
        await fetch(`/api/articles/${id}`, { method: "DELETE" });
      } catch (e) {}

      if (onArticlesUpdated) onArticlesUpdated();
      showToast("Story deleted from database.");
    }
  };

  // --- MOVIE REVIEWS STATE & FIRESTORE SYNC ---
  const [movieReviews, setMovieReviews] = useState<MovieReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_movie_reviews");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MOVIE_REVIEWS;
  });

  const [selectedMovieId, setSelectedMovieId] = useState<string>("mov-rev-1");

  useEffect(() => {
    seedInitialMovieReviewsIfEmpty(INITIAL_MOVIE_REVIEWS);
    const unsubscribe = subscribeMovieReviews(
      (liveReviews) => {
        if (liveReviews && liveReviews.length > 0) {
          setMovieReviews(liveReviews);
          try {
            localStorage.setItem("flickpulse_movie_reviews", JSON.stringify(liveReviews));
          } catch (e) {}
        }
      },
      (err) => {
        console.warn("Firestore movie reviews sync warning:", err);
      }
    );
    return () => unsubscribe();
  }, []);

  const activeMovie = movieReviews.find((m) => m.id === selectedMovieId) || movieReviews[0] || INITIAL_MOVIE_REVIEWS[0];

  // Movie Form State
  const [revTitle, setRevTitle] = useState(activeMovie?.movieTitle || "");
  const [revPoster, setRevPoster] = useState(activeMovie?.posterUrl || "");
  const [revYear, setRevYear] = useState(activeMovie?.releaseYear || "2025");
  const [revDuration, setRevDuration] = useState(activeMovie?.duration || "2h 45m");
  const [revGenres, setRevGenres] = useState(activeMovie?.genres ? activeMovie.genres.join(", ") : "Action, Thriller, Drama");
  const [revDirector, setRevDirector] = useState(activeMovie?.director || "");
  const [revCast, setRevCast] = useState(activeMovie?.cast ? activeMovie.cast.join(", ") : "");
  const [revSynopsis, setRevSynopsis] = useState(activeMovie?.synopsis || "");
  const [revAvgScore, setRevAvgScore] = useState<number>(activeMovie?.averageRating || 9.0);
  const [revTotalVotes, setRevTotalVotes] = useState<number>(activeMovie?.totalVotes || 1000);

  // Sync Form when selected movie changes
  useEffect(() => {
    if (activeMovie) {
      setRevTitle(activeMovie.movieTitle);
      setRevPoster(activeMovie.posterUrl);
      setRevYear(activeMovie.releaseYear);
      setRevDuration(activeMovie.duration || "2h 30m");
      setRevGenres(activeMovie.genres ? activeMovie.genres.join(", ") : "Action, Thriller");
      setRevDirector(activeMovie.director || "");
      setRevCast(activeMovie.cast ? activeMovie.cast.join(", ") : "");
      setRevSynopsis(activeMovie.synopsis || "");
      setRevAvgScore(activeMovie.averageRating || 9.0);
      setRevTotalVotes(activeMovie.totalVotes || 1000);
    }
  }, [selectedMovieId]);

  // Live User Ratings Records Stream (Firestore Sync)
  const [liveUserRatings, setLiveUserRatings] = useState<LiveUserMovieRatingRecord[]>([]);
  const [ratingSearchQuery, setRatingSearchQuery] = useState<string>("");

  useEffect(() => {
    const unsub = subscribeAllUserMovieRatings((records) => {
      setLiveUserRatings(records);
    });
    return () => unsub();
  }, []);

  const handleWipeAllRatingData = async () => {
    if (confirm("Are you sure you want to wipe all outdated/live user movie rating records from the database? This action clears all user rating logs.")) {
      await wipeAllUserMovieRatingsFromFirestore();
      setLiveUserRatings([]);
      showToast("All user rating records wiped & database reset!");
    }
  };
  // WR = (v / (v + m)) * R + (m / (v + m)) * C
  const [minVotesM, setMinVotesM] = useState<number>(500); // m: Minimum votes required to qualify
  const [globalMeanC, setGlobalMeanC] = useState<number>(7.0); // C: Database mean vote constant
  const [ratingDisplayMode, setRatingDisplayMode] = useState<"weighted" | "raw">("weighted");
  const [showImdbInfoModal, setShowImdbInfoModal] = useState<boolean>(false);

  // Helper: Calculate IMDb Bayesian Weighted Rating WR
  const calculateBayesianRating = (
    votes: number,
    rawAvg: number,
    m: number = minVotesM,
    c: number = globalMeanC
  ): number => {
    if (votes <= 0) return Number(c.toFixed(1));
    const wr = (votes / (votes + m)) * rawAvg + (m / (votes + m)) * c;
    return Number(wr.toFixed(2));
  };

  // Helper: Calculate Median rating from distribution
  const calculateMedianRating = (distribution?: Record<string, number>): number => {
    if (!distribution) return 8.0;
    let total = 0;
    const items: { star: number; count: number }[] = [];
    for (let s = 1; s <= 10; s++) {
      const count = distribution[`stars${s}`] || 0;
      total += count;
      items.push({ star: s, count });
    }
    if (total === 0) return 8.0;
    let running = 0;
    for (const item of items) {
      running += item.count;
      if (running >= total / 2) {
        return item.star;
      }
    }
    return 8.0;
  };

  // Form to add a user review
  const [newReviewUser, setNewReviewUser] = useState("devfourflicks@gmail.com");
  const [newReviewScore, setNewReviewScore] = useState<number>(10);
  const [newReviewHeadline, setNewReviewHeadline] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  const handleSaveMovieConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle.trim()) return;

    const genreArray = revGenres.split(",").map((s) => s.trim()).filter(Boolean);
    const castArray = revCast.split(",").map((s) => s.trim()).filter(Boolean);

    const updatedItem: MovieReviewItem = {
      id: activeMovie.id || ("mov-rev-" + Date.now()),
      movieTitle: revTitle.trim(),
      posterUrl: revPoster.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      releaseYear: revYear.trim() || "2025",
      duration: revDuration.trim() || "2h 30m",
      genres: genreArray.length > 0 ? genreArray : ["Action"],
      director: revDirector.trim() || "Director",
      cast: castArray,
      synopsis: revSynopsis.trim() || "Movie synopsis...",
      averageRating: Number(revAvgScore) || 9.0,
      totalVotes: Number(revTotalVotes) || 100,
      ratingDistribution: activeMovie.ratingDistribution || {
        stars10: 50, stars9: 30, stars8: 10, stars7: 5, stars6: 2,
        stars5: 1, stars4: 1, stars3: 0, stars2: 0, stars1: 1
      },
      reviews: activeMovie.reviews || []
    };

    const updated = movieReviews.map((m) => (m.id === updatedItem.id ? updatedItem : m));
    if (!movieReviews.some((m) => m.id === updatedItem.id)) {
      updated.unshift(updatedItem);
    }

    setMovieReviews(updated);
    try {
      localStorage.setItem("flickpulse_movie_reviews", JSON.stringify(updated));
    } catch (e) {}

    await saveMovieReviewToFirestore(updatedItem);

    // Call backend API endpoint
    try {
      await fetch("/api/movies/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem)
      });
    } catch (e) {}

    showToast(`Movie review "${updatedItem.movieTitle}" saved & synced!`);
  };

  const handleAddUserReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: UserReview = {
      id: "rev-" + Date.now(),
      userName: newReviewUser.split("@")[0] || "User Fan",
      userEmail: newReviewUser,
      userScore: newReviewScore,
      reviewTitle: newReviewHeadline.trim() || `Rated ${newReviewScore}/10 Stars`,
      reviewComment: newReviewComment.trim(),
      date: "Just now"
    };

    // Calculate new vote count and average rating
    const currentVotes = activeMovie.totalVotes;
    const currentAvg = activeMovie.averageRating;
    const newVotes = currentVotes + 1;
    const newAvg = Number(((currentAvg * currentVotes + newReviewScore) / newVotes).toFixed(1));

    const updatedMovie: MovieReviewItem = {
      ...activeMovie,
      totalVotes: newVotes,
      averageRating: newAvg,
      reviews: [newRev, ...(activeMovie.reviews || [])]
    };

    const updatedList = movieReviews.map((m) => (m.id === activeMovie.id ? updatedMovie : m));
    setMovieReviews(updatedList);
    try {
      localStorage.setItem("flickpulse_movie_reviews", JSON.stringify(updatedList));
    } catch (e) {}

    await submitUserRatingToFirestore(activeMovie.id, newRev, {
      movieTitle: activeMovie.movieTitle,
      posterUrl: activeMovie.posterUrl,
      category: "Mollywood",
      synopsis: activeMovie.synopsis,
      languages: ["Malayalam", "English"],
      cast: activeMovie.cast,
      whereToWatch: "Prime Video"
    });

    // Call backend endpoint
    try {
      await fetch("/api/movies/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: activeMovie.id,
          movieTitle: activeMovie.movieTitle,
          userScore: newReviewScore,
          reviewTitle: newRev.reviewTitle,
          reviewComment: newRev.reviewComment,
          userName: newRev.userName,
          userEmail: newRev.userEmail
        })
      });
    } catch (e) {}

    setNewReviewHeadline("");
    setNewReviewComment("");
    showToast(`Review & ${newReviewScore}-Star Rating submitted live!`);
  };

  const handleInteractiveLiveRating = async (stars: number) => {
    const newRev: UserReview = {
      id: "rev-" + Date.now(),
      userName: "Interactive User",
      userEmail: "user@flickpulse.app",
      userScore: stars,
      reviewTitle: `Interactive ${stars}/10 Rating`,
      reviewComment: `Submitted via Live Mobile Rating Bar.`,
      date: "Just now"
    };

    const currentVotes = activeMovie.totalVotes;
    const currentAvg = activeMovie.averageRating;
    const newVotes = currentVotes + 1;
    const newAvg = Number(((currentAvg * currentVotes + stars) / newVotes).toFixed(1));

    // Update distribution
    const dist = { ...activeMovie.ratingDistribution };
    const starKey = `stars${Math.min(10, Math.max(1, stars))}` as keyof typeof dist;
    if (dist[starKey] !== undefined) {
      dist[starKey] += 1;
    }

    const updatedMovie: MovieReviewItem = {
      ...activeMovie,
      totalVotes: newVotes,
      averageRating: newAvg,
      ratingDistribution: dist,
      reviews: [newRev, ...(activeMovie.reviews || [])]
    };

    const updatedList = movieReviews.map((m) => (m.id === activeMovie.id ? updatedMovie : m));
    setMovieReviews(updatedList);

    await submitUserRatingToFirestore(activeMovie.id, newRev, {
      movieTitle: activeMovie.movieTitle,
      posterUrl: activeMovie.posterUrl,
      category: "Mollywood",
      synopsis: activeMovie.synopsis,
      languages: ["Malayalam", "English"],
      cast: activeMovie.cast,
      whereToWatch: "Prime Video"
    });

    try {
      await fetch("/api/movies/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: activeMovie.id,
          movieTitle: activeMovie.movieTitle,
          userScore: stars,
          reviewTitle: newRev.reviewTitle,
          reviewComment: newRev.reviewComment
        })
      });
    } catch (e) {}

    showToast(`Live ${stars}-Star Rating recorded! Average updated to ${newAvg}`);
  };

  // 1. POLLS STATE & FIREBASE SYNC BRIDGE
  const [polls, setPolls] = useState<DevPollItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_dev_polls");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DEV_POLLS;
  });

  useEffect(() => {
    seedInitialPollsIfEmpty(INITIAL_DEV_POLLS);
    const unsubscribe = subscribePolls(
      (livePolls) => {
        if (livePolls && livePolls.length > 0) {
          setPolls(livePolls);
          try {
            localStorage.setItem("flickpulse_dev_polls", JSON.stringify(livePolls));
            localStorage.setItem("flickpulse_dashboard_polls", JSON.stringify(livePolls));
          } catch (e) {}
        }
      },
      (err) => {
        console.warn("Firestore poll sync warning in DeveloperDashboard:", err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Poll Form State
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollCategory, setPollCategory] = useState("Mollywood");
  const [pollBadge, setPollBadge] = useState("Live Vote");
  const [pollOpt1, setPollOpt1] = useState("");
  const [pollOpt2, setPollOpt2] = useState("");
  const [pollOpt3, setPollOpt3] = useState("");

  const handleAddPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOpt1.trim() || !pollOpt2.trim()) return;

    const newPoll: DevPollItem = {
      id: "dpoll-" + Date.now(),
      category: pollCategory,
      badge: pollBadge,
      question: pollQuestion.trim(),
      totalVotes: 100,
      options: [
        { id: "opt-a-" + Date.now(), text: pollOpt1.trim(), votes: 65 },
        { id: "opt-b-" + Date.now(), text: pollOpt2.trim(), votes: 35 },
        ...(pollOpt3.trim()
          ? [{ id: "opt-c-" + Date.now(), text: pollOpt3.trim(), votes: 10 }]
          : [])
      ]
    };

    const updated = [newPoll, ...polls];
    setPolls(updated);
    try {
      localStorage.setItem("flickpulse_dev_polls", JSON.stringify(updated));
      localStorage.setItem("flickpulse_dashboard_polls", JSON.stringify(updated));
    } catch (e) {}

    await savePollToFirestore(newPoll);
    if (onArticlesUpdated) onArticlesUpdated();

    setPollQuestion("");
    setPollOpt1("");
    setPollOpt2("");
    setPollOpt3("");
    showToast("New Live Fan Poll added & synced to Firebase!");
  };

  const handleDeletePoll = async (id: string) => {
    const updated = polls.filter((p) => p.id !== id);
    setPolls(updated);
    try {
      localStorage.setItem("flickpulse_dev_polls", JSON.stringify(updated));
      localStorage.setItem("flickpulse_dashboard_polls", JSON.stringify(updated));
    } catch (e) {}

    await deletePollFromFirestore(id);
    if (onArticlesUpdated) onArticlesUpdated();
    showToast("Poll deleted & removed from Firebase.");
  };

  // 2. MOVIE RATINGS STATE
  const [ratings, setRatings] = useState<DevMovieRating[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_user_movie_ratings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DEV_RATINGS;
  });

  // Movie Rating Form State
  const [movieTitle, setMovieTitle] = useState("");
  const [movieCat, setMovieCat] = useState("Mollywood");
  const [movieScore, setMovieScore] = useState<number>(9);
  const [movieNote, setMovieNote] = useState("");
  const [moviePoster, setMoviePoster] = useState("");

  const handleAddRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    const newRating: DevMovieRating = {
      id: "rat-" + Date.now(),
      movieTitle: movieTitle.trim(),
      category: movieCat,
      posterUrl:
        moviePoster.trim() ||
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=300",
      rating: movieScore,
      reviewNote: movieNote.trim() || undefined,
      date: "Manual Dev Entry"
    };

    const updated = [newRating, ...ratings];
    setRatings(updated);
    localStorage.setItem("flickpulse_user_movie_ratings", JSON.stringify(updated));

    setMovieTitle("");
    setMovieNote("");
    setMoviePoster("");
    showToast("Movie Rating manually saved & updated in User Analysis!");
  };

  const handleDeleteRating = (id: string) => {
    const updated = ratings.filter((r) => r.id !== id);
    setRatings(updated);
    localStorage.setItem("flickpulse_user_movie_ratings", JSON.stringify(updated));
    showToast("Movie Rating manually removed.");
  };

  // 3. GALLERY STATE
  const [gallery, setGallery] = useState<DevGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_dev_gallery");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DEV_GALLERY;
  });

  const [galTitle, setGalTitle] = useState("");
  const [galCat, setGalCat] = useState("Mollywood");
  const [galImgUrl, setGalImgUrl] = useState("");
  const [galCaption, setGalCaption] = useState("");

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galImgUrl.trim()) return;

    const newItem: DevGalleryItem = {
      id: "gal-" + Date.now(),
      title: galTitle.trim(),
      category: galCat,
      imageUrl: galImgUrl.trim(),
      caption: galCaption.trim() || "Cinema HD Gallery Still",
      likes: Math.floor(Math.random() * 5000) + 1000
    };

    const updated = [newItem, ...gallery];
    setGallery(updated);
    localStorage.setItem("flickpulse_dev_gallery", JSON.stringify(updated));

    setGalTitle("");
    setGalImgUrl("");
    setGalCaption("");
    showToast("Gallery image manually published!");
  };

  const handleDeleteGallery = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    localStorage.setItem("flickpulse_dev_gallery", JSON.stringify(updated));
    showToast("Gallery item removed.");
  };

  // 4. REELS STATE
  const [reels, setReels] = useState<DevReelItem[]>(() => {
    try {
      const saved = localStorage.getItem("flickpulse_dev_reels");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DEV_REELS;
  });

  const [reelTitle, setReelTitle] = useState("");
  const [reelCat, setReelCat] = useState("Mollywood");
  const [reelVideoUrl, setReelVideoUrl] = useState("");
  const [reelPosterUrl, setReelPosterUrl] = useState("");
  const [reelAudio, setReelAudio] = useState("");

  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim() || !reelVideoUrl.trim()) return;

    const newReel: DevReelItem = {
      id: "reel-" + Date.now(),
      title: reelTitle.trim(),
      category: reelCat,
      publisher: "FlickPulse Dev Hub",
      videoUrl: reelVideoUrl.trim(),
      posterUrl:
        reelPosterUrl.trim() ||
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
      likes: Math.floor(Math.random() * 10000) + 2000,
      audioTrack: reelAudio.trim() || "FlickPulse Cinema Audio"
    };

    const updated = [newReel, ...reels];
    setReels(updated);
    localStorage.setItem("flickpulse_dev_reels", JSON.stringify(updated));

    setReelTitle("");
    setReelVideoUrl("");
    setReelPosterUrl("");
    setReelAudio("");
    showToast("Video reel manually published to feed!");
  };

  const handleDeleteReel = (id: string) => {
    const updated = reels.filter((r) => r.id !== id);
    setReels(updated);
    localStorage.setItem("flickpulse_dev_reels", JSON.stringify(updated));
    showToast("Reel removed manually.");
  };

  // 5. RATE CALCULATION ENGINE STATE & SANDBOX
  const [baseRate, setBaseRate] = useState<number>(() => {
    return Number(localStorage.getItem("flickpulse_rate_base")) || 15.0;
  });
  const [multiplier, setMultiplier] = useState<number>(() => {
    return Number(localStorage.getItem("flickpulse_rate_multiplier")) || 1.25;
  });
  const [taxPercentage, setTaxPercentage] = useState<number>(() => {
    return Number(localStorage.getItem("flickpulse_rate_tax")) || 5.0;
  });

  // Simulation Sandbox Input
  const [simUnits, setSimUnits] = useState<number>(10);
  const [simWeightFactor, setSimWeightFactor] = useState<number>(1.5);

  const calculatedSubtotal = baseRate + simUnits * multiplier * simWeightFactor;
  const calculatedTax = (calculatedSubtotal * taxPercentage) / 100;
  const calculatedTotal = calculatedSubtotal + calculatedTax;

  const handleSaveRateRules = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("flickpulse_rate_base", baseRate.toString());
    localStorage.setItem("flickpulse_rate_multiplier", multiplier.toString());
    localStorage.setItem("flickpulse_rate_tax", taxPercentage.toString());
    showToast("Rate Engine formula parameters saved & updated live!");
  };

  // SQL DDL Blueprint for DB Schema Module
  const sqlDdlBlueprint = `-- 1. POLLS TABLE
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Mollywood',
    badge VARCHAR(100) DEFAULT 'Live Vote',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    vote_count INT DEFAULT 0
);

-- 2. GALLERY TABLE
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Cinema HD',
    media_url TEXT NOT NULL,
    caption TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. RATE CONFIGURATION TABLE
CREATE TABLE rate_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) NOT NULL,
    base_rate DECIMAL(10,2) NOT NULL DEFAULT 15.00,
    multiplier DECIMAL(5,2) DEFAULT 1.25,
    tax_percentage DECIMAL(5,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW()
);`;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // User Rating Analysis Calculations
  const totalRated = ratings.length;
  const avgRating =
    totalRated > 0
      ? (ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRated).toFixed(1)
      : "0.0";

  // Staff Authentication Gate matching Dark-Theme Staff Login Page Reference Design
  if (!isStaffAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#231154] p-4 sm:p-8 font-['Product_Sans','Plus_Jakarta_Sans',sans-serif] text-white overflow-y-auto selection:bg-cyan-300 selection:text-slate-900">
        
        {/* Main Glass Container Card */}
        <div className="w-full max-w-6xl bg-[#231154] rounded-[36px] overflow-hidden relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12 lg:p-16">
          
          {/* Top-Left Abstract 3D Layered Ribbon Graphic */}
          <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-90 -translate-x-12 -translate-y-12">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="ribbon2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="ribbon3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
              </defs>
              <path d="M-40 80 Q120 -20 220 80 Q320 180 180 280 Q40 380 -40 260 Z" fill="url(#ribbon3)" opacity="0.85" />
              <path d="M-20 40 Q140 -40 260 40 Q380 120 220 240 Q60 360 -20 200 Z" fill="url(#ribbon1)" opacity="0.9" />
              <path d="M0 0 Q160 -60 300 0 Q420 80 260 200 Q100 320 0 160 Z" fill="url(#ribbon2)" opacity="0.95" />
            </svg>
          </div>

          {/* Left Column: Brand & Hero Copy */}
          <div className="lg:col-span-7 space-y-10 relative z-20 max-w-xl">
            
            {/* Logo Header */}
            <div className="flex items-center space-x-3.5">
              {/* White Elephant Silhouette Brand Emblem */}
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-2.5 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
                  <path d="M19.5 7.5C18.12 7.5 17 8.62 17 10V12H15V8C15 5.79 13.21 4 11 4H8C5.24 4 3 6.24 3 9V17C3 18.1 3.9 19 5 19H7V15H9V19H12V15H14V19H16V13.5C16 12.12 17.12 11 18.5 11C19.88 11 21 12.12 21 13.5V17.5C21 18.33 20.33 19 19.5 19C18.67 19 18 18.33 18 17.5V16H16.5V17.5C16.5 19.16 17.84 20.5 19.5 20.5C21.16 20.5 22.5 19.16 22.5 17.5V13.5C22.5 10.19 19.81 7.5 16.5 7.5H19.5Z" />
                  <circle cx="7" cy="8.5" r="1" fill="#231154" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-black text-white tracking-wider">LUCY</span>
                  <span className="text-[10px] font-bold text-purple-300 align-top">TM</span>
                </div>
                <div className="text-xs font-medium text-purple-200/70 tracking-wide">
                  Innovation Starts Here
                </div>
              </div>
            </div>

            {/* Main Tagline */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.2]">
                You will be testing one of Lucy™'s core applications: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-200 to-white">
                  LUCYideas™
                </span>
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="px-6 py-3 rounded-xl border border-purple-300/30 hover:border-purple-300/60 hover:bg-white/10 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              >
                What to Expect?
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-purple-200/80 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Other Future Applications
              </button>
            </div>
          </div>

          {/* Right Column: Glassmorphic Login Card */}
          <div className="lg:col-span-5 relative z-20">
            <div className="bg-[#321c75]/80 backdrop-blur-2xl border border-purple-400/20 rounded-[28px] p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-5 relative">
              
              {/* Title */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Log In to Lucy™
                </h2>
                <button 
                  onClick={onClose}
                  className="text-xs font-semibold text-purple-300/70 hover:text-white transition-colors cursor-pointer"
                  title="Return to Main App"
                >
                  Exit
                </button>
              </div>

              {/* 1-Click Role Registry Preset Selector */}
              <div className="space-y-2 p-3 rounded-2xl bg-[#211152]/90 border border-purple-400/20">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-purple-300/80">
                  <span>Role Registry Login Presets:</span>
                  <span className="text-cyan-300 font-bold">1-Click Auth</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffEmail("thisishimel@gmail.com");
                      setStaffPassword("Emp2025FlickPass");
                      setStaffAuthError(null);
                    }}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                      staffEmail === "thisishimel@gmail.com" || staffEmail.includes("employee")
                        ? "bg-purple-600 text-white border-purple-400 shadow-sm"
                        : "bg-[#28155e] text-purple-200 border-purple-400/20 hover:border-purple-400/40"
                    }`}
                  >
                    <div className="font-bold text-xs">Employee</div>
                    <div className="text-[9px] opacity-80 truncate">thisishimel@gmail.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStaffEmail("devfourflicks@gmail.com");
                      setStaffPassword("Dev2025FlickPass");
                      setStaffAuthError(null);
                    }}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                      staffEmail === "devfourflicks@gmail.com"
                        ? "bg-purple-600 text-white border-purple-400 shadow-sm"
                        : "bg-[#28155e] text-purple-200 border-purple-400/20 hover:border-purple-400/40"
                    }`}
                  >
                    <div className="font-bold text-xs">Developer</div>
                    <div className="text-[9px] opacity-80 truncate">devfourflicks@gmail.com</div>
                  </button>
                </div>
              </div>

              {/* Auth Error Banner */}
              {staffAuthError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                  <span>{staffAuthError}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              <form onSubmit={handleStaffLogin} className="space-y-4">
                
                {/* Field 1: Your Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-purple-200/90">
                    Your Email
                  </label>
                  <div className="relative flex items-center bg-[#211152]/90 border border-purple-400/25 focus-within:border-cyan-300 rounded-xl px-3.5 py-2.5 transition-colors">
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="thisishimel@gmail.com"
                      className="w-full bg-transparent text-xs font-medium text-white placeholder-purple-300/30 outline-none"
                    />
                    <User className="w-4 h-4 text-purple-300/60 ml-2 shrink-0" />
                  </div>
                </div>

                {/* Field 2: Your Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-purple-200/90">
                    Your Password
                  </label>
                  <div className="relative flex items-center bg-[#211152]/90 border border-purple-400/25 focus-within:border-cyan-300 rounded-xl px-3.5 py-2.5 transition-colors">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full bg-transparent text-xs font-medium text-white placeholder-purple-300/30 outline-none tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-purple-300/60 hover:text-white transition-colors ml-2 shrink-0 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgotten Row */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center space-x-2 text-purple-200/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3.5 h-3.5 rounded bg-[#211152] border-purple-400/30 text-purple-600 focus:ring-0 accent-purple-500 cursor-pointer"
                    />
                    <span className="font-medium">Remember</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-purple-200/80 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                  >
                    Forgotten?
                  </button>
                </div>

                {/* Submit Primary Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#98e4f2] hover:bg-[#81dbe9] text-[#1e0e4b] font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-400/20 transition-all cursor-pointer active:scale-98 flex items-center justify-center space-x-2"
                >
                  <span>Log In</span>
                </button>

                {/* Sign Up Section */}
                <div className="pt-2 text-center space-y-2">
                  <span className="text-xs font-medium text-purple-200/70 block">
                    Don't have an account?
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl border border-purple-400/30 hover:border-purple-400/60 hover:bg-white/10 text-white font-bold text-xs tracking-wide transition-all cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

        {/* FORGOT PASSWORD RESTRICTED ALERT MODAL */}
        <AnimatePresence>
          {showForgotPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 font-['Google_Sans',sans-serif]"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative text-slate-900"
              >
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Restricted Access Notice</h3>
                    <p className="text-xs text-purple-600 font-semibold">System Credentials Security Policy</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-purple-200 text-xs text-slate-700 leading-relaxed font-medium space-y-2">
                  <div className="flex items-center space-x-2 text-purple-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Administrator Contact Required</span>
                  </div>
                  <p>
                    Self-service password reset is disabled for internal staff accounts. Password reset is strictly managed by the system administrator. Please contact your <strong className="text-purple-700">Administrator</strong> or <strong className="text-purple-700">Lead Developer</strong> to reset your login credentials.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Understood
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex bg-zinc-950 text-zinc-100 font-sans overflow-hidden"
    >
      {/* ---------------- LEFT NAVIGATION SIDEBAR ---------------- */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/90 flex flex-col shrink-0 hidden md:flex">
        {/* Brand Logo & Live Badge */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              {userRole === "employee" ? <Film className="w-5 h-5 stroke-[2.5]" /> : <Code className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white">
                {userRole === "employee" ? "Cinema Hub" : "Publishing Dashboard"}
              </h1>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {userRole === "employee" ? "Employee Portal" : "Developer Control"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500">
            {userRole === "employee" ? "Employee Publishing" : "Core App Modules"}
          </div>

          {[
            { id: "articles", label: "Articles & Content Studio", icon: Newspaper, count: articles.length },
            { id: "reviews", label: "Movie Reviews (IMDb)", icon: Star, count: movieReviews.length },
            { id: "polls", label: "Polls Engine", icon: Vote, count: polls.length },
            { id: "ratings", label: "Movie Ratings", icon: Star, count: ratings.length },
            { id: "gallery", label: "Gallery Catalog", icon: ImageIcon, count: gallery.length },
            { id: "reels", label: "Video Reels Stream", icon: Film, count: reels.length },
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as DevSection)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "border-black bg-black" : "border-zinc-500 bg-transparent"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </div>
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isSelected
                      ? "bg-black/20 text-black font-extrabold"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}

          {/* Developer-Only Navigation Tools */}
          {userRole === "developer" && (
            <>
              <div className="pt-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                Engine & Blueprint
              </div>

              <button
                onClick={() => setActiveSection("rates")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === "rates"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>Rate Calculator</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-extrabold">
                  {multiplier}x
                </span>
              </button>

              <button
                onClick={() => setActiveSection("schema")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === "schema"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Database DDL</span>
                </div>
                <span className="text-[9px] uppercase px-1 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-black">
                  PostgreSQL
                </span>
              </button>
            </>
          )}
        </div>

        {/* User Account & Status Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/60">
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-xs shrink-0">
                {userRole === "employee" ? "EMP" : "DEV"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-200 truncate">
                  {userRole === "employee" ? "Employee Account" : "Developer Account"}
                </p>
                <p className="text-[10px] text-amber-400 font-mono truncate">{staffEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStaffLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Staff Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN RIGHT CANVAS AREA ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search dashboard items, polls, media assets, articles..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Front End App Emulation Button */}
            <button
              onClick={() => setShowAppEmulationModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-black transition-all flex items-center space-x-2 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer ring-2 ring-purple-500/30"
              title="Open Live Front End Reader App Emulation Frame"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Smartphone className="w-4 h-4" />
              <span>Front End App Emulation</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs active:scale-95 cursor-pointer"
              title="Switch to Full Reader View"
            >
              <span>Full Reader App</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            <button
              onClick={() => {
                const url = window.location.origin + window.location.pathname + "?reader=true";
                navigator.clipboard.writeText(url);
                showToast("Front End Reader Link copied to clipboard!");
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all flex items-center space-x-1.5"
              title="Copy Front End Reader URL"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Copy App Link</span>
            </button>

            <button
              onClick={handleStaffLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              title="Logout and return to Login Landing Page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Tabs (for small screens) */}
        <div className="md:hidden p-2.5 border-b border-zinc-800 bg-zinc-900/80 overflow-x-auto flex space-x-1 shrink-0">
          <button
            onClick={() => setActiveSection("reviews")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              activeSection === "reviews" ? "bg-amber-500 text-black" : "text-zinc-400"
            }`}
          >
            Reviews (IMDb)
          </button>
          <button
            onClick={() => setActiveSection("polls")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              activeSection === "polls" ? "bg-amber-500 text-black" : "text-zinc-400"
            }`}
          >
            Polls
          </button>
          <button
            onClick={() => setActiveSection("ratings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              activeSection === "ratings" ? "bg-amber-500 text-black" : "text-zinc-400"
            }`}
          >
            Ratings
          </button>
          <button
            onClick={() => setActiveSection("gallery")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              activeSection === "gallery" ? "bg-amber-500 text-black" : "text-zinc-400"
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveSection("reels")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              activeSection === "reels" ? "bg-amber-500 text-black" : "text-zinc-400"
            }`}
          >
            Reels
          </button>
          {userRole === "developer" && (
            <>
              <button
                onClick={() => setActiveSection("rates")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                  activeSection === "rates" ? "bg-amber-500 text-black" : "text-zinc-400"
                }`}
              >
                Rates
              </button>
              <button
                onClick={() => setActiveSection("schema")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                  activeSection === "schema" ? "bg-amber-500 text-black" : "text-zinc-400"
                }`}
              >
                Schema
              </button>
            </>
          )}
        </div>

        {/* Scrollable Dashboard Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
          {/* Top Dribbble Metric Stat Cards Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Audience Poll Votes</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Vote className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">61,350</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">Across {polls.length} active polls</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">HD Gallery Assets</span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  {gallery.length + reels.length} Media
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.0%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">S3 / CDN asset synchronization</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Rate Calculator</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Calculator className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  ${baseRate} base
                </span>
                <span className="text-xs font-bold text-amber-400">{multiplier}x</span>
              </div>
              <p className="text-[10px] text-zinc-500">{taxPercentage}% Tax in sandbox</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Analyzed Rating Avg</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Star className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">{avgRating} / 10</span>
                <span className="text-xs font-bold text-purple-400">{totalRated} Movies</span>
              </div>
              <p className="text-[10px] text-zinc-500">Ratings & Reviews Catalog</p>
            </div>
          </div>
        {/* Toast Alert */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-2xl bg-amber-500 text-black font-extrabold text-xs flex items-center space-x-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- SECTION: ARTICLES & CONTENT PUBLISHING STUDIO (WYSIWYG) ---------------- */}
        {activeSection === "articles" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: WYSIWYG FORM CONTROLS & CONTENT PUBLISHER (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Studio Header & Quick Action Toolbar */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                        WYSIWYG Studio
                      </span>
                      {editingArticleId && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                          Editing ID: {editingArticleId}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-black text-white tracking-tight mt-1">
                      Content Publishing Studio
                    </h2>
                    <p className="text-xs text-zinc-400 font-medium">
                      Real-time live mobile sync across News, Sports, IMDb, Photo Galleries, Video Stories & Polls.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetArticleForm}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>New Story</span>
                  </button>
                </div>

                {/* Primary Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSavingArticle}
                    onClick={() => handlePublishArticle()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>{isSavingArticle ? "Publishing..." : "Publish Live Now"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingArticle}
                    onClick={handleSaveDraftArticle}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingArticle}
                    onClick={handleScheduleArticle}
                    className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePinArticle()}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer border ${
                      articleIsPinned
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${articleIsPinned ? "fill-amber-400 text-amber-400" : ""}`} />
                    <span>{articleIsPinned ? "Pinned #1" : "Pin Story"}</span>
                  </button>
                </div>
              </div>

              {/* Form Input Fields & Category-Aware Controls */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                {/* 1. Story Title Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Story Title / Headline *</span>
                    <span className="text-amber-500 font-mono text-[10px]">Real-time Sync Active</span>
                  </label>
                  <input
                    type="text"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="Enter breaking news or article headline..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm font-bold focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>

                {/* 2. Category & Story Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Category Tag
                    </label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-amber-400 text-xs font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Cinema">Cinema & Movies</option>
                      <option value="Movie Reviews">IMDb / Movie Reviews</option>
                      <option value="Sports">Sports & Football</option>
                      <option value="Mollywood">Mollywood (Malayalam)</option>
                      <option value="Kollywood">Kollywood (Tamil)</option>
                      <option value="Bollywood">Bollywood (Hindi)</option>
                      <option value="Hollywood">Hollywood (English)</option>
                      <option value="Box Office">Box Office Tracker</option>
                      <option value="Photo Gallery">Photo Gallery / HD Stills</option>
                      <option value="Video Stories">Video Stories & Reels</option>
                      <option value="Polls">Fan Polls & Live Voting</option>
                      <option value="Fashion">Celebrity & Red Carpet</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Story Format Layout
                    </label>
                    <select
                      value={articleStoryType}
                      onChange={(e) => setArticleStoryType(e.target.value as CardType)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="article">Standard Article (Text + Image)</option>
                      <option value="gallery">Photo Gallery Album Grid</option>
                      <option value="video">Video Reel / Direct Stream</option>
                      <option value="poll">Interactive Fan Poll</option>
                    </select>
                  </div>
                </div>

                {/* 3. Author Name & Scheduled Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Author / Reporter Name
                    </label>
                    <input
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      placeholder="Alex Rivers"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={articleScheduledTime}
                      onChange={(e) => setArticleScheduledTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-blue-400 text-xs font-semibold focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Featured Image URL & Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Featured Image URL
                    </label>
                    <div className="flex space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setArticleImageUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-medium cursor-pointer"
                      >
                        Cinema
                      </button>
                      <button
                        type="button"
                        onClick={() => setArticleImageUrl("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-medium cursor-pointer"
                      >
                        Poster
                      </button>
                      <button
                        type="button"
                        onClick={() => setArticleImageUrl("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-medium cursor-pointer"
                      >
                        Sports
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={articleImageUrl}
                    onChange={(e) => setArticleImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* 5. Category-Aware Dynamic Fields */}
                {articleStoryType === "gallery" && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Gallery Album Image URLs (Comma Separated)</span>
                    </label>
                    <input
                      type="text"
                      value={articleGalleryImages}
                      onChange={(e) => setArticleGalleryImages(e.target.value)}
                      placeholder="https://img1.jpg, https://img2.jpg, https://img3.jpg"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {articleStoryType === "video" && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-blue-400 flex items-center space-x-1">
                      <Film className="w-3.5 h-3.5" />
                      <span>Direct Video Stream MP4 URL</span>
                    </label>
                    <input
                      type="text"
                      value={articleVideoUrl}
                      onChange={(e) => setArticleVideoUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {articleStoryType === "poll" && (
                  <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center space-x-1">
                      <Vote className="w-3.5 h-3.5" />
                      <span>Poll Question & Options</span>
                    </label>
                    <input
                      type="text"
                      value={articlePollQuestion}
                      onChange={(e) => setArticlePollQuestion(e.target.value)}
                      placeholder="Which movie break box office records first?"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-bold focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={articlePollOptions}
                      onChange={(e) => setArticlePollOptions(e.target.value)}
                      placeholder="Option A, Option B, Option C"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-medium focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {articleCategory === "Movie Reviews" && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Movie Score Rating (10-Star Scale)</span>
                      </label>
                      <span className="text-sm font-black text-amber-300">{articleMovieRating} / 10★</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={articleMovieRating}
                      onChange={(e) => setArticleMovieRating(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* 6. Excerpt Summary Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Story Excerpt / Subtitle Summary
                  </label>
                  <textarea
                    rows={2}
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    placeholder="Brief 2-sentence summary shown on feed cards..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-medium focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>

                {/* 7. Main Article Content Paragraphs */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Full Article Content (Double Break for Paragraphs)</span>
                    <span className="text-[10px] text-zinc-500">{articleContent.length} chars</span>
                  </label>
                  <textarea
                    rows={6}
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Type full article paragraphs here..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Pin Slot & Push Broadcast Checkbox */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-800 gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center space-x-2 text-xs font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={articleIsPinned}
                        onChange={(e) => setArticleIsPinned(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Pin Story to Hero Banner #1</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs font-bold text-purple-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushAlertToggle}
                        onChange={(e) => setPushAlertToggle(e.target.checked)}
                        className="w-4 h-4 rounded border-purple-500 bg-zinc-900 text-purple-500 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="flex items-center space-x-1">
                        <Bell className="w-3.5 h-3.5 text-purple-400" />
                        <span>5-Min Delayed Push Alert</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Simulated Mobile Push Notification Broadcast Sent Immediately!")}
                    className="px-3 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Bell className="w-3 h-3 text-purple-400" />
                    <span>Instant Push Alert</span>
                  </button>
                </div>

                {pushAlertToggle && (
                  <div className="w-full mt-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-[11px] font-medium flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>Notice:</strong> Push Notification is scheduled to be sent 5 minutes after publishing to allow final content re-checking.</span>
                  </div>
                )}
              </div>

              {/* PUBLISHED STORIES DATABASE CATALOG TABLE */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Live Database Articles Catalog ({articles.length})</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Firestore & REST Synced</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        editingArticleId === art.id
                          ? "bg-amber-500/10 border-amber-500/40"
                          : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                              {art.category}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                art.status === "Active"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : art.status === "Draft"
                                  ? "bg-zinc-800 text-zinc-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {art.status}
                            </span>
                            {art.pinPosition && art.pinPosition > 0 && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-black flex items-center space-x-0.5">
                                <Pin className="w-2.5 h-2.5 fill-black" />
                                <span>PINNED</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-white truncate mt-0.5">{art.title}</h4>
                          <p className="text-[10px] text-zinc-500">{art.doctorName} • {art.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleLoadArticleForEdit(art)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                          title="Edit in WYSIWYG Editor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelScheduledPush(art.id)}
                          className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all cursor-pointer"
                          title="Cancel Scheduled Push Notification"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePinArticle(art.id)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            art.pinPosition && art.pinPosition > 0
                              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                              : "bg-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                          title="Toggle Pin Position"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME LIVE MOBILE PREVIEW (WYSIWYG) (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-6 p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-3">
                {/* Preview Header Controls */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Live Mobile WYSIWYG
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">LIVE SYNC</span>
                  </div>
                </div>

                {/* Preview Mode Switcher */}
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("card")}
                    className={`py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      previewMode === "card"
                        ? "bg-amber-500 text-black shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Feed Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("detail")}
                    className={`py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      previewMode === "detail"
                        ? "bg-amber-500 text-black shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Full Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("comments")}
                    className={`py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      previewMode === "comments"
                        ? "bg-amber-500 text-black shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Comments ({activeMovie?.reviews?.length || 2})
                  </button>
                </div>

                {/* Simulated Mobile Device Frame (No Outer Bezel) */}
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl text-zinc-100 font-sans">
                  {/* Android / iOS Status Bar */}
                  <div className="px-4 py-2 bg-black/90 border-b border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>9:41 AM</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Navigation Bar */}
                  <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-black font-black text-xs flex items-center justify-center">
                        F
                      </div>
                      <span className="text-xs font-black text-white">FlickPulse News</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <Bell className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </div>

                  {/* PREVIEW CONTENT CONTAINER */}
                  <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
                    {/* Category & Status Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-black uppercase tracking-wider">
                        {articleCategory || "Cinema"}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {pushAlertToggle && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1 animate-pulse">
                            <Clock className="w-2.5 h-2.5 text-purple-400" />
                            <span>Scheduled Push in 5 Mins</span>
                          </span>
                        )}
                        {articleIsPinned && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                            <Pin className="w-2.5 h-2.5 fill-amber-400" />
                            <span>PINNED #1</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm font-black text-white leading-tight">
                      {articleTitle || "Story Title Placeholder..."}
                    </h3>

                    {/* Author & Date Byline */}
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-400 border-b border-zinc-900 pb-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                        alt="Author"
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-zinc-300">{articleAuthor || "Staff Author"}</span>
                      <span>•</span>
                      <span>Today</span>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>

                    {/* CATEGORY-AWARE MEDIA RENDERER */}
                    {previewMode !== "comments" && (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                        {articleStoryType === "gallery" ? (
                          <div className="p-2 space-y-1 bg-zinc-900">
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 mb-1 px-1">
                              <span className="flex items-center space-x-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>HD Photo Gallery Album</span>
                              </span>
                              <span>3 Photos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <img
                                src={articleImageUrl}
                                alt="Gallery 1"
                                className="w-full h-24 rounded-lg object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <img
                                src={articleGalleryImages.split(",")[0] || articleImageUrl}
                                alt="Gallery 2"
                                className="w-full h-24 rounded-lg object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        ) : articleStoryType === "video" ? (
                          <div className="relative aspect-video bg-black flex items-center justify-center">
                            {articleVideoUrl ? (
                              <video
                                src={articleVideoUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <Film className="w-8 h-8 text-amber-500 mx-auto mb-1 animate-pulse" />
                                <span className="text-xs font-bold text-zinc-300">Video Reel Preview</span>
                              </div>
                            )}
                          </div>
                        ) : articleStoryType === "poll" ? (
                          <div className="p-3 bg-gradient-to-br from-zinc-900 to-purple-950/40 space-y-2 border border-purple-500/20 rounded-xl">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold uppercase">
                              LIVE FAN POLL
                            </span>
                            <h4 className="text-xs font-bold text-white">{articlePollQuestion || "Poll Question?"}</h4>
                            <div className="space-y-1.5 pt-1">
                              {articlePollOptions.split(",").map((opt, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-200"
                                >
                                  <span>{opt.trim() || `Option ${i + 1}`}</span>
                                  <span className="text-[10px] text-amber-400 font-mono">
                                    {i === 0 ? "65%" : i === 1 ? "25%" : "10%"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : articleCategory === "Movie Reviews" ? (
                          <div className="relative">
                            <img
                              src={articleImageUrl}
                              alt="Movie Review"
                              className="w-full h-40 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-3">
                              <div className="flex items-center space-x-2">
                                <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-black font-black text-xs shadow">
                                  {articleMovieRating} / 10★
                                </div>
                                <span className="text-xs font-bold text-amber-300 uppercase">IMDb Bayesian Score</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={articleImageUrl}
                            alt="Featured"
                            className="w-full h-40 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    )}

                    {/* EXCERPT & BODY CONTENT */}
                    {previewMode === "card" ? (
                      <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                        {articleExcerpt || "Story overview summary..."}
                      </p>
                    ) : previewMode === "detail" ? (
                      <div className="space-y-2 text-xs text-zinc-300 leading-relaxed pt-1">
                        <p className="font-semibold text-white">{articleExcerpt}</p>
                        {articleContent.split("\n\n").map((para, i) => (
                          <p key={i} className="text-zinc-300">{para}</p>
                        ))}
                      </div>
                    ) : (
                      /* COMMENTS / REVIEWS SECTION */
                      <div className="space-y-3 pt-1">
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Reader Ratings & Comments</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Interactive Sandbox</span>
                          </h4>

                          {/* 10-Star Interactive Bar */}
                          <div className="flex items-center space-x-1 py-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleInteractiveLiveRating(star)}
                                className="p-0.5 text-zinc-600 hover:text-amber-400 transition-colors cursor-pointer"
                                title={`Rate ${star} Stars`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Existing User Comments List */}
                        <div className="space-y-2">
                          {activeMovie?.reviews?.map((rev) => (
                            <div key={rev.id} className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-amber-400">{rev.userName}</span>
                                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                                  {rev.userScore}/10★
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-white">{rev.reviewTitle}</p>
                              <p className="text-[10px] text-zinc-400">{rev.reviewComment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simulated Mobile Home Bar */}
                  <div className="py-2 bg-black flex justify-center">
                    <div className="w-24 h-1 rounded-full bg-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 0: MOVIE REVIEWS (IMDb-STYLE) ---------------- */}
        {activeSection === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: BACKEND FORM CONTROLS & REVIEWS MANAGER (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Movie Selection / New Creation Tabs */}
              <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center space-x-2">
                    <Film className="w-4 h-4" />
                    <span>Select Movie to Configure</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = "mov-rev-" + Date.now();
                      const newMovie: MovieReviewItem = {
                        id: newId,
                        movieTitle: "New Movie Title",
                        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
                        releaseYear: "2025",
                        duration: "2h 30m",
                        genres: ["Action", "Drama"],
                        director: "Director Name",
                        cast: ["Lead Actor", "Lead Actress"],
                        synopsis: "Enter brief movie synopsis...",
                        averageRating: 8.5,
                        totalVotes: 500,
                        ratingDistribution: {
                          stars10: 200, stars9: 150, stars8: 80, stars7: 40, stars6: 15,
                          stars5: 10, stars4: 3, stars3: 1, stars2: 1, stars1: 0
                        },
                        reviews: []
                      };
                      setMovieReviews([newMovie, ...movieReviews]);
                      setSelectedMovieId(newId);
                    }}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Movie</span>
                  </button>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {movieReviews.map((m) => {
                    const bayesScore = calculateBayesianRating(m.totalVotes, m.averageRating, minVotesM, globalMeanC);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMovieId(m.id)}
                        className={`px-3 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 border cursor-pointer ${
                          m.id === activeMovie.id
                            ? "bg-amber-500 text-black border-amber-400 shadow-md"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700/60 hover:border-zinc-500"
                        }`}
                      >
                        <span>{m.movieTitle}</span>
                        <span className="text-[10px] opacity-80 font-mono">
                          (WR: {bayesScore}★ / R: {m.averageRating}★)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* IMDb BAYESIAN WEIGHTED RATING ENGINE & CALCULATOR CARD */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-amber-950/30 border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-md shrink-0">
                      IMDb
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                        <span>Bayesian Weighted Rating Engine</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                          Formula Active
                        </span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        Calculates title ratings using IMDb&apos;s Bayesian formula: WR = (v / (v+m) × R) + (m / (v+m) × C)
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowImdbInfoModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Rating Anti-Bot System</span>
                  </button>
                </div>

                {/* Active Movie Score Card: Raw vs Bayesian Weighted */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. Raw Average Score (R) */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Raw Mean (R)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-300">
                        Unweighted
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-white">{activeMovie.averageRating}</span>
                      <span className="text-xs text-zinc-400 font-bold">/ 10</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Mean of {activeMovie.totalVotes.toLocaleString()} votes
                    </p>
                  </div>

                  {/* 2. IMDb Bayesian Weighted Score (WR) */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                        IMDb Score (WR)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-black">
                        Weighted
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-amber-300">
                        {calculateBayesianRating(activeMovie.totalVotes, activeMovie.averageRating, minVotesM, globalMeanC)}
                      </span>
                      <span className="text-xs text-amber-400/80 font-bold">/ 10</span>
                    </div>
                    <p className="text-[10px] text-amber-200/80">
                      Bayesian estimate (m={minVotesM})
                    </p>
                  </div>

                  {/* 3. Vote Weight vs Benchmark Weight */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Vote Weight (v / v+m)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {Math.round((activeMovie.totalVotes / (activeMovie.totalVotes + minVotesM)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2 flex">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${(activeMovie.totalVotes / (activeMovie.totalVotes + minVotesM)) * 100}%` }}
                      />
                      <div
                        className="h-full bg-zinc-600 transition-all duration-300"
                        style={{ width: `${(minVotesM / (activeMovie.totalVotes + minVotesM)) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400 pt-0.5">
                      Votes: {Math.round((activeMovie.totalVotes / (activeMovie.totalVotes + minVotesM)) * 100)}% | Benchmark: {Math.round((minVotesM / (activeMovie.totalVotes + minVotesM)) * 100)}%
                    </p>
                  </div>

                  {/* 4. Median Rating & Shrinkage Offset */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Median & Offset
                      </span>
                      <span className="text-[10px] font-mono text-zinc-300">
                        Median: {calculateMedianRating(activeMovie.ratingDistribution)}★
                      </span>
                    </div>
                    <div className="text-sm font-black text-zinc-200">
                      Offset: {(calculateBayesianRating(activeMovie.totalVotes, activeMovie.averageRating, minVotesM, globalMeanC) - activeMovie.averageRating).toFixed(2)} pts
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      {activeMovie.totalVotes < minVotesM ? "Pulls towards database C until v increases" : "High confidence vote sample"}
                    </p>
                  </div>
                </div>

                {/* Interactive Parameter Controls (m and C) */}
                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-zinc-200">
                        Tweak Algorithm Parameters
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMinVotesM(500);
                        setGlobalMeanC(7.0);
                      }}
                      className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Reset Defaults (m=500, C=7.0)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Parameter m Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-zinc-300">
                          Min Vote Threshold (<span className="text-amber-400 font-mono font-black">m</span>):
                        </label>
                        <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
                          {minVotesM.toLocaleString()} votes
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="25000"
                        step="50"
                        value={minVotesM}
                        onChange={(e) => setMinVotesM(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <p className="text-[10px] text-zinc-400">
                        Higher <code className="text-amber-300">m</code> requires more votes before raw average dominates. Top 250 uses ~25,000.
                      </p>
                    </div>

                    {/* Parameter C Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-zinc-300">
                          Database Mean Benchmark (<span className="text-amber-400 font-mono font-black">C</span>):
                        </label>
                        <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
                          {globalMeanC.toFixed(1)} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5.0"
                        max="9.0"
                        step="0.1"
                        value={globalMeanC}
                        onChange={(e) => setGlobalMeanC(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <p className="text-[10px] text-zinc-400">
                        Mean vote across the entire database (typically ~7.0).
                      </p>
                    </div>
                  </div>

                  {/* Live Math Expression Breakdown */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto space-y-1">
                    <div className="text-[10px] text-amber-400 uppercase font-black tracking-widest font-sans">
                      Live Mathematical Step-by-Step Expression
                    </div>
                    <div>
                      <span className="text-zinc-500">WR =</span> ( ({activeMovie.totalVotes} / ({activeMovie.totalVotes} + {minVotesM})) × {activeMovie.averageRating} ) + ( ({minVotesM} / ({activeMovie.totalVotes} + {minVotesM})) × {globalMeanC} )
                    </div>
                    <div>
                      <span className="text-zinc-500">WR =</span> ( {(activeMovie.totalVotes / (activeMovie.totalVotes + minVotesM)).toFixed(4)} × {activeMovie.averageRating} ) + ( {(minVotesM / (activeMovie.totalVotes + minVotesM)).toFixed(4)} × {globalMeanC} ) = <strong className="text-amber-400 font-black">{calculateBayesianRating(activeMovie.totalVotes, activeMovie.averageRating, minVotesM, globalMeanC)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Controls for Selected Movie */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-sm font-black text-white flex items-center space-x-2">
                    <Edit2 className="w-4 h-4 text-amber-400" />
                    <span>Edit Movie Review Details</span>
                  </h2>
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    ID: {activeMovie.id}
                  </span>
                </div>

                <form onSubmit={handleSaveMovieConfig} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Movie Title</label>
                    <input
                      type="text"
                      required
                      value={revTitle}
                      onChange={(e) => setRevTitle(e.target.value)}
                      placeholder="e.g. L2 Empuraan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Poster Image URL</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="url"
                        required
                        value={revPoster}
                        onChange={(e) => setRevPoster(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 outline-none focus:border-amber-500"
                      />
                    </div>
                    {/* Quick Preset Poster Images */}
                    <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() => setRevPoster("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-colors cursor-pointer"
                      >
                        L2 Poster
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevPoster("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-colors cursor-pointer"
                      >
                        Aavesham Poster
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevPoster("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800")}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-colors cursor-pointer"
                      >
                        ARM Poster
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Release Year</label>
                      <input
                        type="text"
                        value={revYear}
                        onChange={(e) => setRevYear(e.target.value)}
                        placeholder="2025"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Duration</label>
                      <input
                        type="text"
                        value={revDuration}
                        onChange={(e) => setRevDuration(e.target.value)}
                        placeholder="2h 45m"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Genres (Comma-separated)</label>
                    <input
                      type="text"
                      value={revGenres}
                      onChange={(e) => setRevGenres(e.target.value)}
                      placeholder="Action, Thriller, Drama"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Director</label>
                      <input
                        type="text"
                        value={revDirector}
                        onChange={(e) => setRevDirector(e.target.value)}
                        placeholder="Prithviraj Sukumaran"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Cast (Comma-separated)</label>
                      <input
                        type="text"
                        value={revCast}
                        onChange={(e) => setRevCast(e.target.value)}
                        placeholder="Mohanlal, Prithviraj, Manju Warrier"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Synopsis</label>
                    <textarea
                      rows={3}
                      value={revSynopsis}
                      onChange={(e) => setRevSynopsis(e.target.value)}
                      placeholder="Enter movie storyline and review overview..."
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <div>
                      <label className="block text-xs font-bold text-amber-400 mb-1">Base Avg Rating (1-10)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={revAvgScore}
                        onChange={(e) => setRevAvgScore(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black text-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Total Vote Count</label>
                      <input
                        type="number"
                        value={revTotalVotes}
                        onChange={(e) => setRevTotalVotes(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Sync Movie Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete movie review "${activeMovie.movieTitle}"?`)) {
                          deleteMovieReviewFromFirestore(activeMovie.id);
                          const filtered = movieReviews.filter((m) => m.id !== activeMovie.id);
                          setMovieReviews(filtered);
                          if (filtered.length > 0) setSelectedMovieId(filtered[0].id);
                          showToast("Movie Review deleted.");
                        }
                      }}
                      className="px-3.5 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-xs transition-colors cursor-pointer"
                      title="Delete Movie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Add User Review Form (Backend Connection Action) */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3.5">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Staff / User Review Entry</span>
                </h3>

                <form onSubmit={handleAddUserReview} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 mb-1">Official User Email</label>
                      <input
                        type="email"
                        required
                        value={newReviewUser}
                        onChange={(e) => setNewReviewUser(e.target.value)}
                        placeholder="devfourflicks@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 mb-1">10-Star Rating Score</label>
                      <select
                        value={newReviewScore}
                        onChange={(e) => setNewReviewScore(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-black text-amber-400 outline-none"
                      >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num} ★ {num === 10 ? "(Masterpiece)" : num >= 8 ? "(Great)" : num >= 6 ? "(Average)" : "(Poor)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Review Title</label>
                    <input
                      type="text"
                      value={newReviewHeadline}
                      onChange={(e) => setNewReviewHeadline(e.target.value)}
                      placeholder="e.g. Incredible Cinema Experience!"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Review Comments</label>
                    <textarea
                      rows={2}
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Write your detailed review commentary..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Post Review & Update Rating Engine</span>
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE MOBILE PREVIEW DEVICE FRAME (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-4 w-full max-w-sm">
                <div className="text-center mb-2 flex items-center justify-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">
                    Live Mobile Preview Frame
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Smartphone Device Frame Container */}
                <div className="w-full bg-zinc-950 border-[10px] border-zinc-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative text-zinc-100 max-h-[720px] font-sans">
                  {/* Speaker Punch Hole Bar */}
                  <div className="bg-black py-1.5 px-6 flex justify-between items-center text-[10px] text-zinc-400 shrink-0 border-b border-zinc-900">
                    <span className="font-mono font-bold text-white">9:41</span>
                    <div className="w-16 h-3.5 bg-zinc-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[9px]">5G</span>
                      <div className="w-3 h-2 bg-emerald-500 rounded-xs" />
                    </div>
                  </div>

                  {/* Scrollable Mobile Device Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
                    {/* Movie Poster & Header Card */}
                    <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-xl group">
                      <img
                        src={revPoster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800"}
                        alt={revTitle}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black uppercase">
                            {revYear}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-300">{revDuration}</span>
                        </div>
                        <h2 className="text-lg font-black text-white leading-tight drop-shadow-md">
                          {revTitle || "Movie Title"}
                        </h2>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {revGenres.split(",").map((g, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-[9px] font-bold text-zinc-300">
                              {g.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* IMDb-Style Rating Card & Interactive 10-Star Bar */}
                    <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          IMDb Title Rating Score
                        </span>
                        
                        {/* Rating Display Mode Toggle Pill */}
                        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[9px] font-bold">
                          <button
                            type="button"
                            onClick={() => setRatingDisplayMode("weighted")}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              ratingDisplayMode === "weighted"
                                ? "bg-amber-500 text-black font-black"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            Weighted (WR)
                          </button>
                          <button
                            type="button"
                            onClick={() => setRatingDisplayMode("raw")}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              ratingDisplayMode === "raw"
                                ? "bg-amber-500 text-black font-black"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            Raw Mean (R)
                          </button>
                        </div>
                      </div>

                      {/* Main Rating Score Banner */}
                      <div className="flex items-center space-x-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                          <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-2xl font-black text-white tracking-tight">
                              {ratingDisplayMode === "weighted"
                                ? calculateBayesianRating(activeMovie.totalVotes, activeMovie.averageRating, minVotesM, globalMeanC)
                                : activeMovie.averageRating}
                            </span>
                            <span className="text-xs text-zinc-400 font-bold">/ 10</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold ml-auto">
                              {ratingDisplayMode === "weighted" ? "Bayesian WR" : "Raw Mean"}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {activeMovie.totalVotes.toLocaleString()} verified votes (m={minVotesM}, C={globalMeanC})
                          </p>
                        </div>
                      </div>

                      {/* Statistical Breakdown Bar (Arithmetic Mean vs Median) */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-zinc-950/50 p-2 rounded-xl border border-zinc-800/60 text-zinc-300">
                        <div>
                          <span className="text-zinc-500 block text-[9px]">ARITHMETIC MEAN</span>
                          <span className="font-bold text-amber-300">{activeMovie.averageRating} / 10</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px]">MEDIAN VOTE</span>
                          <span className="font-bold text-emerald-400">{calculateMedianRating(activeMovie.ratingDistribution)} / 10</span>
                        </div>
                      </div>

                      {/* Interactive 10-Star Rating Input (Clickable in Live Preview) */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-amber-400">Tap Stars to Rate Movie:</span>
                          <span className="text-zinc-400 font-mono">1 to 10 Scale</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleInteractiveLiveRating(star)}
                              className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                              title={`Rate ${star}/10`}
                            >
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating Breakdown Graph (10 ★ down to 1 ★) */}
                      <div className="space-y-1 pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Score Breakdown
                        </span>
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((s) => {
                          const dist = activeMovie.ratingDistribution || {};
                          const count = dist[`stars${s}` as keyof typeof dist] || 0;
                          const total = activeMovie.totalVotes || 1;
                          const pct = Math.min(100, Math.round((count / total) * 100));
                          return (
                            <div key={s} className="flex items-center space-x-2 text-[10px]">
                              <span className="w-7 text-zinc-400 font-mono font-bold shrink-0 text-right">{s} ★</span>
                              <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-zinc-500 font-mono text-[9px] shrink-0">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Synopsis & Director/Cast Info Card */}
                    <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                      <h4 className="text-xs font-black text-white">Synopsis & Credits</h4>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                        {revSynopsis}
                      </p>
                      <div className="pt-1 space-y-1 text-[11px]">
                        <p><span className="text-zinc-500 font-bold">Director:</span> <span className="text-amber-300 font-semibold">{revDirector}</span></p>
                        <p><span className="text-zinc-500 font-bold">Cast:</span> <span className="text-zinc-200">{revCast}</span></p>
                      </div>
                    </div>

                    {/* User Reviews Breakdown Stream */}
                    <div className="space-y-2 pt-1">
                      <h4 className="text-xs font-black text-white flex items-center justify-between">
                        <span>User Reviews ({activeMovie.reviews?.length || 0})</span>
                        <span className="text-[10px] text-amber-400 font-normal">Latest First</span>
                      </h4>

                      <div className="space-y-2">
                        {activeMovie.reviews && activeMovie.reviews.length > 0 ? (
                          activeMovie.reviews.slice(0, 4).map((rev) => (
                            <div key={rev.id} className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-[10px] flex items-center justify-center">
                                    {rev.userName.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-xs font-bold text-white">{rev.userName}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black">
                                  {rev.userScore}/10 ★
                                </span>
                              </div>
                              <p className="text-xs font-bold text-zinc-200">{rev.reviewTitle}</p>
                              <p className="text-[11px] text-zinc-400 font-medium">{rev.reviewComment}</p>
                              <span className="text-[9px] text-zinc-600 block text-right">{rev.date}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-500">
                            No user reviews submitted yet. Use the form on the left or tap stars above!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Frame Home Indicator Bar */}
                  <div className="py-2 bg-black flex justify-center shrink-0">
                    <div className="w-28 h-1 bg-zinc-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE USER RATINGS DATABASE & RECORDS TABLE (CONNECTED TO MOVIE RATE CONTROL ENGINE) */}
            <div className="lg:col-span-12 p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black shadow-md">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                      <span>Live User Rating Database & Logs</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Sync Active ({liveUserRatings.length} Records)</span>
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      All live votes from reader views and the control engine linked directly to user profiles & movie metadata.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search user email or movie..."
                      value={ratingSearchQuery}
                      onChange={(e) => setRatingSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleWipeAllRatingData}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                    title="Wipe Outdated Database Data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe Outdated Data</span>
                  </button>
                </div>
              </div>

              {/* User Ratings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500 bg-zinc-950/60">
                      <th className="p-3 rounded-l-xl">User Profile</th>
                      <th className="p-3">Movie & Poster</th>
                      <th className="p-3">Score (1-10)</th>
                      <th className="p-3">Review & Notes</th>
                      <th className="p-3">Metadata</th>
                      <th className="p-3 rounded-r-xl text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {liveUserRatings.length > 0 ? (
                      liveUserRatings
                        .filter(
                          (r) =>
                            r.userEmail.toLowerCase().includes(ratingSearchQuery.toLowerCase()) ||
                            r.movieTitle.toLowerCase().includes(ratingSearchQuery.toLowerCase()) ||
                            r.userName.toLowerCase().includes(ratingSearchQuery.toLowerCase())
                        )
                        .map((r) => (
                          <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shrink-0">
                                  {r.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs">{r.userName}</div>
                                  <div className="text-[10px] text-amber-400/90 font-mono">{r.userEmail}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={r.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=200"}
                                  alt={r.movieTitle}
                                  className="w-9 h-12 object-cover rounded-md border border-zinc-700 shrink-0"
                                />
                                <div>
                                  <span className="font-extrabold text-white text-xs block">{r.movieTitle}</span>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-amber-300">
                                    {r.category || "Mollywood"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black inline-flex items-center space-x-1 shadow-sm">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{r.userScore} / 10</span>
                              </span>
                            </td>

                            <td className="p-3 max-w-xs">
                              <div className="text-xs font-bold text-zinc-200 line-clamp-1">{r.reviewTitle || "Rating Log"}</div>
                              <div className="text-[11px] text-zinc-400 line-clamp-2">{r.reviewComment || "No comment provided."}</div>
                            </td>

                            <td className="p-3">
                              <div className="space-y-1 text-[10px]">
                                {r.whereToWatch && (
                                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold block w-max">
                                    Watch: {r.whereToWatch}
                                  </span>
                                )}
                                {r.languages && r.languages.length > 0 && (
                                  <span className="text-zinc-400 text-[9px] block">
                                    Languages: {r.languages.slice(0, 2).join(", ")}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-3 text-right text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                              {new Date(r.updatedAt).toLocaleDateString()} {new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 text-xs">
                          No live ratings recorded yet. Submit a rating above or from the movie reader view to see live UPSERT entries!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1: MANUALLY CONTROLLING POLLS ---------------- */}
        {activeSection === "polls" && (
          <div className="space-y-5">
            {/* Manual Poll Creator Form */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Create New Live Fan Poll
                </h2>
              </div>

              <form onSubmit={handleAddPoll} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Poll Question
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Which upcoming 2025 release has the best teaser?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Category
                    </label>
                    <select
                      value={pollCategory}
                      onChange={(e) => setPollCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    >
                      <option value="Mollywood">Mollywood</option>
                      <option value="Box Office">Box Office</option>
                      <option value="Pan-India">Pan-India</option>
                      <option value="Hollywood">Hollywood</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Record Tracker"
                      value={pollBadge}
                      onChange={(e) => setPollBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Option 1 & Option 2 (Required)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Option 1..."
                      value={pollOpt1}
                      onChange={(e) => setPollOpt1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Option 2..."
                      value={pollOpt2}
                      onChange={(e) => setPollOpt2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Option 3 (Optional)..."
                      value={pollOpt3}
                      onChange={(e) => setPollOpt3(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-xs shadow hover:bg-amber-400 transition-all"
                >
                  Publish Fan Poll
                </button>
              </form>
            </div>

            {/* List of Existing Managed Polls */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
                Active Managed Polls ({polls.length})
              </h3>

              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    themeConfig.darkMode
                      ? "bg-zinc-900/60 border-zinc-800"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase">
                      {poll.category} • {poll.badge}
                    </span>
                    <button
                      onClick={() => handleDeletePoll(poll.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500"
                      title="Delete Poll"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold leading-snug mb-2">{poll.question}</h4>

                  <div className="space-y-1">
                    {poll.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 text-[11px] font-medium flex items-center justify-between"
                      >
                        <span>{opt.text}</span>
                        <span className="text-zinc-400 font-bold">{opt.votes} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: MANUALLY CONTROLLING MOVIE RATINGS ---------------- */}
        {activeSection === "ratings" && (
          <div className="space-y-5">
            {/* Analyzed Metrics Card */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                    User Data Analyzed Movie Ratings
                  </h2>
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  {totalRated} Movies Analyzed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center mb-4">
                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-bold block">Average Score</span>
                  <span className="text-base font-black text-amber-500">{avgRating} / 10 ★</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-bold block">Status</span>
                  <span className="text-xs font-extrabold text-emerald-400 mt-1 block">
                    Analyzed Active
                  </span>
                </div>
              </div>

              {/* Form to manually override/add a rated movie */}
              <form onSubmit={handleAddRating} className="space-y-3 pt-3 border-t border-zinc-800">
                <h3 className="text-xs font-black uppercase text-zinc-300">
                  + Add / Override Movie Rating
                </h3>

                <div>
                  <input
                    type="text"
                    placeholder="Movie Title (e.g. Barroz 3D, L2 Empuraan)"
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      value={movieCat}
                      onChange={(e) => setMovieCat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    >
                      <option value="Mollywood">Mollywood</option>
                      <option value="Action Comedy">Action Comedy</option>
                      <option value="Sci-Fi Epic">Sci-Fi Epic</option>
                      <option value="Pan-India">Pan-India</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={movieScore}
                      onChange={(e) => setMovieScore(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-xs font-black text-amber-500 shrink-0">{movieScore} ★</span>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Poster Image URL (Optional)"
                    value={moviePoster}
                    onChange={(e) => setMoviePoster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="User Review / Analysis Note..."
                    value={movieNote}
                    onChange={(e) => setMovieNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-medium outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow"
                >
                  Save Movie Rating Data
                </button>
              </form>
            </div>

            {/* List of Managed Ratings */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
                Ratings Log ({ratings.length})
              </h3>

              {ratings.map((r) => (
                <div
                  key={r.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    themeConfig.darkMode
                      ? "bg-zinc-900/60 border-zinc-800"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={r.posterUrl}
                      alt={r.movieTitle}
                      className="w-10 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">{r.movieTitle}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">{r.reviewNote}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-xs font-black">
                      {r.rating} ★
                    </span>
                    <button
                      onClick={() => handleDeleteRating(r.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 3: MANUALLY CONTROLLING GALLERY ---------------- */}
        {activeSection === "gallery" && (
          <div className="space-y-5">
            {/* Gallery Creator */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Publish HD Cinema Gallery Image
                </h2>
              </div>

              <form onSubmit={handleAddGallery} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Image Title (e.g. Barroz 3D BTS Still)"
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={galCat}
                    onChange={(e) => setGalCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                  >
                    <option value="Mollywood">Mollywood</option>
                    <option value="Pan-India">Pan-India</option>
                    <option value="Hollywood">Hollywood</option>
                  </select>

                  <input
                    type="text"
                    placeholder="High-Res Image URL..."
                    value={galImgUrl}
                    onChange={(e) => setGalImgUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Caption / Description..."
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-medium outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-xs shadow hover:bg-amber-400 transition-all"
                >
                  Publish Gallery Photo
                </button>
              </form>
            </div>

            {/* Gallery Managed Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
                Published Gallery Stills ({gallery.length})
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/3]"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                      <span className="text-[9px] font-bold truncate">{item.title}</span>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="self-end p-1 rounded bg-rose-500 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 4: MANUALLY CONTROLLING REELS ---------------- */}
        {activeSection === "reels" && (
          <div className="space-y-5">
            {/* Reel Publisher Form */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                  <Film className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Publish Video Reel
                </h2>
              </div>

              <form onSubmit={handleAddReel} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Reel Title..."
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Direct MP4 Video Stream URL..."
                    value={reelVideoUrl}
                    onChange={(e) => setReelVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Poster Image Cover URL..."
                    value={reelPosterUrl}
                    onChange={(e) => setReelPosterUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Audio Track Name..."
                    value={reelAudio}
                    onChange={(e) => setReelAudio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-xs shadow hover:bg-amber-400 transition-all"
                >
                  Publish Video Reel
                </button>
              </form>
            </div>

            {/* List of Managed Reels */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
                Published Reels ({reels.length})
              </h3>

              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    themeConfig.darkMode
                      ? "bg-zinc-900/60 border-zinc-800"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={reel.posterUrl}
                      alt={reel.title}
                      className="w-10 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">{reel.title}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">🎵 {reel.audioTrack}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteReel(reel.id)}
                    className="p-1.5 rounded text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 5: RATE CALCULATION ENGINE & SIMULATION SANDBOX ---------------- */}
        {activeSection === "rates" && (
          <div className="space-y-5">
            {/* Rate Rules Form */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                  <Calculator className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Move / Rate Formula Configurator
                </h2>
              </div>

              <form onSubmit={handleSaveRateRules} className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                      Base Rate
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={baseRate}
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                      Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                      Tax %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-xs shadow hover:bg-amber-400 transition-all"
                >
                  Save Active Formula Parameters
                </button>
              </form>
            </div>

            {/* Rate Simulation Workbench */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500">
                  Rate Simulation Sandbox
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                      Simulated Units / Distance
                    </label>
                    <input
                      type="number"
                      value={simUnits}
                      onChange={(e) => setSimUnits(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                      Weight Factor
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={simWeightFactor}
                      onChange={(e) => setSimWeightFactor(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 text-white space-y-1.5 border border-zinc-800 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Base Rate:</span>
                    <span>${baseRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Subtotal Formula:</span>
                    <span>
                      ${baseRate.toFixed(2)} + ({simUnits} × {multiplier} × {simWeightFactor}) = $
                      {calculatedSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Tax ({taxPercentage}%):</span>
                    <span>${calculatedTax.toFixed(2)}</span>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-800 flex justify-between font-black text-amber-400 text-sm">
                    <span>Computed Result:</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 6: DATABASE SCHEMA BLUEPRINT ---------------- */}
        {activeSection === "schema" && (
          <div className="space-y-4">
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
                themeConfig.darkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                    <Database className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-amber-500">
                    Database Schema DDL Blueprint
                  </h2>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlDdlBlueprint);
                    showToast("SQL Schema DDL copied to clipboard!");
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center space-x-1 hover:bg-amber-500/30"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto border border-zinc-800 max-h-96">
                {sqlDdlBlueprint}
              </pre>
            </div>
          </div>
        )}

        {/* ---------------- IMDb RATING SYSTEM & ANTI-BOT EXPLANATION MODAL ---------------- */}
        <AnimatePresence>
          {showImdbInfoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl relative text-zinc-100"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black font-black text-sm flex items-center justify-center shrink-0">
                      IMDb
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center space-x-2">
                        <span>IMDb Rating System & Anti-Bot Architecture</span>
                      </h3>
                      <p className="text-xs text-amber-400 font-medium">
                        Weighted Averages, Voter Credibility & Protection Filters
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImdbInfoModal(false)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body: 4 Key Pillars */}
                <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                  {/* Pillar 1: Weighted Average vs Raw Average */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <h4 className="font-extrabold text-amber-400 text-sm flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>1. Weighted Average vs. Raw Average</span>
                    </h4>
                    <p>
                      If 100 people rate a movie 10/10 and 100 people rate it 1/1, a raw arithmetic average yields a 5.5 score. IMDb assigns different weights (importance) to votes to ensure accuracy, eliminate review bombing bias, and prevent rating manipulation.
                    </p>
                  </div>

                  {/* Pillar 2: Anti-Bot & Anti-Review Bombing Filters */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <h4 className="font-extrabold text-emerald-400 text-sm flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>2. Anti-Bot & Anti-Review Bombing Filters</span>
                    </h4>
                    <p>
                      IMDb actively monitors voting activity for unusual behavior—such as automated bots or coordinated mass rating campaigns (giving sudden floods of 1s or 10s). When unusual activity is detected, an alternate weighting mechanism automatically neutralizes artificial inflation or deflation.
                    </p>
                  </div>

                  {/* Pillar 3: Voter Credibility & Account History */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <h4 className="font-extrabold text-sky-400 text-sm flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>3. Voter Credibility & Account History</span>
                    </h4>
                    <p>
                      Not all user votes carry equal weight. Votes from established accounts that regularly rate a variety of titles carry significantly higher weight than fresh accounts created solely to rate a single movie title.
                    </p>
                  </div>

                  {/* Pillar 4: The Bayesian Top 250 Formula */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <h4 className="font-extrabold text-amber-300 text-sm flex items-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>4. Bayesian Rating Formula (WR = (v/(v+m))×R + (m/(v+m))×C)</span>
                    </h4>
                    <div className="font-mono text-[11px] bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-amber-400 space-y-1">
                      <div><strong>WR</strong> = Weighted Rating</div>
                      <div><strong>v</strong> = Number of votes for the movie</div>
                      <div><strong>m</strong> = Minimum votes required to qualify ({minVotesM.toLocaleString()})</div>
                      <div><strong>R</strong> = Average rating of the movie ({activeMovie.averageRating})</div>
                      <div><strong>C</strong> = Mean vote across the whole database ({globalMeanC.toFixed(1)})</div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowImdbInfoModal(false)}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-colors cursor-pointer"
                  >
                    Close Information
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* LIVE FRONT-END APP EMULATION MODAL */}
          {showAppEmulationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6"
            >
              {/* Modal Header Controls */}
              <div className="w-full max-w-5xl flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center space-x-2">
                      <span>Front End Reader App Emulation</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                        LIVE PREVIEW
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">Emulate the reader experience in real-time</p>
                  </div>
                </div>

                {/* Device Dimension Selectors */}
                <div className="flex items-center space-x-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEmulationDevice("mobile")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      emulationDevice === "mobile"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    iPhone / Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmulationDevice("tablet")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      emulationDevice === "tablet"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmulationDevice("desktop")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      emulationDevice === "desktop"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Desktop
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAppEmulationModal(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Full Screen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAppEmulationModal(false)}
                    className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Iframe Device Frame Wrapper */}
              <div className="flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden">
                <div
                  className={`h-full max-h-[85vh] bg-zinc-950 border-4 border-zinc-800 shadow-2xl overflow-hidden transition-all duration-300 relative ${
                    emulationDevice === "mobile"
                      ? "w-[395px] rounded-[40px] border-[10px] border-zinc-800"
                      : emulationDevice === "tablet"
                      ? "w-[780px] rounded-[32px] border-[8px] border-zinc-800"
                      : "w-full rounded-2xl"
                  }`}
                >
                  {emulationDevice === "mobile" && (
                    <div className="w-28 h-4 bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="w-8 h-1 rounded-full bg-zinc-600" />
                    </div>
                  )}

                  <iframe
                    src={window.location.origin + window.location.pathname + "?reader=true"}
                    title="Front End App Emulation Frame"
                    className="w-full h-full border-none bg-white"
                  />
                </div>
              </div>

              {/* Footer Info Bar */}
              <div className="text-center text-xs font-medium text-zinc-500">
                <span>Simulating FlickPulse Front End Reader Application</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
  );
};
