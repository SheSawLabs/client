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

      return result;
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
