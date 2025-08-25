import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SortOrder } from "@/types/review";
import { COLORS } from "@/constants";
import { Rating } from "./Rating";
import { ReviewForm } from "./ReviewForm";
import { ButtonWithArrow } from "./ButtonWithArrow";

import { ReviewList } from "./ReviewList";
import { Button } from "./Button";
import { Edit } from "lucide-react";
import { useReviewListByLocationQuery } from "@/queries/review";
import { useModal } from "@/hooks/useModal";
import { FilterTags } from "./FilterTags";

interface ReviewSummaryProps {
  districtName?: string;
  dongName: string;
  className?: string;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  districtName,
  dongName,
  className = "",
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const {
    data: reviewListData,
    isError: reviewListIsError,
    isLoading: reviewListIsLoading,
  } = useReviewListByLocationQuery({
    districtName,
    dongName,
  });

  const handleViewAllReviews = () => {
    const location = districtName ? `${districtName} ${dongName}` : dongName;
    router.push(`/reviews?location=${encodeURIComponent(location)}`);
  };

  const handleWriteReview = () => {
    openModal(
      <ReviewForm
        dongName={dongName}
        districtName={districtName}
        onClose={closeModal}
        onSuccess={closeModal}
      />,
    );
  };

  const handleLike = (reviewId: string) => {
    console.log(`리뷰 ${reviewId} 좋아요 토글`);
    // TODO: 실제 좋아요 API 호출
  };

  // API 데이터를 그대로 사용 (ReviewCard에서 변환 처리)
  const reviews = useMemo(() => {
    if (!reviewListData?.pages) return [];

    return reviewListData.pages.flatMap((page) => page.data.reviews);
  }, [reviewListData]);

  // 평점 계산
  const averageRating = useMemo(() => {
    if (!reviewListData?.pages) return 0;
    const allRatings = reviewListData.pages.flatMap((page) =>
      page.data.reviews.map((review) => review.rating),
    );
    return allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;
  }, [reviewListData]);

  // 로딩 상태
  if (reviewListIsLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 리뷰</h3>
        <div className="text-center py-8 text-gray-500">
          <p>리뷰를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 데이터 없음
  if (reviewListIsError || !reviews.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 리뷰</h3>
        <div className="text-center py-4 text-gray-500">
          <p>
            {reviewListIsError
              ? "리뷰를 불러올 수 없습니다."
              : "아직 등록된 리뷰가 없습니다."}
          </p>
          <p className="mt-2" style={{ color: COLORS.PRIMARY }}>
            {dongName}에 대한 인상을 리뷰해주세요!
          </p>
          <Button
            variant="outline"
            size="wide"
            onClick={handleWriteReview}
            className="mt-4"
          >
            <Edit className="w-4 h-4" />내 리뷰 등록하러가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 헤더 */}
      <h3 className="text-lg font-semibold text-gray-900">동네 안전 리뷰</h3>

      {/* 평점 */}
      <Rating rating={averageRating} />

      {/* 키워드 그래프 (API 연결 필요) */}
      {/* <div className="flex flex-col gap-4">
        {dongReview.topKeywords.slice(0, 3).map((keyword, index) => (
          <LineGraph
            key={index}
            keyword={keyword.keyword}
            count={keyword.count}
            totalCount={dongReview.totalCount}
          />
        ))}
      </div> */}

      {/* 전체 리뷰 보러가기 */}
      <ButtonWithArrow onClick={handleViewAllReviews}>
        전체 리뷰 보러가기
      </ButtonWithArrow>

      {/* 필터 버튼 */}
      <FilterTags sortOrder={sortOrder} setSortOrder={setSortOrder} />
      {/* 리뷰 목록 */}
      <ReviewList
        reviews={reviews}
        sortOrder={sortOrder}
        maxDisplay={4}
        onLike={handleLike}
        reviewListIsError={reviewListIsError}
      />

      {/* 리뷰 등록 섹션 */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <p
          className="text-md text-center font-medium"
          style={{ color: COLORS.PRIMARY }}
        >
          {dongName}에 대한 인상을 리뷰해주세요!
        </p>
        <Button variant="outline" size="wide" onClick={handleWriteReview}>
          <Edit className="w-4 h-4" />내 리뷰 등록하러가기
        </Button>
      </div>
    </div>
  );
};
