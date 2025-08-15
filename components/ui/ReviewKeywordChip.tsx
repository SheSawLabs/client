import React from "react";
import { Check, Plus } from "lucide-react";
import { COLORS } from "@/constants";

interface ReviewKeywordChipProps {
  keyword: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const ReviewKeywordChip: React.FC<ReviewKeywordChipProps> = ({
  keyword,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium
        transition-all duration-200 whitespace-nowrap
        ${className}
      `}
      style={{
        borderColor: isSelected ? COLORS.PRIMARY : COLORS.GRAY_200,
        backgroundColor: isSelected ? `${COLORS.PRIMARY}15` : COLORS.GRAY_100,
        color: isSelected ? COLORS.PRIMARY : COLORS.GRAY_800,
      }}
    >
      {isSelected ? (
        <Check className="w-4 h-4" style={{ color: COLORS.PRIMARY }} />
      ) : (
        <Plus className="w-4 h-4" style={{ color: COLORS.GRAY_800 }} />
      )}
      <span>{keyword}</span>
    </button>
  );
};
