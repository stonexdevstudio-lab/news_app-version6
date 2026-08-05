import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily / safely
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// In-memory Movie Reviews data store for fast backend connection
let MOVIE_REVIEWS_DB = [
  {
    id: "mov-rev-1",
    movieTitle: "L2 Empuraan",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    releaseYear: "2025",
    duration: "2h 45m",
    genres: ["Action", "Thriller", "Drama"],
    director: "Prithviraj Sukumaran",
    cast: ["Mohanlal", "Prithviraj Sukumaran", "Manju Warrier", "Tovino Thomas"],
    synopsis: "Stephen Nedumpally returns in the epic sequel to Lucifer. A globe-trotting political action spectacle following the rise of Khureshi Ab'raam.",
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
        userEmail: "buff@flickpulse.app",
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
  }
];

// 1. GET all Movie Reviews & Ratings
app.get("/api/movies/reviews", (req, res) => {
  res.json({
    status: "success",
    count: MOVIE_REVIEWS_DB.length,
    movies: MOVIE_REVIEWS_DB
  });
});

// --- ARTICLES / CONTENT STUDIO API ENDPOINTS ---
let ARTICLES_DB: any[] = [
  {
    id: "art-1",
    title: "L2 Empuraan Teaser Drops: Mohanlal & Prithviraj Redefine Indian Mass Cinema",
    category: "Cinema",
    excerpt: "The awaited teaser for L2 Empuraan showcases breathtaking international scale, high-octane action sequences, and Khureshi Ab'raam's formidable return.",
    doctorName: "Alex Rivers",
    doctorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    date: "2025-08-05",
    views: 45200,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    content: [
      "The cinematic landscape of Indian cinema witnessed a seismic event today as the official teaser for L2 Empuraan was released across global digital platforms.",
      "Directed by Prithviraj Sukumaran and starring Legendary Superstar Mohanlal, the film expands the universe established in 2019's Lucifer into an international crime thrill saga.",
      "With high-definition visuals shot across Europe, Asia, and North America, Empuraan promises unprecedented production values."
    ],
    keyTakeaways: [
      "Global release date confirmed for late 2025 across 5 major languages.",
      "Stephen Devassy's musical score features a 90-piece orchestra.",
      "Over 100,000 pre-bookings already recorded in overseas markets."
    ],
    cardType: "article",
    isPinned: true,
    pinPosition: 1
  },
  {
    id: "art-2",
    title: "Box Office Tracker: Mollywood Surpasses ₹1500 Crore Worldwide Revenue Mark",
    category: "Box Office",
    excerpt: "Propelled by massive global hits, Malayalam cinema achieves historic financial milestones in global theatrical earnings.",
    doctorName: "Elena Vance",
    date: "2025-08-04",
    views: 31800,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    content: [
      "Malayalam cinema continues its unprecedented run at the domestic and international box office, crossing the historic 1500 Crore cumulative milestone.",
      "Industry analysts attribute this rapid growth to content-driven narratives, exceptional performances, and expanding NRI audiences worldwide."
    ],
    keyTakeaways: [
      "Overseas collections account for 42% of total theatrical gross.",
      "GCC region remains the largest international market for Malayalam releases."
    ],
    cardType: "article",
    isPinned: false
  }
];

// --- 5-MINUTE DELAYED PUSH NOTIFICATION TASK QUEUE ENGINE ---
interface QueuedPushTask {
  articleId: string;
  title: string;
  category: string;
  scheduledAt: string;
  dispatchAt: string;
  status: "queued" | "dispatched" | "cancelled";
  timerRef?: NodeJS.Timeout;
}

const PUSH_QUEUE = new Map<string, QueuedPushTask>();

// Schedule 5-minute delayed push alert
app.post("/api/push/schedule", (req, res) => {
  try {
    const { articleId, title, category, delayMinutes = 5 } = req.body;
    if (!articleId || !title) {
      return res.status(400).json({ error: "articleId and title required for push alert queue" });
    }

    // Cancel previous pending queue for same article if re-published/edited
    if (PUSH_QUEUE.has(articleId)) {
      const existing = PUSH_QUEUE.get(articleId);
      if (existing?.timerRef) clearTimeout(existing.timerRef);
    }

    const delayMs = delayMinutes * 60 * 1000;
    const now = new Date();
    const dispatchTime = new Date(now.getTime() + delayMs);

    const timer = setTimeout(() => {
      console.log(`[PUSH ENGINE DISPATCH] 5-minute delayed push notification sent for "${title}" (${articleId})`);
      const task = PUSH_QUEUE.get(articleId);
      if (task) {
        task.status = "dispatched";
      }
    }, delayMs);

    const pushTask: QueuedPushTask = {
      articleId,
      title,
      category: category || "Cinema",
      scheduledAt: now.toISOString(),
      dispatchAt: dispatchTime.toISOString(),
      status: "queued",
      timerRef: timer
    };

    PUSH_QUEUE.set(articleId, pushTask);

    res.json({
      status: "success",
      message: `Push notification scheduled to dispatch in ${delayMinutes} minutes (${dispatchTime.toLocaleTimeString()}).`,
      task: {
        articleId,
        title,
        dispatchAt: dispatchTime.toISOString(),
        status: "queued"
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to schedule push alert" });
  }
});

// Cancel a scheduled push alert (Safeguard)
app.post("/api/push/cancel", (req, res) => {
  try {
    const { articleId } = req.body;
    if (!articleId) {
      return res.status(400).json({ error: "articleId is required" });
    }

    const task = PUSH_QUEUE.get(articleId);
    if (task) {
      if (task.timerRef) clearTimeout(task.timerRef);
      task.status = "cancelled";
      res.json({
        status: "success",
        message: `Scheduled push notification for "${task.title}" has been CANCELLED.`
      });
    } else {
      res.json({ status: "info", message: "No active queued push notification found for this article." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to cancel push notification" });
  }
});

// Get all queued push tasks
app.get("/api/push/queue", (req, res) => {
  const tasks = Array.from(PUSH_QUEUE.values()).map(({ timerRef, ...rest }) => rest);
  res.json({ status: "success", tasks });
});

// GET All Articles
app.get("/api/articles", (req, res) => {
  res.json({
    status: "success",
    count: ARTICLES_DB.length,
    articles: ARTICLES_DB
  });
});

// POST Create / Publish / Save Draft / Schedule Article
app.post("/api/articles", (req, res) => {
  try {
    const {
      id,
      title,
      category,
      excerpt,
      doctorName,
      imageUrl,
      status,
      content,
      keyTakeaways,
      cardType,
      isPinned,
      galleryImages,
      videoUrl,
      pollQuestion,
      pollOptions,
      scheduledTime
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const articleId = id || "art-" + Date.now();
    const existingIndex = ARTICLES_DB.findIndex((a) => a.id === articleId);

    const articleData = {
      id: articleId,
      title: title.trim(),
      category: category || "Cinema",
      excerpt: excerpt || "Article overview summary...",
      doctorName: doctorName || "Staff Author",
      date: scheduledTime || new Date().toISOString().split("T")[0],
      views: existingIndex >= 0 ? ARTICLES_DB[existingIndex].views : 0,
      status: status || "Active",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
      content: Array.isArray(content) ? content : (content ? [content] : []),
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
      cardType: cardType || "article",
      isPinned: Boolean(isPinned),
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      videoUrl: videoUrl || "",
      pollQuestion: pollQuestion || "",
      pollOptions: Array.isArray(pollOptions) ? pollOptions : [],
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      ARTICLES_DB[existingIndex] = articleData;
    } else {
      ARTICLES_DB.unshift(articleData);
    }

    res.json({
      status: "success",
      message: `Article ${status === "Draft" ? "saved as Draft" : status === "Scheduled" ? "scheduled" : "published"} successfully!`,
      article: articleData
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to save article" });
  }
});

// DELETE Article
app.delete("/api/articles/:id", (req, res) => {
  try {
    const { id } = req.params;
    ARTICLES_DB = ARTICLES_DB.filter((a) => a.id !== id);
    res.json({ status: "success", message: `Article ${id} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete article" });
  }
});

// 2. POST create / update Movie Review configuration (Staff / Dev)
app.post("/api/movies/reviews", (req, res) => {
  try {
    const { movieTitle, posterUrl, releaseYear, duration, genres, director, cast, synopsis, averageRating, totalVotes } = req.body;
    if (!movieTitle) {
      return res.status(400).json({ error: "movieTitle is required" });
    }

    const newM: any = {
      id: "mov-rev-" + Date.now(),
      movieTitle: movieTitle.trim(),
      posterUrl: posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      releaseYear: releaseYear || "2025",
      duration: duration || "2h 30m",
      genres: Array.isArray(genres) ? genres : [genres || "Action"],
      director: director || "Director",
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(",").map((s: string) => s.trim()) : []),
      synopsis: synopsis || "Movie synopsis and review summary...",
      averageRating: Number(averageRating) || 8.5,
      totalVotes: Number(totalVotes) || 100,
      ratingDistribution: {
        stars10: 50, stars9: 30, stars8: 10, stars7: 5, stars6: 2,
        stars5: 1, stars4: 1, stars3: 0, stars2: 0, stars1: 1
      },
      reviews: []
    };

    MOVIE_REVIEWS_DB.unshift(newM);
    res.json({ status: "success", movie: newM });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to add movie review" });
  }
});

// 3. POST Submit User Rating & Review Score (10-Star System)
app.post("/api/movies/rate", (req, res) => {
  try {
    const { movieId, movieTitle, userScore, reviewTitle, reviewComment, userName, userEmail } = req.body;
    const score = Number(userScore);

    if (!score || score < 1 || score > 10) {
      return res.status(400).json({ error: "User score must be between 1 and 10 stars." });
    }

    let targetMovie = MOVIE_REVIEWS_DB.find((m) => m.id === movieId || m.movieTitle.toLowerCase() === (movieTitle || "").toLowerCase());

    if (!targetMovie) {
      targetMovie = MOVIE_REVIEWS_DB[0];
    }

    // Calculate new vote count and average rating
    const oldVotes = targetMovie.totalVotes;
    const oldAvg = targetMovie.averageRating;
    const newVotes = oldVotes + 1;
    const newAvg = Number(((oldAvg * oldVotes + score) / newVotes).toFixed(1));

    targetMovie.totalVotes = newVotes;
    targetMovie.averageRating = newAvg;

    // Update rating breakdown graph
    const starKey = `stars${Math.min(10, Math.max(1, Math.round(score)))}` as keyof typeof targetMovie.ratingDistribution;
    if (targetMovie.ratingDistribution[starKey] !== undefined) {
      targetMovie.ratingDistribution[starKey] += 1;
    }

    const newRev = {
      id: "rev-" + Date.now(),
      userName: userName || "User Fan",
      userEmail: userEmail || "user@flickpulse.app",
      userScore: score,
      reviewTitle: reviewTitle || `Rated ${score}/10 Stars`,
      reviewComment: reviewComment || "User rating submitted directly.",
      date: "Just now"
    };

    targetMovie.reviews.unshift(newRev);

    res.json({
      status: "success",
      message: "Rating and review recorded successfully!",
      updatedMovie: {
        id: targetMovie.id,
        movieTitle: targetMovie.movieTitle,
        averageRating: targetMovie.averageRating,
        totalVotes: targetMovie.totalVotes,
        ratingDistribution: targetMovie.ratingDistribution,
        newReview: newRev
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to record user rating" });
  }
});

// Gemini AI API Routes
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { title, content, mode } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Article title and content required" });
    }

    const ai = getAI();
    if (!ai) {
      // Return a smart fallback if API key is not configured
      const bullet1 = `Key insight from "${title}": Main developments highlighted in recent reports.`;
      const bullet2 = `Context & Impact: Experts emphasize strategic implications across sectors.`;
      const bullet3 = `Future Outlook: Next milestones are expected to unfold in upcoming quarters.`;
      return res.json({
        summary: `Here is the AI summary for ${title}:\n\n• ${bullet1}\n• ${bullet2}\n• ${bullet3}`,
        takeaways: [bullet1, bullet2, bullet3],
        mode: mode || "bullet_points",
        source: "local_fallback"
      });
    }

    let prompt = "";
    if (mode === "eli5") {
      prompt = `Explain the following news article like I am 5 years old in 3 simple sentences:\nTitle: ${title}\nContent: ${content}`;
    } else if (mode === "key_takeaways") {
      prompt = `Provide 4 key takeaways with bullet points from this news article:\nTitle: ${title}\nContent: ${content}`;
    } else {
      prompt = `Summarize the following news article into 3 clear, crisp bullet points and a 1-sentence executive verdict:\nTitle: ${title}\nContent: ${content}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const responseText = response.text || "Summary could not be generated.";
    return res.json({
      summary: responseText,
      mode: mode || "bullet_points",
      source: "gemini-3.6-flash"
    });
  } catch (error: any) {
    console.error("AI Summarize error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate AI summary" });
  }
});

app.post("/api/ai/qa", async (req, res) => {
  try {
    const { title, content, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getAI();
    if (!ai) {
      return res.json({
        answer: `Based on "${title || 'the article'}": The text outlines key developments, strategic moves, and future outlooks relevant to your question.`,
        source: "local_fallback"
      });
    }

    const prompt = `You are a helpful Android Material News Reader AI assistant. Answer the user's question accurately based on the article context below.
Article Title: ${title || 'N/A'}
Article Content: ${content || 'N/A'}

User Question: ${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({
      answer: response.text || "I couldn't process that question.",
      source: "gemini-3.6-flash"
    });
  } catch (error: any) {
    console.error("AI QA error:", error);
    res.status(500).json({ error: error?.message || "Failed to process question" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
