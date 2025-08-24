export interface ReviewKeyword {
  keyword: string;
  count: number;
}

export interface ReviewUser {
  id: string;
  name: string;
  profileImage: string;
}

export interface LegacyReview {
  id: string;
  user: ReviewUser;
  content: string;
  keywords: ReviewKeyword[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  dongName: string;
}

// API로부터 받는 실제 리뷰 데이터 타입
export interface Review {
  id: string;
  user_id: string | null;
  reviewText: string;
  location: string;
  timeOfDay: string;
  rating: number;
  selectedKeywords: Array<{
    keyword: string;
    category: string;
  }>;
  recommendedKeywords: ReviewKeyword[];
  scoreResult: {
    totalScore: number;
    safetyLevel: string;
    categoryScores: Record<string, number>;
    recommendations: string[];
  };
  contextAnalysis: {
    emotionalSummary: string;
    situationSummary: string;
  };
  analysisMethod: string;
  createdAt: string;
  updatedAt: string;
  nickname?: string | null;
}

export interface DongReview {
  rating: number;
  totalCount: number;
  topKeywords: ReviewKeyword[];
  reviews: LegacyReview[];
}

export type SortOrder = "recent" | "oldest";
