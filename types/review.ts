export interface ReviewKeyword {
  keyword: string;
  count: number;
}

export interface ReviewUser {
  id: string;
  name: string;
  profileImage: string;
}

export interface Review {
  id: string;
  user: ReviewUser;
  content: string;
  keywords: ReviewKeyword[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  dongName: string;
}

export interface DongReview {
  rating: number;
  totalCount: number;
  topKeywords: ReviewKeyword[];
  reviews: Review[];
}

export type SortOrder = "recent" | "oldest";
