import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocFromServer,
  getDocs,
  runTransaction
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { Article, MedicalArticle, MedicalArticleStatus, DevRoleEntry, MovieReviewItem, UserReview, LiveUserMovieRatingRecord } from "../types";

export interface DevPollItem {
  id: string;
  category: string;
  badge: string;
  question: string;
  totalVotes: number;
  options: { id: string; text: string; votes: number }[];
  userVotedOptionId?: string;
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = (() => {
  const dbId = firebaseConfig.firestoreDatabaseId || undefined;
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      },
      dbId
    );
  } catch (e) {
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
})();

const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on init with offline fallback resilience
async function testConnection() {
  try {
    await getDoc(doc(db, "_connection_test", "ping"));
  } catch (error) {
    // Silently fall back to cached persistent mode when connection is offline or unavailable
  }
}
testConnection();

// Save or update article in Firestore
export async function saveArticleToFirestore(userId: string, article: Article) {
  const path = `saved_articles/${userId}_${article.id}`;
  try {
    await setDoc(doc(db, "saved_articles", `${userId}_${article.id}`), {
      id: `${userId}_${article.id}`,
      articleId: article.id,
      userId: userId,
      title: article.title,
      publisher: article.publisher || "News",
      summary: article.summary || "",
      category: article.category || "All",
      imageUrl: article.imageUrl || "",
      readTime: article.readTime || "3 min",
      publishedAt: article.publishedAt || "Recently",
      savedAt: new Date().toISOString(),
      isBookmarked: true,
      cardType: article.cardType || "article",
      likesCount: article.likesCount || 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Remove saved article from Firestore
export async function removeArticleFromFirestore(userId: string, articleId: string) {
  const docId = `${userId}_${articleId}`;
  const path = `saved_articles/${docId}`;
  try {
    await deleteDoc(doc(db, "saved_articles", docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Listen to saved articles for user
export function subscribeSavedArticles(
  userId: string,
  onSuccess: (savedArticleIds: string[], fullArticles?: Partial<Article>[]) => void,
  onError?: (err: any) => void
) {
  const path = "saved_articles";
  const q = query(collection(db, "saved_articles"), where("userId", "==", userId));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const ids: string[] = [];
      const items: Partial<Article>[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.articleId) {
          ids.push(data.articleId);
          items.push({
            id: data.articleId,
            title: data.title,
            publisher: data.publisher,
            summary: data.summary,
            category: data.category,
            imageUrl: data.imageUrl,
            readTime: data.readTime,
            publishedAt: data.publishedAt,
            isBookmarked: true,
            cardType: data.cardType,
            likesCount: data.likesCount
          });
        }
      });
      onSuccess(ids, items);
    },
    (error) => {
      console.warn("Firestore snapshot listener error:", error);
      if (onError) onError(error);
    }
  );
}

// --- LIVE POLLS FIRESTORE DATA-SYNC BRIDGE ---

// Save or update poll in Firestore
export async function savePollToFirestore(poll: DevPollItem) {
  const path = `polls/${poll.id}`;
  try {
    await setDoc(doc(db, "polls", poll.id), {
      id: poll.id,
      category: poll.category || "Mollywood",
      badge: poll.badge || "Live Vote",
      question: poll.question,
      totalVotes: poll.totalVotes || 0,
      options: poll.options || [],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete poll from Firestore
export async function deletePollFromFirestore(pollId: string) {
  const path = `polls/${pollId}`;
  try {
    await deleteDoc(doc(db, "polls", pollId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Real-time listener for live polls
export function subscribePolls(
  onSuccess: (polls: DevPollItem[]) => void,
  onError?: (err: any) => void
) {
  const path = "polls";
  const pollsCol = collection(db, "polls");

  return onSnapshot(
    pollsCol,
    (snapshot) => {
      const items: DevPollItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.question && data.options) {
          items.push({
            id: docSnap.id,
            category: data.category || "Mollywood",
            badge: data.badge || "Live Vote",
            question: data.question,
            totalVotes: data.totalVotes || 0,
            options: Array.isArray(data.options) ? data.options : []
          });
        }
      });
      onSuccess(items);
    },
    (error) => {
      console.warn("Polls Firestore snapshot listener error:", error);
      if (onError) onError(error);
    }
  );
}

// Record a vote in Firestore with atomic transaction
export async function voteOnPollInFirestore(
  pollId: string,
  optionId: string,
  userId: string,
  previousOptionId?: string
) {
  const pollRef = doc(db, "polls", pollId);
  const voteRef = doc(db, "poll_votes", `${userId}_${pollId}`);

  try {
    await runTransaction(db, async (transaction) => {
      const pollDoc = await transaction.get(pollRef);
      if (!pollDoc.exists()) {
        throw new Error("Poll does not exist.");
      }

      const data = pollDoc.data();
      const options: { id: string; text: string; votes: number }[] = data.options || [];
      let totalVotes = data.totalVotes || 0;

      const updatedOptions = options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (previousOptionId && opt.id === previousOptionId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      });

      if (!previousOptionId) {
        totalVotes += 1;
      }

      transaction.update(pollRef, {
        options: updatedOptions,
        totalVotes: totalVotes,
        updatedAt: new Date().toISOString()
      });

      transaction.set(voteRef, {
        id: `${userId}_${pollId}`,
        pollId,
        userId,
        optionId,
        votedAt: new Date().toISOString()
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `polls/${pollId}`);
  }
}

// Subscribe to user's poll votes to restore selected state
export function subscribeUserPollVotes(
  userId: string,
  onSuccess: (userVotesMap: Record<string, string>) => void
) {
  const q = query(collection(db, "poll_votes"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const votesMap: Record<string, string> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.pollId && data.optionId) {
          votesMap[data.pollId] = data.optionId;
        }
      });
      onSuccess(votesMap);
    },
    (error) => {
      console.warn("User poll votes snapshot error:", error);
    }
  );
}

// Seed initial polls if collection is empty
export async function seedInitialPollsIfEmpty(initialPolls: DevPollItem[]) {
  try {
    const snap = await getDocs(collection(db, "polls"));
    if (snap.empty) {
      for (const p of initialPolls) {
        await savePollToFirestore(p);
      }
    }
  } catch (e) {
    console.warn("Could not seed initial polls:", e);
  }
}

// --- PUBLISHED ARTICLES FIRESTORE SYNC ---

// Save or create article in Firestore
export async function saveMedicalArticleToFirestore(article: MedicalArticle) {
  const path = `published_articles/${article.id}`;
  try {
    await setDoc(doc(db, "published_articles", article.id), {
      ...article,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update article status in Firestore
export async function updateMedicalArticleStatusInFirestore(
  articleId: string,
  newStatus: MedicalArticleStatus
) {
  const path = `published_articles/${articleId}`;
  try {
    const docRef = doc(db, "published_articles", articleId);
    await setDoc(
      docRef,
      {
        status: newStatus,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete article from Firestore
export async function deleteMedicalArticleFromFirestore(articleId: string) {
  const path = `published_articles/${articleId}`;
  try {
    await deleteDoc(doc(db, "published_articles", articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to articles in real-time
export function subscribeMedicalArticles(
  onSuccess: (articles: MedicalArticle[]) => void,
  onError?: (err: any) => void
) {
  const medCol = collection(db, "published_articles");

  return onSnapshot(
    medCol,
    (snapshot) => {
      const items: MedicalArticle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.title) {
          items.push({
            id: docSnap.id,
            title: data.title,
            category: data.category || "General",
            excerpt: data.excerpt || "",
            doctorName: data.doctorName || "Editorial Staff",
            doctorAvatar: data.doctorAvatar || undefined,
            date: data.date || "2025-01-01",
            views: data.views || 0,
            status: (data.status as MedicalArticleStatus) || "Active",
            imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
            content: Array.isArray(data.content) ? data.content : [],
            keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : []
          });
        }
      });
      onSuccess(items);
    },
    (error) => {
      console.warn("Published articles Firestore snapshot listener warning:", error);
      if (onError) onError(error);
    }
  );
}

// Seed initial articles if empty
export async function seedInitialMedicalArticlesIfEmpty(initialArticles: MedicalArticle[]) {
  try {
    const snap = await getDocs(collection(db, "published_articles"));
    if (snap.empty) {
      for (const article of initialArticles) {
        await saveMedicalArticleToFirestore(article);
      }
    }
  } catch (e) {
    console.warn("Could not seed initial articles:", e);
  }
}

// --- DEV ROLES FIRESTORE SYNC ---

// Save or update dev role in Firestore
export async function saveDevRoleToFirestore(role: DevRoleEntry) {
  const path = `dev_roles/${role.id}`;
  try {
    await setDoc(doc(db, "dev_roles", role.id), {
      ...role,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn("Dev role save warning:", error);
  }
}

// Delete dev role from Firestore
export async function deleteDevRoleFromFirestore(roleId: string) {
  const path = `dev_roles/${roleId}`;
  try {
    await deleteDoc(doc(db, "dev_roles", roleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to dev roles in real-time
export function subscribeDevRoles(
  onSuccess: (roles: DevRoleEntry[]) => void,
  onError?: (err: any) => void
) {
  const rolesCol = collection(db, "dev_roles");

  return onSnapshot(
    rolesCol,
    (snapshot) => {
      const items: DevRoleEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.roleName && data.assignedUser) {
          items.push({
            id: docSnap.id,
            roleName: data.roleName,
            assignedUser: data.assignedUser,
            email: data.email || "dev@flickpulse.com",
            permissions: Array.isArray(data.permissions) ? data.permissions : [],
            status: data.status || "Active",
            registeredAt: data.registeredAt || new Date().toISOString().split("T")[0]
          });
        }
      });
      onSuccess(items);
    },
    (error) => {
      console.warn("Dev roles Firestore snapshot listener warning:", error);
      if (onError) onError(error);
    }
  );
}

// Seed initial dev roles if empty
export async function seedInitialDevRolesIfEmpty(initialRoles: DevRoleEntry[]) {
  try {
    const snap = await getDocs(collection(db, "dev_roles"));
    if (snap.empty) {
      for (const role of initialRoles) {
        await saveDevRoleToFirestore(role);
      }
    }
  } catch (e) {
    console.warn("Could not seed initial dev roles:", e);
  }
}


// --- MOVIE REVIEWS FIRESTORE SYNC ---

// Save or update Movie Review in Firestore
export async function saveMovieReviewToFirestore(item: MovieReviewItem) {
  const path = `movie_reviews/${item.id}`;
  try {
    await setDoc(doc(db, "movie_reviews", item.id), {
      ...item,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Movie Review from Firestore
export async function deleteMovieReviewFromFirestore(id: string) {
  const path = `movie_reviews/${id}`;
  try {
    await deleteDoc(doc(db, "movie_reviews", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Movie Reviews in real-time
export function subscribeMovieReviews(
  onSuccess: (reviews: MovieReviewItem[]) => void,
  onError?: (err: any) => void
) {
  const revCol = collection(db, "movie_reviews");
  return onSnapshot(
    revCol,
    (snapshot) => {
      const items: MovieReviewItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.movieTitle) {
          items.push({
            id: docSnap.id,
            movieTitle: data.movieTitle,
            posterUrl: data.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
            releaseYear: data.releaseYear || "2025",
            duration: data.duration || "2h 30m",
            genres: Array.isArray(data.genres) ? data.genres : ["Action", "Drama"],
            director: data.director || "Director",
            cast: Array.isArray(data.cast) ? data.cast : [],
            synopsis: data.synopsis || "Movie synopsis...",
            averageRating: data.averageRating || 9.0,
            totalVotes: data.totalVotes || 1250,
            ratingDistribution: data.ratingDistribution || {
              stars10: 45, stars9: 30, stars8: 15, stars7: 5, stars6: 2,
              stars5: 1, stars4: 1, stars3: 0, stars2: 0, stars1: 1
            },
            reviews: Array.isArray(data.reviews) ? data.reviews : []
          });
        }
      });
      onSuccess(items);
    },
    (error) => {
      console.warn("Movie Reviews Firestore snapshot listener warning:", error);
      if (onError) onError(error);
    }
  );
}

// Submit user rating & review score to Firestore with UPSERT operation logic
export async function submitUserRatingToFirestore(
  movieId: string,
  userReview: UserReview,
  movieMeta?: {
    movieTitle?: string;
    posterUrl?: string;
    category?: string;
    synopsis?: string;
    languages?: string[];
    cast?: string[];
    whereToWatch?: string;
  }
) {
  const userKey = (userReview.userEmail || userReview.userName || "anonymous").toLowerCase().replace(/[^a-z0-9]/g, "_");
  const userRatingDocId = `${userKey}_${movieId}`;
  const userRatingRef = doc(db, "user_movie_ratings", userRatingDocId);
  const movieRef = doc(db, "movie_reviews", movieId);

  try {
    await runTransaction(db, async (transaction) => {
      const existingUserRatingDoc = await transaction.get(userRatingRef);
      const movieDoc = await transaction.get(movieRef);

      let oldScore: number | null = null;
      if (existingUserRatingDoc.exists()) {
        const existingData = existingUserRatingDoc.data();
        oldScore = existingData.userScore || null;
      }

      // Upsert into user_movie_ratings collection
      transaction.set(userRatingRef, {
        id: userRatingDocId,
        userId: userKey,
        userEmail: userReview.userEmail || "devfourflicks@gmail.com",
        userName: userReview.userName || "Verified Critic",
        userAvatar: userReview.userAvatar || "",
        movieId: movieId,
        movieTitle: movieMeta?.movieTitle || "Movie Title",
        posterUrl: movieMeta?.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
        category: movieMeta?.category || "Mollywood",
        synopsis: movieMeta?.synopsis || "",
        languages: movieMeta?.languages || ["Malayalam", "English"],
        cast: movieMeta?.cast || [],
        whereToWatch: movieMeta?.whereToWatch || "Prime Video",
        userScore: userReview.userScore,
        reviewTitle: userReview.reviewTitle || "User Rating",
        reviewComment: userReview.reviewComment || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // If movie doc exists, update aggregate stats using UPSERT logic
      if (movieDoc.exists()) {
        const data = movieDoc.data() as MovieReviewItem;
        const currentReviews = data.reviews || [];
        const currentVotes = data.totalVotes || 0;
        const currentAvg = data.averageRating || 8.0;
        const dist = { ...data.ratingDistribution };

        let newVotes = currentVotes;
        let newTotalPoints = currentAvg * currentVotes;

        if (oldScore !== null) {
          // Update existing vote
          newTotalPoints = newTotalPoints - oldScore + userReview.userScore;
          const oldKey = `stars${Math.min(10, Math.max(1, Math.round(oldScore)))}` as keyof typeof dist;
          if (dist[oldKey] !== undefined && dist[oldKey] > 0) {
            dist[oldKey] -= 1;
          }
        } else {
          // New vote
          newVotes += 1;
          newTotalPoints += userReview.userScore;
        }

        const newAvg = Number((newTotalPoints / (newVotes || 1)).toFixed(1));
        const newKey = `stars${Math.min(10, Math.max(1, Math.round(userReview.userScore)))}` as keyof typeof dist;
        if (dist[newKey] !== undefined) {
          dist[newKey] = (dist[newKey] || 0) + 1;
        }

        // Filter out old review by same user email if exists
        const filteredReviews = currentReviews.filter((r) => r.userEmail !== userReview.userEmail);

        transaction.update(movieRef, {
          totalVotes: newVotes,
          averageRating: newAvg,
          ratingDistribution: dist,
          reviews: [userReview, ...filteredReviews],
          updatedAt: new Date().toISOString()
        });
      }
    });
  } catch (error) {
    console.warn("Submit rating UPSERT transaction warning:", error);
  }
}

// Subscribe to all live user movie rating records in real-time
export function subscribeAllUserMovieRatings(
  onSuccess: (records: LiveUserMovieRatingRecord[]) => void,
  onError?: (err: any) => void
) {
  const ratingsCol = collection(db, "user_movie_ratings");
  return onSnapshot(
    ratingsCol,
    (snapshot) => {
      const items: LiveUserMovieRatingRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userEmail && data.movieId) {
          items.push({
            id: docSnap.id,
            userId: data.userId || "user",
            userEmail: data.userEmail,
            userName: data.userName || "User",
            userAvatar: data.userAvatar || "",
            movieId: data.movieId,
            movieTitle: data.movieTitle || "Movie",
            posterUrl: data.posterUrl || "",
            category: data.category || "Mollywood",
            synopsis: data.synopsis || "",
            userScore: data.userScore || 10,
            reviewTitle: data.reviewTitle || "",
            reviewComment: data.reviewComment || "",
            updatedAt: data.updatedAt || new Date().toISOString(),
            languages: Array.isArray(data.languages) ? data.languages : [],
            cast: Array.isArray(data.cast) ? data.cast : [],
            whereToWatch: data.whereToWatch || ""
          });
        }
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      onSuccess(items);
    },
    (error) => {
      console.warn("User movie ratings snapshot listener error:", error);
      if (onError) onError(error);
    }
  );
}

// Wipe all user movie ratings and reset rating engine in Firestore
export async function wipeAllUserMovieRatingsFromFirestore() {
  try {
    const snap = await getDocs(collection(db, "user_movie_ratings"));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, "user_movie_ratings", d.id));
    }
  } catch (e) {
    console.warn("Wipe ratings error:", e);
  }
}

// Seed initial movie reviews if empty
export async function seedInitialMovieReviewsIfEmpty(initial: MovieReviewItem[]) {
  try {
    const snap = await getDocs(collection(db, "movie_reviews"));
    if (snap.empty) {
      for (const item of initial) {
        await saveMovieReviewToFirestore(item);
      }
    }
  } catch (e) {
    console.warn("Could not seed initial movie reviews:", e);
  }
}

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
};
export type { User };

