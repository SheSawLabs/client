import React from "react";
import { Review, SortOrder } from "@/types/review";
import { ReviewCard } from "./ReviewCard";

interface ReviewListProps {
  reviews: Review[];
  sortOrder: SortOrder;
  maxDisplay?: number;
  onLike: (reviewId: string) => void;
  className?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  sortOrder,
  maxDisplay = 4,
  onLike,
  className = "",
}) => {
  // 정렬 기준에 따라 리뷰 정렬
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    if (sortOrder === "recent") {
      return dateB - dateA; // 최신순
    } else {
      return dateA - dateB; // 등록순 (오래된 순)
    }
  });

  // 최대 표시 개수만큼 제한
  const displayReviews = sortedReviews.slice(0, maxDisplay);

  return (
    <div className={`space-y-3 ${className}`}>
      {displayReviews.map((review) => (
        <ReviewCard key={review.id} review={review} onLike={onLike} />
      ))}
    </div>
  );
};
