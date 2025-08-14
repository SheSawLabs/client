import { useQuery } from "@tanstack/react-query";

interface UseReviewListByLocationQueryParams {
  districtName?: string;
  dongName?: string;
  limit?: number;
}

interface Review {
  id: string;
  reviewText: string;
  location: string;
  rating: number;
  totalScore: number;
  grade: string;
  created_at: Date;
}

interface ReviewListResponse {
  reviews: Review[];
}

export const useReviewListByLocationQuery = ({
  districtName,
  dongName,
  limit = 20, // 기본값 설정
}: UseReviewListByLocationQueryParams) => {
  return useQuery({
    queryKey: ["reviewList", districtName, dongName],
    queryFn: async (): Promise<ReviewListResponse> => {
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

      // TODO: 실제 API 엔드포인트로 교체 필요
      const response = await fetch(
        `/api/reviews/list?location=${encodedLocation}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("리뷰 데이터를 불러오는데 실패했습니다");
      }

      return response.json();
    },
    enabled: !!districtName, // districtName이 있을 때만 쿼리 실행
  });
};
