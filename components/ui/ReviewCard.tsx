import React from "react";
import { User } from "lucide-react";
import { Review } from "@/types/review";
import { ReviewKeywordTag } from "./ReviewKeywordTag";
import { LikeButton } from "./LikeButton";
import { COLORS } from "@/constants";

interface ReviewCardProps {
  review: Review;
  onLike: (reviewId: string) => void;
  className?: string;
}

const calculateDaysAgo = (dateString: string): string => {
  // 날짜 문자열이 유효한지 확인

  console.log("dateString", dateString);
  if (!dateString) {
    return "날짜 정보 없음";
  }

  const reviewDate = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(reviewDate.getTime())) {
    console.error("Invalid date string:", dateString);
    return "날짜 오류";
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // diffDays가 NaN인지 확인
  if (isNaN(diffDays)) {
    console.error("NaN diffDays calculated from:", {
      dateString,
      reviewDate,
      now,
      diffTime,
    });
    return "계산 오류";
  }

  // 0일인 경우 "오늘"로 표시
  if (diffDays === 0) {
    return "오늘";
  }

  return `${diffDays}일 전`;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onLike,
  className = "",
}) => {
  const handleLike = () => {
    onLike(review.id);
  };

  const daysAgo = calculateDaysAgo(review.createdAt);

  // API 데이터를 컴포넌트에서 필요한 형태로 변환
  const dongName = review.location.split(" ").pop() || review.location; // "관악구 보라매동" -> "보라매동"

  // selectedKeywords를 ReviewKeywordTag가 기대하는 형태로 변환
  const transformedKeywords = review.selectedKeywords.map((item) => ({
    keyword: item.keyword,
    count: 1, // 기본값
  }));

  console.log("review>>", review);
  return (
    <div
      className={`p-4 border rounded-lg space-y-3 ${className}`}
      style={{
        borderColor: COLORS.GRAY_200,
        backgroundColor: COLORS.GRAY_100,
        color: COLORS.GRAY_800,
      }}
    >
      {/* 사용자 정보 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">익명</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{daysAgo}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{dongName}</span>
          </div>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
        {review.reviewText}
      </p>

      {/* 키워드 태그와 좋아요 버튼 */}
      <div className="flex items-center justify-between">
        <ReviewKeywordTag keywords={transformedKeywords} />
        <LikeButton count={0} isLiked={false} onClick={handleLike} />
      </div>
    </div>
  );
};
