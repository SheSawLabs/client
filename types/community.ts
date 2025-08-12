export interface Post {
  id: string;
  region: string;
  createdAgo: string;
  category: "안전 수리" | "소분 모임" | "취미·기타" | "일반";
  participants?: { current: number; max: number }; // 모집 인원 (소분 모임일 때만)
  title: string;
  excerpt: string;
  author: { name: string; avatarUrl?: string };
  stats: { views: number; comments: number; likes: number };
  is_liked?: boolean;
  date?: string; // 모임 날짜 정보 (ISO string format)
}

export interface CategoryTab {
  id: string;
  label: string;
  key: "전체" | "안전 수리" | "소분 모임" | "취미·기타" | "일반";
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

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author?: {
    name: string;
  };
}
