export type MedicalArticleStatus = "Active" | "Pending" | "Draft" | "Scheduled";

export interface MedicalArticle {
  id: string;
  title: string;
  category: string; // e.g. Cinema, Movie Reviews, Mollywood, Bollywood, etc.
  excerpt: string;
  doctorName: string; // Author/Writer Name
  doctorAvatar?: string;
  date: string;
  views: number;
  status: MedicalArticleStatus;
  imageUrl: string;
  content?: string[];
  keyTakeaways?: string[];
  publishedAt?: string;
  cardType?: CardType;
  bgImageUrl?: string;
  galleryImages?: string[];
  pollQuestion?: string;
  pollOptions?: string[];
  pollImageUrl?: string;
  videoUrl?: string;
  videoType?: "link" | "raw";
  movieRating?: number;
  movieTitle?: string;
  director?: string;
  cast?: string;
  genre?: string;
  releaseYear?: string;
  verdict?: string;
  pros?: string[];
  cons?: string[];
  pushAlertSent?: boolean;
  pinPosition?: number;
}

export interface PressEmployeeDetails {
  employeeId: string;
  position: string;
  department: string;
  companyName: string;
  joiningDate: string;
  bloodGroup?: string;
  issuingAuthority?: string;
}

export interface DevRoleEntry {
  id: string;
  roleName: string;
  assignedUser: string;
  email: string;
  username?: string;
  password?: string;
  permissions: string[];
  status: "Active" | "Pending" | "Suspended";
  registeredAt: string;
}

export type NewsCategory = 
  | "All"
  | "Cinema"
  | "Movie Reviews"
  | "Mollywood"
  | "Kollywood"
  | "Bollywood"
  | "Tollywood"
  | "Hollywood"
  | "Movies & TV Shows"
  | "OTT Releases"
  | "Box Office"
  | "Movie Trailers"
  | "Cinema News"
  | "Music & Podcasts"
  | "Gaming & Live Streaming"
  | "Celebrity & Pop Culture"
  | "Live Events & Shows"
  | "Football"
  | "Gaming"
  | "Pan-India"
  | "Red Carpet"
  | "Fashion";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  category?: string;
  badge?: string;
}

export type Poll = PollData;

export type CardType = "article" | "poll" | "video" | "gallery" | "movie";

export interface CastMember {
  name: string;
  character: string;
  avatar?: string;
}

export interface StreamingPlatform {
  platform: string;
  logoUrl?: string;
  quality?: string;
}

export interface UserReview {
  id: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userScore: number; // 1-10
  reviewTitle: string;
  reviewComment: string;
  date: string;
}

export interface LiveUserMovieRatingRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  category?: string;
  synopsis?: string;
  userScore: number;
  reviewTitle?: string;
  reviewComment?: string;
  updatedAt: string;
  languages?: string[];
  cast?: string[];
  whereToWatch?: string;
}

export interface MovieReviewItem {
  id: string;
  movieTitle: string;
  posterUrl: string;
  releaseYear: string;
  duration?: string;
  genres: string[];
  director?: string;
  cast?: string[];
  synopsis?: string;
  averageRating: number; // 1-10
  totalVotes: number;
  ratingDistribution: {
    stars10: number;
    stars9: number;
    stars8: number;
    stars7: number;
    stars6: number;
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
  };
  reviews: UserReview[];
}

export interface MovieDetails {
  rating: number;
  voteCount?: string;
  releaseYear?: string;
  duration?: string;
  genres?: string[];
  synopsis: string;
  languages: string[];
  cast: CastMember[];
  director: string;
  streamingOn: StreamingPlatform[];
  trailerUrl?: string;
  posterUrl?: string;
  userRating?: number;
  reviews?: UserReview[];
}

export interface Article {
  id: string;
  cardType?: CardType;
  title: string;
  subtitle: string;
  category: NewsCategory;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publisher: string;
  publisherLogo?: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  galleryImages?: string[];
  galleryCaptions?: string[];
  movieDetails?: MovieDetails;
  summary: string;
  keyTakeaways: string[];
  content: string[]; // Array of paragraphs for granular text selection & reading
  likesCount: number;
  sharesCount: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  poll?: PollData;
  videoUrl?: string;
  videoDuration?: string;
  userInterest?: "interested" | "not_interested";
}

export interface TextHighlight {
  id: string;
  articleId: string;
  articleTitle: string;
  text: string;
  paragraphIndex: number;
  color: "yellow" | "teal" | "purple" | "coral";
  timestamp: string;
}

export type ThemePalette = "teal" | "peach" | "violet" | "forest" | "monet";

export interface ThemeConfig {
  palette: ThemePalette;
  darkMode: boolean;
  useDeviceFrame: boolean;
  deviceModel: "pixel" | "galaxy" | "edge";
}
