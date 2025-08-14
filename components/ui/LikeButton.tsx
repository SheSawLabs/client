import React from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  count: number;
  isLiked: boolean;
  onClick: () => void;
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  count,
  isLiked,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
        isLiked
          ? "bg-blue-50 text-blue-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
    >
      <ThumbsUp className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
      <span className="font-medium">도움됨</span>
      <span>{count}</span>
    </button>
  );
};
