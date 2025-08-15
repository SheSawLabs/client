import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants";
import { ApiResponse } from "@/types/common";

// 키워드 데이터 타입
export interface KeywordCategory {
  [category: string]: string[];
}

interface KeywordsData {
  availableKeywords: KeywordCategory;
}

type KeywordsResponse = ApiResponse<KeywordsData>;

// 리뷰 등록 요청 타입
export interface ReviewSubmitRequest {
  reviewText: string;
  selectedKeywords: Array<{
    category: string;
    keyword: string;
  }>;
  rating: number;
  location: string;
  timeOfDay: string;
}

// 리뷰 등록 응답 타입
interface ReviewSubmitResponseData {
  reviewId: number;
  scoreResult: {
    totalScore: number;
    grade: string;
  };
  gptAnalysis: {
    recommendedKeywords: Array<{
      category: string;
      keyword: string;
      confidence: number;
    }>;
    emotionalSummary: string;
  };
}

type ReviewSubmitResponse = ApiResponse<ReviewSubmitResponseData>;

// 키워드 목록 조회
export const useReviewKeywordsQuery = () => {
  return useQuery({
    queryKey: ["reviewKeywords"],
    queryFn: async (): Promise<KeywordsResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/review/keywords`);

      if (!response.ok) {
        throw new Error("키워드 데이터를 불러오는데 실패했습니다");
      }

      return response.json();
    },
  });
};

// 리뷰 등록
export const useReviewSubmitMutation = (
  districtName?: string,
  dongName?: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: ReviewSubmitRequest,
    ): Promise<ReviewSubmitResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/api/review/analyze-complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("리뷰 등록에 실패했습니다");
      }

      return response.json();
    },
    onSuccess: () => {
      // 리뷰 등록 성공 시 리뷰 목록 쿼리 invalidate
      queryClient.invalidateQueries({
        queryKey: ["reviewList", districtName, dongName],
      });
    },
  });
};
