import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, Comment } from "@/types/community";

const API_BASE_URL = "http://localhost:3001";

interface CreatePostData {
  title: string;
  content: string;
  category: string;
  location?: string;
  date?: string;
  max_participants?: number;
}

interface ServerPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  location: string;
  date: string;
  min_participants: number;
  max_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
  author_id: number | null;
  views?: number;
  comments_count?: number;
  likes_count?: number;
  is_liked?: string | boolean;
}

interface PostsResponse {
  success: boolean;
  data: ServerPost[];
  filter: string | null;
}

// 서버 데이터를 클라이언트 타입으로 변환
const transformServerPost = (
  serverPost: ServerPost,
): Post & { _createdAt: string } => {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}주 전`;
  };

  return {
    id: serverPost.id,
    region: serverPost.location,
    createdAgo: getTimeAgo(serverPost.created_at),
    category: serverPost.category as Post["category"],
    participants: {
      current: 0, // 서버에서 참가자 수 정보가 없어 임시로 0
      max: serverPost.max_participants,
    },
    title: serverPost.title,
    excerpt: serverPost.content,
    author: {
      name: "익명", // 서버에서 작성자 정보가 없어 임시
    },
    stats: {
      views: serverPost.views || 0,
      comments: serverPost.comments_count || 0,
      likes: serverPost.likes_count || 0,
    },
    is_liked: serverPost.is_liked === true || serverPost.is_liked === "true",
    date: serverPost.date, // 모임 날짜 정보 추가
    _createdAt: serverPost.created_at, // 정렬을 위한 원본 생성 시간 보존
  };
};

// 클라이언트 카테고리를 서버 카테고리로 변환
const mapCategoryToServer = (clientCategory: string): string | undefined => {
  const categoryMap: Record<string, string> = {
    "안전 수리": "수리",
    "소분 모임": "소분",
    "취미·기타": "취미",
    일반: "일반",
  };
  return categoryMap[clientCategory];
};

// 게시글 목록 조회
export const usePostsQuery = (category?: string) => {
  return useQuery({
    queryKey: ["posts", category],
    queryFn: async (): Promise<{ posts: Post[] }> => {
      const params = new URLSearchParams();
      if (category && category !== "전체") {
        const serverCategory = mapCategoryToServer(category);
        if (serverCategory) {
          params.set("category", serverCategory);
        }
      }

      const headers: Record<string, string> = {};

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts?${params}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const serverResponse: PostsResponse = await response.json();
      const transformedPosts = serverResponse.data.map(transformServerPost);

      return { posts: transformedPosts as Post[] };
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

// 특정 게시글 조회
export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async (): Promise<Post> => {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const serverResponse = await response.json();
      // 서버에서 단일 게시글은 data 안에 들어있을 수 있음
      const serverPost = serverResponse.data || serverResponse;

      return transformServerPost(serverPost);
    },
    enabled: !!postId,
  });
};

// 게시글 생성
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<unknown> => {
      // 서버가 기대하는 형식으로 데이터 변환
      const serverCategory =
        mapCategoryToServer(data.category) || data.category;

      const serverData: Record<string, unknown> = {
        title: data.title,
        content: data.content,
        category: serverCategory,
      };

      // 일반 게시글이 아닌 경우에만 모임 관련 필드 추가
      if (serverCategory !== "일반") {
        serverData.location = data.location || "";
        serverData.date = data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString();
        serverData.min_participants = 1;
        serverData.max_participants = data.max_participants || 10;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers,
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      return response.json();
    },
    onSuccess: () => {
      // 게시글 목록 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 모임 참가
export const useJoinMeetupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onSuccess: (_, postId) => {
      // 특정 게시글과 게시글 목록을 새로고침
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 모임 탈퇴
export const useLeaveMeetupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string): Promise<void> => {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/leave`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onSuccess: (_, postId) => {
      // 특정 게시글과 게시글 목록을 새로고침
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 참가자 상태 확인
export const useParticipantStatusQuery = (postId: string) => {
  return useQuery({
    queryKey: ["participant", postId],
    queryFn: async (): Promise<{
      isParticipant: boolean;
      isAuthor: boolean;
    }> => {
      const headers: Record<string, string> = {};

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/participants`,
        {
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

// 댓글 생성
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }): Promise<unknown> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ content }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      return response.json();
    },
    onSuccess: (_, { postId }) => {
      // 댓글 목록과 게시글 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};

// 좋아요 토글
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      postId: string,
    ): Promise<{ liked: boolean; like_count: number }> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (_, postId) => {
      // 좋아요 상태만 새로고침 (게시글 전체 정보는 새로고침하지 않음)
      queryClient.invalidateQueries({ queryKey: ["likeStatus", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 좋아요 상태 조회
export const useLikeStatusQuery = (postId: string) => {
  return useQuery({
    queryKey: ["likeStatus", postId],
    queryFn: async (): Promise<{ liked: boolean; like_count: number }> => {
      const headers: Record<string, string> = {};

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/likes`,
        {
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // 서버에서 is_liked를 liked로 변환
      return {
        liked: result.data.is_liked,
        like_count: result.data.like_count,
      };
    },
    enabled: !!postId,
    staleTime: 0, // 즉시 새로고침
  });
};

// 댓글 조회
export const useCommentsQuery = (
  postId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      const headers: Record<string, string> = {};

      // 임시 토큰이 있으면 Authorization 헤더에 추가
      const tempToken = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;
      if (tempToken && tempToken !== "your_temp_token_here") {
        headers.Authorization = `Bearer ${tempToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // 서버에서 { data: { comments: [...] } } 형태로 반환
      if (result.data && result.data.comments) {
        return result.data.comments;
      }
      return result.data || result;
    },
    enabled: !!postId && options?.enabled !== false,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};
