import React from "react";
import { Review } from "@/types/review";
import { ReviewKeywordTag } from "./ReviewKeywordTag";
import { LikeButton } from "./LikeButton";

interface ReviewCardProps {
  review: Review;
  onLike: (reviewId: string) => void;
  className?: string;
}

const calculateDaysAgo = (dateString: string): string => {
  const reviewDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  return (
    <div className={`p-4 bg-gray-50 rounded-lg space-y-3 ${className}`}>
      {/* 사용자 정보 */}
      <div className="flex items-center gap-3">
        <img
          src={review.user.profileImage}
          alt={review.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {review.user.name}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{daysAgo}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{review.dongName}</span>
          </div>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
        {review.content}
      </p>

      {/* 키워드 태그와 좋아요 버튼 */}
      <div className="flex items-center justify-between">
        <ReviewKeywordTag keywords={review.keywords} />
        <LikeButton
          count={review.likeCount}
          isLiked={review.isLiked}
          onClick={handleLike}
        />
      </div>
    </div>
  );
};
