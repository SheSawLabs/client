export interface Post {
  id: string;
  region: string;
  createdAgo: string;
  badge?: { label: string; tone: "default" | "success" | "secondary" };
  title: string;
  excerpt: string;
  author: { name: string; avatarUrl?: string };
  stats: { views: number; comments: number; likes: number };
}

export interface CategoryTab {
  id: string;
  label: string;
  key: "전체" | "안전 수리" | "소분 모임" | "취미·기타";
}

export interface SortOption {
  value: "등록순" | "최신순";
  label: string;
}

export type PostState = "loading" | "loaded" | "empty" | "error";

export interface CommunityFilters {
  category: CategoryTab["key"];
  isInterestOnly: boolean;
  sortBy: SortOption["value"];
}
