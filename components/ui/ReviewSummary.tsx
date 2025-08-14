import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DongReview, SortOrder } from "@/types/review";
import { COLORS } from "@/constants";
import { Rating } from "./Rating";
import { LineGraph } from "./LineGraph";
import { ButtonWithArrow } from "./ButtonWithArrow";
import { FilterTag } from "./FilterTag";
import { ReviewList } from "./ReviewList";
import { Button } from "./Button";
import { Edit } from "lucide-react";

interface ReviewSummaryProps {
  dongReview: DongReview | null;
  dongName: string;
  className?: string;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  dongReview,
  dongName,
  className = "",
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const router = useRouter();

  const handleViewAllReviews = () => {
    router.push(`/reviews?location=${encodeURIComponent(dongName)}`);
  };

  const handleWriteReview = () => {
    console.log("모달 오픈");
  };

  const handleLike = (reviewId: string) => {
    console.log(`리뷰 ${reviewId} 좋아요 토글`);
    // TODO: 실제 좋아요 API 호출
  };

  if (!dongReview) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 리뷰</h3>
        <div className="text-center py-8 text-gray-500">
          <p>아직 등록된 리뷰가 없습니다.</p>
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
      <Rating rating={dongReview.rating} />

      {/* 키워드 그래프 */}
      <div className="flex flex-col gap-4">
        {dongReview.topKeywords.slice(0, 3).map((keyword, index) => (
          <LineGraph
            key={index}
            keyword={keyword.keyword}
            count={keyword.count}
            totalCount={dongReview.totalCount}
          />
        ))}
      </div>

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
        reviews={dongReview.reviews}
        sortOrder={sortOrder}
        maxDisplay={4}
        onLike={handleLike}
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
