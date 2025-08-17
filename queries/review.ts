import { API_BASE_URL } from "@/constants";
import { Review } from "@/types/review";
import { ApiResponse } from "@/types/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAuthTokenFromCookie } from "@/utils/auth";

interface UseReviewListByLocationQueryParams {
  districtName?: string;
  dongName?: string;
  limit?: number;
}

interface ReviewListPagination {
  hasNext: boolean;
  nextCursor?: string;
  totalCount: number;
}

interface ReviewListData {
  reviews: Review[];
  pagination: ReviewListPagination;
}

type ReviewListApiResponse = ApiResponse<ReviewListData>;

// 사용자 정보 캐시 (메모리 캐시)
const userCache = new Map<
  string,
  { nickname: string; profile_image: string | null }
>();

// 사용자 정보 조회 유틸리티 함수
const fetchUserInfo = async (userId: string) => {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  try {
    const authToken = getAuthTokenFromCookie();
    const headers: Record<string, string> = {};

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // TODO: 실제로는 /auth/profile/{userId} 같은 API가 필요하지만,
    // 현재는 임시로 자신의 프로필 정보를 사용
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers,
    });

    if (response.ok) {
      const result = await response.json();
      const userInfo = {
        nickname: result.data.user.nickname,
        profile_image: result.data.user.profile_image,
      };
      userCache.set(userId, userInfo);
      return userInfo;
    }
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
  }

  // 캐시에 기본값 저장하여 반복 호출 방지
  const defaultInfo = { nickname: "익명", profile_image: null };
  userCache.set(userId, defaultInfo);
  return defaultInfo;
};

// 리뷰에 사용자 정보 추가하는 함수
const enrichReviewWithUserInfo = async (review: Review): Promise<Review> => {
  if (review.user_id) {
    const userInfo = await fetchUserInfo(review.user_id);
    return {
      ...review,
      author: userInfo,
    };
  }

  return {
    ...review,
    author: { nickname: "익명", profile_image: null },
  };
};

export const useReviewListByLocationQuery = ({
  districtName,
  dongName,
  limit = 20,
}: UseReviewListByLocationQueryParams) => {
  return useInfiniteQuery({
    queryKey: ["reviewList", districtName, dongName],
    queryFn: async ({ pageParam }): Promise<ReviewListApiResponse> => {
      // districtName이 없으면 호출하지 않음
      if (!districtName) {
        throw new Error("districtName은 필수입니다");
      }

      // location 파라미터 구성
      let location = districtName;
      if (dongName) {
        location = `${districtName} ${dongName}`;
      }

      // URL 인코딩
      const encodedLocation = encodeURIComponent(location);

      // 쿼리 파라미터 구성
      let url = `${API_BASE_URL}/api/review/list?location=${encodedLocation}&limit=${limit}`;
      if (pageParam) {
        url += `&cursor=${pageParam}`;
      }

      const authToken = getAuthTokenFromCookie();
      const headers: Record<string, string> = {};

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("리뷰 데이터를 불러오는데 실패했습니다");
      }

      const result: ReviewListApiResponse = await response.json();

      // 각 리뷰에 사용자 정보 추가
      const enrichedReviews = await Promise.all(
        result.data.reviews.map(enrichReviewWithUserInfo),
      );

      return {
        ...result,
        data: {
          ...result.data,
          reviews: enrichedReviews,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.pagination?.hasNext
        ? lastPage.data.pagination.nextCursor
        : undefined;
    },
    initialPageParam: undefined as string | undefined,
    enabled: !!districtName, // districtName이 있을 때만 쿼리 실행
  });
};
