import React from "react";
import { ReviewKeyword } from "@/types/review";

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
      <span
        className="inline-flex items-center text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded"
        style={{
          color: "#1F2937",
        }}
      >
        {firstKeyword.keyword}
      </span>
      {remainingCount > 0 && (
        <span
          className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded"
          style={{
            color: "#1F2937",
          }}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};
