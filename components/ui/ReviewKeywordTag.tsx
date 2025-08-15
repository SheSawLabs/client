import React from "react";
import { ReviewKeyword } from "@/types/review";
import { Tag } from "./Tag";

interface ReviewKeywordTagProps {
  keywords: ReviewKeyword[];
  className?: string;
}

export const ReviewKeywordTag: React.FC<ReviewKeywordTagProps> = ({
  keywords,
  className = "",
}) => {
  if (keywords.length === 0) return null;

  const firstKeyword = keywords[0];
  const remainingCount = keywords.length - 1;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Tag label={firstKeyword.keyword} />
      {remainingCount > 0 && <Tag label={`+${remainingCount}`} />}
    </div>
  );
};
