import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SortOrder, Review } from "@/types/review";
import { COLORS } from "@/constants";
import { Rating } from "./Rating";
import { ReviewForm } from "./ReviewForm";
import { ButtonWithArrow } from "./ButtonWithArrow";
import { FilterTag } from "./FilterTag";
import { ReviewList } from "./ReviewList";
import { Button } from "./Button";
import { Edit } from "lucide-react";
import { useReviewListByLocationQuery } from "@/queries/review";
import { useModal } from "@/hooks/useModal";

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
  const { openModal } = useModal();

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
        onClose={() => {}}
        onSuccess={() => {
          // 리뷰 등록 성공 시 자동으로 쿼리가 invalidate됩니다
        }}
      />,
    );
  };

  const handleLike = (reviewId: string) => {
    console.log(`리뷰 ${reviewId} 좋아요 토글`);
    // TODO: 실제 좋아요 API 호출
  };

  // API 데이터를 기존 구조로 변환
  const convertedReviews: Review[] = useMemo(() => {
    if (!reviewListData?.pages) return [];

    return reviewListData.pages.flatMap((page) =>
      page.data.reviews.map((review) => ({
        id: review.id,
        content: review.reviewText, // reviewText -> content 변환
        user: {
          id: review.id, // 임시로 같은 ID 사용
          name: "익명", // API에서 제공하지 않으므로 기본값
          profileImage:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", // 기본 이미지
        },
        keywords: [], // API에서 제공하지 않으므로 빈 배열
        likeCount: 0, // API에서 제공하지 않으므로 0
        isLiked: false, // API에서 제공하지 않으므로 false
        createdAt: review.created_at, // created_at -> createdAt 변환
        dongName: dongName,
      })),
    );
  }, [reviewListData, dongName]);

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
  if (reviewListIsError || !convertedReviews.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 리뷰</h3>
        <div className="text-center py-8 text-gray-500">
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
      <div className="flex gap-2">
        <FilterTag
          label="최신순"
          isActive={sortOrder === "recent"}
          onClick={() => setSortOrder("recent")}
        />
        <FilterTag
          label="등록순"
          isActive={sortOrder === "oldest"}
          onClick={() => setSortOrder("oldest")}
        />
      </div>

      {/* 리뷰 목록 */}
      <ReviewList
        reviews={convertedReviews}
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
