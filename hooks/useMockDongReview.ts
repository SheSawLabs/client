import { useState, useEffect } from "react";
import { DongReview } from "@/types/review";

export const useMockDongReview = (dongName: string): DongReview | null => {
  const [dongReview, setDongReview] = useState<DongReview | null>(null);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        const response = await fetch("/data/mockDongReviews.json");
        const mockData: DongReview[] = await response.json();

        // dongName과 일치하는 리뷰 데이터 찾기
        const matchedReview = mockData.find(
          (review) => review.dongName === dongName,
        );

        setDongReview(matchedReview || null);
      } catch (error) {
        console.error("Mock 데이터 로딩 실패:", error);
        setDongReview(null);
      }
    };

    if (dongName) {
      fetchMockData();
    }
  }, [dongName]);

  return dongReview;
};
